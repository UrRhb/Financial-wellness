import { createClient } from "@supabase/supabase-js";

// Use mock values for development if environment variables are not set
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://mock-supabase-url.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "mock-anon-key";

// Create a mock client if we're using the default values
const isMockClient =
  !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Add a warning for mock client
if (isMockClient) {
  console.warn(
    "Using mock Supabase client. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables for actual Supabase functionality.",
  );
}
