import React, { createContext, useContext, useState, useEffect } from "react";

interface AccountBalance {
  available?: number | null;
  current?: number | null;
  limit?: number | null;
  currency?: string;
}

export interface PlaidAccount {
  id: string;
  name: string;
  mask: string;
  type: string;
  subtype?: string;
  institution: string;
  item_id?: string;
  balance?: AccountBalance;
}

export interface PlaidTransaction {
  id: string;
  account_id: string;
  account?: {
    name: string;
    mask?: string;
    type?: string;
    subtype?: string;
  };
  date: string;
  description: string;
  merchant_name?: string;
  amount: number;
  currency?: string;
  category?: string[];
  category_id?: string;
  pending: boolean;
  institution?: string;
  item_id?: string;
}

export interface PlaidInvestments {
  accounts: any[];
  holdings: any[];
  securities: any[];
  investment_transactions: any[];
}

export interface PlaidLiabilities {
  accounts: any[];
  credit: any[];
  mortgage: any[];
  student: any[];
}

export interface FinancialSummary {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlySavings: number;
  lastUpdated: Date;
}

interface PlaidContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  isConnected: boolean;
  connectedAccounts: PlaidAccount[];
  setConnectedAccounts: (
    accounts: PlaidAccount[] | ((prev: PlaidAccount[]) => PlaidAccount[]),
  ) => void;
  transactions: PlaidTransaction[];
  setTransactions: (
    transactions:
      | PlaidTransaction[]
      | ((prev: PlaidTransaction[]) => PlaidTransaction[]),
  ) => void;
  investments: PlaidInvestments;
  setInvestments: (
    investments:
      | PlaidInvestments
      | ((prev: PlaidInvestments) => PlaidInvestments),
  ) => void;
  liabilities: PlaidLiabilities;
  setLiabilities: (
    liabilities:
      | PlaidLiabilities
      | ((prev: PlaidLiabilities) => PlaidLiabilities),
  ) => void;
  financialData: FinancialSummary | null;
  setFinancialData: (
    data:
      | FinancialSummary
      | ((prev: FinancialSummary | null) => FinancialSummary | null),
  ) => void;
  lastUpdated: Date | null;
  setLastUpdated: (date: Date | null) => void;
}

const PlaidContext = createContext<PlaidContextType>({
  accessToken: null,
  setAccessToken: () => {},
  isConnected: false,
  connectedAccounts: [],
  setConnectedAccounts: () => {},
  transactions: [],
  setTransactions: () => {},
  investments: {
    accounts: [],
    holdings: [],
    securities: [],
    investment_transactions: [],
  },
  setInvestments: () => {},
  liabilities: { accounts: [], credit: [], mortgage: [], student: [] },
  setLiabilities: () => {},
  financialData: null,
  setFinancialData: () => {},
  lastUpdated: null,
  setLastUpdated: () => {},
});

export const usePlaid = () => useContext(PlaidContext);

interface PlaidProviderProps {
  children: React.ReactNode;
}

