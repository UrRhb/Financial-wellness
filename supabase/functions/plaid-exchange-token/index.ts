import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Configuration, PlaidApi, PlaidEnvironments } from "npm:plaid";

serve(async (req) => {
  // Create a Supabase client with the Auth context of the logged in user
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    {
      global: {
        headers: { Authorization: req.headers.get("Authorization")! },
      },
    },
  );

  // Get the session or user
  const {
    data: { session },
  } = await supabaseClient.auth.getSession();

  if (!session) {
    return new Response(JSON.stringify({ error: "not_authenticated" }), {
      headers: { "Content-Type": "application/json" },
      status: 401,
    });
  }

  // Parse the request body
  const { public_token } = await req.json();

  if (!public_token) {
    return new Response(JSON.stringify({ error: "missing_public_token" }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }

  // Initialize the Plaid client
  const configuration = new Configuration({
    basePath: PlaidEnvironments.sandbox, // Use 'development' or 'production' for non-sandbox
    baseOptions: {
      headers: {
        "PLAID-CLIENT-ID": Deno.env.get("PLAID_CLIENT_ID") ?? "",
        "PLAID-SECRET": Deno.env.get("PLAID_SECRET") ?? "",
      },
    },
  });

  const plaidClient = new PlaidApi(configuration);

  try {
    // Exchange the public token for an access token
    const tokenResponse = await plaidClient.itemPublicTokenExchange({
      public_token: public_token,
    });

    const accessToken = tokenResponse.data.access_token;
    const itemId = tokenResponse.data.item_id;

    // Store the access token in Supabase
    const { error } = await supabaseClient.from("plaid_items").insert([
      {
        user_id: session.user.id,
        item_id: itemId,
        access_token: accessToken,
        status: "active",
      },
    ]);

    if (error) throw error;

    // Get institution details
    const itemResponse = await plaidClient.itemGet({
      access_token: accessToken,
    });

    const institutionId = itemResponse.data.item.institution_id;
    let institutionName = "Unknown Institution";

    if (institutionId) {
      const institutionResponse = await plaidClient.institutionsGetById({
        institution_id: institutionId,
        country_codes: ["US"],
      });
      institutionName = institutionResponse.data.institution.name;
    }

    // Get accounts
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    const accounts = accountsResponse.data.accounts.map((account) => ({
      id: account.account_id,
      name: account.name,
      mask: account.mask,
      type: account.type,
      subtype: account.subtype,
      institution: institutionName,
      balance: {
        available: account.balances.available,
        current: account.balances.current,
        limit: account.balances.limit,
      },
    }));

    return new Response(JSON.stringify({ success: true, accounts }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error exchanging public token:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
