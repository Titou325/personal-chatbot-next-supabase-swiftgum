import { createBrowserClient } from "@/utils/supabase/client";
import { redirect } from "react-router";

export const clientLoader = async () => {
  // Create the Supabase client
  const supabase = createBrowserClient();

  // Get the current session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If no session exists, redirect to login
  if (!session) {
    return redirect("/login");
  }

  return {};
};
