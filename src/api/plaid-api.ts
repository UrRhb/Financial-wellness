import { plaidClient } from "../lib/plaid";
import { supabase } from "../lib/supabase";
import { CountryCode, Products } from "plaid";

// Create a link token
export async function createLinkToken(userId: string) {
  try {
    const request = {
      user: {
        client_user_id: userId,
      },
      client_name: "Wealth Management Dashboard",
      products: ["auth", "transactions"] as Products[],
      language: "en",
      country_codes: ["US"] as CountryCode[],
    };

    const response = await plaidClient.linkTokenCreate(request);
    return response.data;
  } catch (error) {
    console.error("Error creating link token:", error);
    throw error;
  }
}

// Exchange public token for access token
export async function exchangePublicToken(publicToken: string, userId: string) {
  try {
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    // Store the access token in Supabase
    const { error } = await supabase.from("plaid_items").insert([
      {
        user_id: userId,
        item_id: itemId,
        access_token: accessToken,
        status: "active",
      },
    ]);

    if (error) throw error;

    return { itemId };
  } catch (error) {
    console.error("Error exchanging public token:", error);
    throw error;
  }
}

// Get accounts for a user
export async function getAccounts(userId: string) {
  try {
    // Get the access token from Supabase
    const { data: plaidItems, error } = await supabase
      .from("plaid_items")
      .select("access_token")
      .eq("user_id", userId)
      .eq("status", "active");

    if (error) throw error;
    if (!plaidItems || plaidItems.length === 0) {
      return { accounts: [] };
    }

    // Get accounts for each access token
    const accountPromises = plaidItems.map(async (item) => {
      const response = await plaidClient.accountsGet({
        access_token: item.access_token,
      });
      return response.data.accounts;
    });

    const accountsArrays = await Promise.all(accountPromises);
    const accounts = accountsArrays.flat();

    return { accounts };
  } catch (error) {
    console.error("Error getting accounts:", error);
    throw error;
  }
}

// Get transactions for a user
export async function getTransactions(
  userId: string,
  startDate: string,
  endDate: string,
) {
  try {
    // Get the access token from Supabase
    const { data: plaidItems, error } = await supabase
      .from("plaid_items")
      .select("access_token")
      .eq("user_id", userId)
      .eq("status", "active");

    if (error) throw error;
    if (!plaidItems || plaidItems.length === 0) {
      return { transactions: [] };
    }

    // Get transactions for each access token
    const transactionPromises = plaidItems.map(async (item) => {
      const response = await plaidClient.transactionsGet({
        access_token: item.access_token,
        start_date: startDate,
        end_date: endDate,
      });
      return response.data.transactions;
    });

    const transactionsArrays = await Promise.all(transactionPromises);
    const transactions = transactionsArrays.flat();

    return { transactions };
  } catch (error) {
    console.error("Error getting transactions:", error);
    throw error;
  }
}

// Get balances for a user
export async function getBalances(userId: string) {
  try {
    // Get the access token from Supabase
    const { data: plaidItems, error } = await supabase
      .from("plaid_items")
      .select("access_token")
      .eq("user_id", userId)
      .eq("status", "active");

    if (error) throw error;
    if (!plaidItems || plaidItems.length === 0) {
      return { accounts: [] };
    }

    // Get balances for each access token
    const balancePromises = plaidItems.map(async (item) => {
      const response = await plaidClient.accountsBalanceGet({
        access_token: item.access_token,
      });
      return response.data.accounts;
    });

    const accountsArrays = await Promise.all(balancePromises);
    const accounts = accountsArrays.flat();

    return { accounts };
  } catch (error) {
    console.error("Error getting balances:", error);
    throw error;
  }
}
