import { useState } from "react";
import { usePlaid } from "@/context/PlaidContext";
import { supabase } from "@/lib/supabase";

export function usePlaidAPI() {
  const {
    setAccessToken,
    setConnectedAccounts,
    setTransactions,
    setInvestments,
    setLiabilities,
    setFinancialData,
  } = usePlaid();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create a link token
  const createLinkToken = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } =
        await supabase.functions.invoke("plaid-link-token");

      if (error) throw new Error(error.message);
      return data.link_token;
    } catch (err) {
      console.error("Error creating link token:", err);
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Exchange public token for access token
  const exchangePublicToken = async (publicToken: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke(
        "plaid-exchange-token",
        {
          body: { public_token: publicToken },
        },
      );

      if (error) throw new Error(error.message);

      // Update the context with the new accounts
      if (data.accounts) {
        setConnectedAccounts((prevAccounts) => [
          ...prevAccounts,
          ...data.accounts,
        ]);
      }

      // Set access token in context (this is just a flag, we don't store the actual token client-side)
      setAccessToken("connected");

      // After connecting an account, fetch all financial data
      await fetchAllFinancialData();

      return data;
    } catch (err) {
      console.error("Error exchanging public token:", err);
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Get accounts
  const getAccounts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } =
        await supabase.functions.invoke("plaid-get-accounts");

      if (error) throw new Error(error.message);

      // Update the context with the accounts
      if (data.accounts) {
        setConnectedAccounts(data.accounts);
      }

      return data.accounts;
    } catch (err) {
      console.error("Error getting accounts:", err);
      setError(err.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Get transactions
  const getTransactions = async (startDate?: string, endDate?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      let url = "plaid-get-transactions";
      if (startDate && endDate) {
        url += `?start_date=${startDate}&end_date=${endDate}`;
      }

      const { data, error } = await supabase.functions.invoke(url);

      if (error) throw new Error(error.message);

      // Update the context with transactions
      if (data.transactions) {
        setTransactions(data.transactions);
      }

      return data.transactions;
    } catch (err) {
      console.error("Error getting transactions:", err);
      setError(err.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Get investments
  const getInvestments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke(
        "plaid-get-investments",
      );

      if (error) throw new Error(error.message);

      // Update the context with investments
      if (data) {
        setInvestments(data);
      }

      return data;
    } catch (err) {
      console.error("Error getting investments:", err);
      setError(err.message);
      return {
        accounts: [],
        holdings: [],
        securities: [],
        investment_transactions: [],
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Get liabilities
  const getLiabilities = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke(
        "plaid-get-liabilities",
      );

      if (error) throw new Error(error.message);

      // Update the context with liabilities
      if (data) {
        setLiabilities(data);
      }

      return data;
    } catch (err) {
      console.error("Error getting liabilities:", err);
      setError(err.message);
      return { accounts: [], credit: [], mortgage: [], student: [] };
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all financial data at once
  const fetchAllFinancialData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Get current date and 30 days ago for transaction date range
      const endDate = new Date().toISOString().split("T")[0];
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

      // Fetch all data in parallel
      const [accounts, transactions, investments, liabilities] =
        await Promise.all([
          getAccounts(),
          getTransactions(startDate, endDate),
          getInvestments(),
          getLiabilities(),
        ]);

      // Calculate financial summary
      const totalAssets = calculateTotalAssets(accounts, investments);
      const totalLiabilities = calculateTotalLiabilities(liabilities);
      const netWorth = totalAssets - totalLiabilities;

      // Calculate monthly income and expenses
      const { monthlyIncome, monthlyExpenses } =
        calculateMonthlyFlow(transactions);

      // Update financial data in context
      setFinancialData({
        totalAssets,
        totalLiabilities,
        netWorth,
        monthlyIncome,
        monthlyExpenses,
        monthlySavings: monthlyIncome - monthlyExpenses,
        lastUpdated: new Date(),
      });

      return {
        accounts,
        transactions,
        investments,
        liabilities,
        financialSummary: {
          totalAssets,
          totalLiabilities,
          netWorth,
          monthlyIncome,
          monthlyExpenses,
          monthlySavings: monthlyIncome - monthlyExpenses,
        },
      };
    } catch (err) {
      console.error("Error fetching all financial data:", err);
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to calculate total assets
  const calculateTotalAssets = (accounts, investments) => {
    let total = 0;

    // Add depository and investment account balances
    if (accounts && accounts.length) {
      accounts.forEach((account) => {
        if (account.type !== "credit" && account.balance?.current) {
          total += account.balance.current;
        }
      });
    }

    // Add investment holdings value
    if (investments && investments.holdings && investments.holdings.length) {
      investments.holdings.forEach((holding) => {
        if (holding.institution_value) {
          total += holding.institution_value;
        }
      });
    }

    return total;
  };

  // Helper function to calculate total liabilities
  const calculateTotalLiabilities = (liabilities) => {
    let total = 0;

    // Add credit card balances
    if (liabilities && liabilities.credit && liabilities.credit.length) {
      liabilities.credit.forEach((credit) => {
        if (credit.balances?.current) {
          total += Math.abs(credit.balances.current);
        }
      });
    }

    // Add mortgage balances
    if (liabilities && liabilities.mortgage && liabilities.mortgage.length) {
      liabilities.mortgage.forEach((mortgage) => {
        if (mortgage.balances?.current) {
          total += Math.abs(mortgage.balances.current);
        }
      });
    }

    // Add student loan balances
    if (liabilities && liabilities.student && liabilities.student.length) {
      liabilities.student.forEach((loan) => {
        if (loan.balances?.current) {
          total += Math.abs(loan.balances.current);
        }
      });
    }

    return total;
  };

  // Helper function to calculate monthly income and expenses
  const calculateMonthlyFlow = (transactions) => {
    let monthlyIncome = 0;
    let monthlyExpenses = 0;

    if (transactions && transactions.length) {
      transactions.forEach((transaction) => {
        // In Plaid, expenses are positive amounts and income/deposits are negative
        // We'll convert to our expected format where income is positive and expenses are negative
        const amount = transaction.amount;

        if (amount < 0) {
          // Income/deposit (negative in Plaid)
          monthlyIncome += Math.abs(amount);
        } else {
          // Expense (positive in Plaid)
          monthlyExpenses += amount;
        }
      });
    }

    return { monthlyIncome, monthlyExpenses };
  };

  return {
    createLinkToken,
    exchangePublicToken,
    getAccounts,
    getTransactions,
    getInvestments,
    getLiabilities,
    fetchAllFinancialData,
    isLoading,
    error,
  };
}
