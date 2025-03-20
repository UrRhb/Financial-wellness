import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

// Initialize the Plaid client
const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox, // Use 'development' or 'production' for non-sandbox
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": import.meta.env.VITE_PLAID_CLIENT_ID,
      "PLAID-SECRET": import.meta.env.VITE_PLAID_SECRET,
    },
  },
});

export const plaidClient = new PlaidApi(configuration);
