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

  // Parse the request URL for query parameters
  const url = new URL(req.url);
  const startDate =
    url.searchParams.get("start_date") ||
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]; // Default to 30 days ago
  const endDate =
    url.searchParams.get("end_date") || new Date().toISOString().split("T")[0]; // Default to today

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
      return new Response(JSON.stringify({ transactions: [] }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Get transactions for each access token
    const transactionPromises = plaidItems.map(async (item) => {
      // Get institution details for this item
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

      // Get accounts for this item to map account IDs to names
      const accountsResponse = await plaidClient.accountsGet({
        access_token: item.access_token,
      });

      const accountMap = {};
      accountsResponse.data.accounts.forEach((account) => {
        accountMap[account.account_id] = {
          name: account.name,
          mask: account.mask,
          type: account.type,
          subtype: account.subtype,
        };
      });

      // Get transactions
      const response = await plaidClient.transactionsGet({
        access_token: item.access_token,
        start_date: startDate,
        end_date: endDate,
      });

      return response.data.transactions.map((transaction) => ({
        id: transaction.transaction_id,
        account_id: transaction.account_id,
        account: accountMap[transaction.account_id] || {
          name: "Unknown Account",
        },
        date: transaction.date,
        description: transaction.name,
        merchant_name: transaction.merchant_name,
        amount: transaction.amount,
        currency: transaction.iso_currency_code,
        category: transaction.category,
        category_id: transaction.category_id,
        pending: transaction.pending,
        institution: institutionName,
        item_id: item.item_id,
      }));
    });

    const transactionsArrays = await Promise.all(transactionPromises);
    const transactions = transactionsArrays.flat();

    // Sort transactions by date (newest first)
    transactions.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    return new Response(JSON.stringify({ transactions }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error getting transactions:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
