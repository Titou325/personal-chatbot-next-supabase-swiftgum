import { Outlet } from "react-router";

import { createBrowserClient } from "@/utils/supabase/client";
import { redirect } from "react-router";

export const clientLoader = async () => {
  // Create the Supabase client
  const supabase = createBrowserClient();

  // Get the current session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If there is a session, redirect to the home page
  if (session) {
    return redirect("/");
  }

  return {};
};

export default function Public() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Outlet />
    </div>
  );
}
