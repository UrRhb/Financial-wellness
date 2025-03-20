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
    // Get the access tokens from Supabase
    const { data: plaidItems, error } = await supabaseClient
      .from("plaid_items")
      .select("access_token, item_id")
      .eq("user_id", session.user.id)
      .eq("status", "active");

    if (error) throw error;
    if (!plaidItems || plaidItems.length === 0) {
      return new Response(JSON.stringify({ accounts: [] }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Get accounts for each access token
    const accountPromises = plaidItems.map(async (item) => {
      const response = await plaidClient.accountsGet({
        access_token: item.access_token,
      });

      // Get institution details
      const itemResponse = await plaidClient.itemGet({
        access_token: item.access_token,
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

      return response.data.accounts.map((account) => ({
        id: account.account_id,
        name: account.name,
        mask: account.mask,
        type: account.type,
        subtype: account.subtype,
        institution: institutionName,
        item_id: item.item_id,
        balance: {
          available: account.balances.available,
          current: account.balances.current,
          limit: account.balances.limit,
          currency: account.balances.iso_currency_code,
        },
      }));
    });

    const accountsArrays = await Promise.all(accountPromises);
    const accounts = accountsArrays.flat();

    return new Response(JSON.stringify({ accounts }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error getting accounts:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