export const PlaidProvider: React.FC<PlaidProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [connectedAccounts, setConnectedAccounts] = useState<PlaidAccount[]>(
    [],
  );
  const [transactions, setTransactions] = useState<PlaidTransaction[]>([]);
  const [investments, setInvestments] = useState<PlaidInvestments>({
    accounts: [],
    holdings: [],
    securities: [],
    investment_transactions: [],
  });
  const [liabilities, setLiabilities] = useState<PlaidLiabilities>({
    accounts: [],
    credit: [],
    mortgage: [],
    student: [],
  });
  const [financialData, setFinancialData] = useState<FinancialSummary | null>(
    null,
  );
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem("plaid_access_token");
    if (storedToken) {
      setAccessToken(storedToken);
    }

    const storedAccounts = localStorage.getItem("plaid_connected_accounts");
    if (storedAccounts) {
      try {
        setConnectedAccounts(JSON.parse(storedAccounts));
      } catch (e) {
        console.error("Error parsing stored accounts", e);
      }
    }

    const storedTransactions = localStorage.getItem("plaid_transactions");
    if (storedTransactions) {
      try {
        setTransactions(JSON.parse(storedTransactions));
      } catch (e) {
        console.error("Error parsing stored transactions", e);
      }
    }

    const storedInvestments = localStorage.getItem("plaid_investments");
    if (storedInvestments) {
      try {
        setInvestments(JSON.parse(storedInvestments));
      } catch (e) {
        console.error("Error parsing stored investments", e);
      }
    }

    const storedLiabilities = localStorage.getItem("plaid_liabilities");
    if (storedLiabilities) {
      try {
        setLiabilities(JSON.parse(storedLiabilities));
      } catch (e) {
        console.error("Error parsing stored liabilities", e);
      }
    }

    const storedFinancialData = localStorage.getItem("plaid_financial_data");
    if (storedFinancialData) {
      try {
        const parsedData = JSON.parse(storedFinancialData);
        // Convert lastUpdated string back to Date object
        if (parsedData.lastUpdated) {
          parsedData.lastUpdated = new Date(parsedData.lastUpdated);
        }
        setFinancialData(parsedData);
      } catch (e) {
        console.error("Error parsing stored financial data", e);
      }
    }

    const storedLastUpdated = localStorage.getItem("plaid_last_updated");
    if (storedLastUpdated) {
      try {
        setLastUpdated(new Date(storedLastUpdated));
      } catch (e) {
        console.error("Error parsing last updated date", e);
      }
    }
  }, []);

  // Save access token to localStorage when it changes
  useEffect(() => {
    if (accessToken) {
      localStorage.setItem("plaid_access_token", accessToken);
    } else {
      localStorage.removeItem("plaid_access_token");
    }
  }, [accessToken]);

  // Save connected accounts to localStorage when they change
  useEffect(() => {
    if (connectedAccounts.length > 0) {
      localStorage.setItem(
        "plaid_connected_accounts",
        JSON.stringify(connectedAccounts),
      );
      // Update last updated timestamp
      const now = new Date();
      setLastUpdated(now);
      localStorage.setItem("plaid_last_updated", now.toISOString());
    } else if (
      connectedAccounts.length === 0 &&
      localStorage.getItem("plaid_connected_accounts")
    ) {
      // If accounts were cleared, remove from localStorage
      localStorage.removeItem("plaid_connected_accounts");
    }
  }, [connectedAccounts]);

  // Save transactions to localStorage when they change
  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem("plaid_transactions", JSON.stringify(transactions));
    }
  }, [transactions]);

  // Save investments to localStorage when they change
  useEffect(() => {
    if (investments.accounts.length > 0 || investments.holdings.length > 0) {
      localStorage.setItem("plaid_investments", JSON.stringify(investments));
    }
  }, [investments]);

  // Save liabilities to localStorage when they change
  useEffect(() => {
    if (
      liabilities.accounts.length > 0 ||
      liabilities.credit.length > 0 ||
      liabilities.mortgage.length > 0 ||
      liabilities.student.length > 0
    ) {
      localStorage.setItem("plaid_liabilities", JSON.stringify(liabilities));
    }
  }, [liabilities]);

  // Save financial data to localStorage when it changes
  useEffect(() => {
    if (financialData) {
      localStorage.setItem(
        "plaid_financial_data",
        JSON.stringify(financialData),
      );
    }
  }, [financialData]);

  // Save last updated timestamp to localStorage when it changes
  useEffect(() => {
    if (lastUpdated) {
      localStorage.setItem("plaid_last_updated", lastUpdated.toISOString());
    }
  }, [lastUpdated]);

  const value = {
    accessToken,
    setAccessToken,
    isConnected: !!accessToken,
    connectedAccounts,
    setConnectedAccounts,
    transactions,
    setTransactions,
    investments,
    setInvestments,
    liabilities,
    setLiabilities,
    financialData,
    setFinancialData,
    lastUpdated,
    setLastUpdated,
  };

  return (
    <PlaidContext.Provider value={value}>{children}</PlaidContext.Provider>
  );
};
