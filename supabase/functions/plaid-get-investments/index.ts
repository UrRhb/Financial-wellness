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
      return new Response(JSON.stringify({ investments: [] }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Get investments for each access token
    const investmentPromises = plaidItems.map(async (item) => {
      try {
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

        // Get investment holdings
        const holdingsResponse = await plaidClient.investmentsHoldingsGet({
          access_token: item.access_token,
        });

        // Get investment transactions
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30); // Last 30 days
        const endDate = new Date();

        const transactionsResponse =
          await plaidClient.investmentsTransactionsGet({
            access_token: item.access_token,
            start_date: startDate.toISOString().split("T")[0],
            end_date: endDate.toISOString().split("T")[0],
          });

        return {
          institution: institutionName,
          item_id: item.item_id,
          accounts: holdingsResponse.data.accounts,
          holdings: holdingsResponse.data.holdings,
          securities: holdingsResponse.data.securities,
          investment_transactions:
            transactionsResponse.data.investment_transactions,
        };
      } catch (error) {
        console.error(
          `Error getting investments for item ${item.item_id}:`,
          error,
        );
        // Return empty data for this item instead of failing the whole request
        return {
          institution: "Unknown Institution",
          item_id: item.item_id,
          accounts: [],
          holdings: [],
          securities: [],
          investment_transactions: [],
          error: error.message,
        };
      }
    });

    const investmentsData = await Promise.all(investmentPromises);

    // Format the data for the frontend
    const formattedData = {
      accounts: [],
      holdings: [],
      securities: [],
      investment_transactions: [],
    };

    investmentsData.forEach((data) => {
      // Add institution name to each account
      const accountsWithInstitution = data.accounts.map((account) => ({
        ...account,
        institution: data.institution,
        item_id: data.item_id,
      }));

      // Add institution name and security details to each holding
      const holdingsWithDetails = data.holdings.map((holding) => {
        const security =
          data.securities.find(
            (sec) => sec.security_id === holding.security_id,
          ) || {};
        return {
          ...holding,
          institution: data.institution,
          item_id: data.item_id,
          security_name: security.name || "Unknown Security",
          ticker_symbol: security.ticker_symbol,
          type: security.type,
        };
      });

      // Add institution name to each transaction
      const transactionsWithInstitution = data.investment_transactions.map(
        (transaction) => ({
          ...transaction,
          institution: data.institution,
          item_id: data.item_id,
        }),
      );

      formattedData.accounts = [
        ...formattedData.accounts,
        ...accountsWithInstitution,
      ];
      formattedData.holdings = [
        ...formattedData.holdings,
        ...holdingsWithDetails,
      ];
      formattedData.securities = [
        ...formattedData.securities,
        ...data.securities,
      ];
      formattedData.investment_transactions = [
        ...formattedData.investment_transactions,
        ...transactionsWithInstitution,
      ];
    });

    return new Response(JSON.stringify(formattedData), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error getting investments:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
