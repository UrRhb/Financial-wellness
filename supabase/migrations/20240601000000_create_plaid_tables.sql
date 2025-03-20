-- Create the plaid_items table to store Plaid item information
CREATE TABLE IF NOT EXISTS plaid_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL,
  access_token TEXT NOT NULL,
  institution_id TEXT,
  institution_name TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, item_id)
);

-- Create RLS policies for plaid_items
ALTER TABLE plaid_items ENABLE ROW LEVEL SECURITY;

-- Users can only see their own items
CREATE POLICY "Users can view their own plaid items" 
  ON plaid_items FOR SELECT 
  USING (auth.uid() = user_id);

-- Only authenticated users can insert items
CREATE POLICY "Users can insert their own plaid items" 
  ON plaid_items FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own items
CREATE POLICY "Users can update their own plaid items" 
  ON plaid_items FOR UPDATE 
  USING (auth.uid() = user_id);

-- Users can only delete their own items
CREATE POLICY "Users can delete their own plaid items" 
  ON plaid_items FOR DELETE 
  USING (auth.uid() = user_id);

-- Create the plaid_accounts table to store account information
CREATE TABLE IF NOT EXISTS plaid_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES plaid_items(id) ON DELETE CASCADE,
  plaid_account_id TEXT NOT NULL,
  name TEXT NOT NULL,
  mask TEXT,
  official_name TEXT,
  type TEXT NOT NULL,
  subtype TEXT,
  available_balance DECIMAL,
  current_balance DECIMAL,
  limit_amount DECIMAL,
  iso_currency_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, plaid_account_id)
);

-- Create RLS policies for plaid_accounts
ALTER TABLE plaid_accounts ENABLE ROW LEVEL SECURITY;

-- Users can only see their own accounts
CREATE POLICY "Users can view their own plaid accounts" 
  ON plaid_accounts FOR SELECT 
  USING (auth.uid() = user_id);

-- Only authenticated users can insert accounts
CREATE POLICY "Users can insert their own plaid accounts" 
  ON plaid_accounts FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own accounts
CREATE POLICY "Users can update their own plaid accounts" 
  ON plaid_accounts FOR UPDATE 
  USING (auth.uid() = user_id);

-- Users can only delete their own accounts
CREATE POLICY "Users can delete their own plaid accounts" 
  ON plaid_accounts FOR DELETE 
  USING (auth.uid() = user_id);

-- Create the plaid_transactions table to store transaction data
CREATE TABLE IF NOT EXISTS plaid_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES plaid_accounts(id) ON DELETE CASCADE,
  plaid_transaction_id TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  date DATE NOT NULL,
  name TEXT NOT NULL,
  merchant_name TEXT,
  pending BOOLEAN DEFAULT FALSE,
  category TEXT[],
  category_id TEXT,
  payment_channel TEXT,
  iso_currency_code TEXT,
  location JSONB,
  payment_meta JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, plaid_transaction_id)
);

-- Create RLS policies for plaid_transactions
ALTER TABLE plaid_transactions ENABLE ROW LEVEL SECURITY;

-- Users can only see their own transactions
CREATE POLICY "Users can view their own plaid transactions" 
  ON plaid_transactions FOR SELECT 
  USING (auth.uid() = user_id);

-- Only authenticated users can insert transactions
CREATE POLICY "Users can insert their own plaid transactions" 
  ON plaid_transactions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own transactions
CREATE POLICY "Users can update their own plaid transactions" 
  ON plaid_transactions FOR UPDATE 
  USING (auth.uid() = user_id);

-- Users can only delete their own transactions
CREATE POLICY "Users can delete their own plaid transactions" 
  ON plaid_transactions FOR DELETE 
  USING (auth.uid() = user_id);
