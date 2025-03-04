import {
  parseCookieHeader,
  serializeCookieHeader,
  createServerClient as createServerClientSSR,
} from "@supabase/ssr";
import type { Database } from "./types";

export const createServerClient = (request: Request) => {
  const headers = new Headers();

  const supabase = createServerClientSSR<Database>(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(request.headers.get("Cookie") ?? "");
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            headers.append(
              "Set-Cookie",
              serializeCookieHeader(name, value, options)
            )
          );
        },
      },
    }
  );

  return {
    supabase,
    headers,
  };
};
