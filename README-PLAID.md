# Plaid Integration for Wealth Management Dashboard

## Overview

This document provides instructions for setting up the Plaid integration for the Wealth Management Dashboard application. The integration allows users to connect their financial accounts securely using Plaid's API.

## Setup Instructions

### 1. Create a Plaid Developer Account

1. Go to [Plaid's Developer Dashboard](https://dashboard.plaid.com/signup) and create an account
2. Once logged in, create a new team if needed
3. Navigate to the API keys section to obtain your Client ID and Secret keys

### 2. Configure Environment Variables

Create a `.env` file in the root of your project (or copy from `.env.example`) and add the following variables:

```
VITE_PLAID_CLIENT_ID=your_plaid_client_id
VITE_PLAID_SECRET=your_plaid_secret
VITE_PLAID_ENV=sandbox
```

For development, use the Sandbox environment. For production, change to `development` or `production`.

### 3. Set Up Supabase

1. Create a Supabase project if you haven't already
2. Run the migration script in `supabase/migrations/20240601000000_create_plaid_tables.sql` to create the necessary tables
3. Add the following environment variables to your `.env` file:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Deploy Supabase Edge Functions

The Plaid integration uses Supabase Edge Functions to securely handle API calls to Plaid. Deploy these functions using the Supabase CLI:

```bash
supabase functions deploy plaid-link-token
supabase functions deploy plaid-exchange-token
supabase functions deploy plaid-get-accounts
supabase functions deploy plaid-get-transactions
```

Make sure to set the environment variables in your Supabase project:

```bash
supabase secrets set PLAID_CLIENT_ID=your_plaid_client_id
supabase secrets set PLAID_SECRET=your_plaid_secret
```

## Testing the Integration

1. In Sandbox mode, you can use Plaid's test credentials:
   - Username: `user_good`
   - Password: `pass_good`
   - Or any of the other [test credentials](https://plaid.com/docs/sandbox/test-credentials/)

2. For testing specific account types or error scenarios, refer to Plaid's [Sandbox documentation](https://plaid.com/docs/sandbox/)

## Architecture

The Plaid integration consists of the following components:

1. **Frontend Components**:
   - `PlaidLinkButton.tsx`: Renders the Plaid Link button and handles the Plaid Link flow
   - `ConnectAccountSection.tsx`: Displays connected accounts and provides the interface for connecting new accounts

2. **Context and Hooks**:
   - `PlaidContext.tsx`: Provides global state for Plaid-related data
   - `usePlaidAPI.ts`: Custom hook for interacting with the Plaid API

3. **Backend (Supabase Edge Functions)**:
   - `plaid-link-token`: Creates a link token for initializing Plaid Link
   - `plaid-exchange-token`: Exchanges a public token for an access token and retrieves account information
   - `plaid-get-accounts`: Retrieves account information for a user
   - `plaid-get-transactions`: Retrieves transaction data for a user's accounts

4. **Database (Supabase)**:
   - `plaid_items`: Stores information about connected Plaid items (institutions)
   - `plaid_accounts`: Stores information about individual accounts
   - `plaid_transactions`: Stores transaction data

## Security Considerations

1. Access tokens are never exposed to the frontend; they are stored securely in the database
2. All API calls to Plaid are made through Supabase Edge Functions, which run in a secure environment
3. Row-level security policies ensure that users can only access their own data

## Troubleshooting

- If you encounter CORS issues, make sure your Supabase project allows requests from your application's domain
- For Plaid Link errors, check the browser console for detailed error messages
- If transactions aren't showing up, ensure that the date range for the transaction request is appropriate

## Resources

- [Plaid Documentation](https://plaid.com/docs/)
- [Plaid API Reference](https://plaid.com/docs/api/)
- [Supabase Edge Functions Documentation](https://supabase.com/docs/guides/functions)
