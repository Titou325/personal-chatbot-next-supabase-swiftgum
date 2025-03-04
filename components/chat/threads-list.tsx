import { cn } from "@/utils/utils";
import type { Database } from "@/utils/supabase/types";
import { NavLink } from "react-router";

export const ThreadsList = ({
  threads,
}: {
  threads: Database["public"]["Tables"]["threads"]["Row"][];
}) => {
  return (
    <div className="p-2 flex flex-col gap-3">
      <ul>
        {threads.map((thread) => (
          <li key={thread.thread_id}>
            <NavLink
              className={({ isActive }) =>
                cn(
                  "block px-3 py-2 rounded-md leading-tight text-sm",
                  "transition-colors",
                  isActive ? "bg-stone-300" : "hover:bg-stone-200"
                )
              }
              to={`/chat/${thread.thread_id}`}
            >
              {thread.title}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};
