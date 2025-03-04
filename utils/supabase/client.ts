import { createBrowserClient as createBrowserClientSSR } from "@supabase/ssr";
import type { Database } from "./types";

export const createBrowserClient = () => {
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
  const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Missing Supabase environment variables");
  }

  return createBrowserClientSSR<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
};
