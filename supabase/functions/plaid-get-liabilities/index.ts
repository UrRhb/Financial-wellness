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
      return new Response(JSON.stringify({ liabilities: [] }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Get liabilities for each access token
    const liabilitiesPromises = plaidItems.map(async (item) => {
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

        // Get liabilities
        const liabilitiesResponse = await plaidClient.liabilitiesGet({
          access_token: item.access_token,
        });

        return {
          institution: institutionName,
          item_id: item.item_id,
          accounts: liabilitiesResponse.data.accounts,
          liabilities: liabilitiesResponse.data.liabilities,
        };
      } catch (error) {
        console.error(
          `Error getting liabilities for item ${item.item_id}:`,
          error,
        );
        // Return empty data for this item instead of failing the whole request
        return {
          institution: "Unknown Institution",
          item_id: item.item_id,
          accounts: [],
          liabilities: {},
          error: error.message,
        };
      }
    });

    const liabilitiesData = await Promise.all(liabilitiesPromises);

    // Format the data for the frontend
    const formattedData = {
      accounts: [],
      credit: [],
      mortgage: [],
      student: [],
    };

    liabilitiesData.forEach((data) => {
      // Add institution name to each account
      const accountsWithInstitution = data.accounts.map((account) => ({
        ...account,
        institution: data.institution,
        item_id: data.item_id,
      }));

      formattedData.accounts = [
        ...formattedData.accounts,
        ...accountsWithInstitution,
      ];

      // Process credit liabilities
      if (data.liabilities.credit) {
        const creditWithDetails = data.liabilities.credit.map((credit) => {
          const account =
            data.accounts.find((acc) => acc.account_id === credit.account_id) ||
            {};
          return {
            ...credit,
            institution: data.institution,
            item_id: data.item_id,
            account_name: account.name || "Unknown Account",
            account_mask: account.mask,
            balances: account.balances,
          };
        });
        formattedData.credit = [...formattedData.credit, ...creditWithDetails];
      }

      // Process mortgage liabilities
      if (data.liabilities.mortgage) {
        const mortgageWithDetails = data.liabilities.mortgage.map(
          (mortgage) => {
            const account =
              data.accounts.find(
                (acc) => acc.account_id === mortgage.account_id,
              ) || {};
            return {
              ...mortgage,
              institution: data.institution,
              item_id: data.item_id,
              account_name: account.name || "Unknown Account",
              account_mask: account.mask,
              balances: account.balances,
            };
          },
        );
        formattedData.mortgage = [
          ...formattedData.mortgage,
          ...mortgageWithDetails,
        ];
      }

      // Process student loan liabilities
      if (data.liabilities.student) {
        const studentWithDetails = data.liabilities.student.map((student) => {
          const account =
            data.accounts.find(
              (acc) => acc.account_id === student.account_id,
            ) || {};
          return {
            ...student,
            institution: data.institution,
            item_id: data.item_id,
            account_name: account.name || "Unknown Account",
            account_mask: account.mask,
            balances: account.balances,
          };
        });
        formattedData.student = [
          ...formattedData.student,
          ...studentWithDetails,
        ];
      }
    });

    return new Response(JSON.stringify(formattedData), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error getting liabilities:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
