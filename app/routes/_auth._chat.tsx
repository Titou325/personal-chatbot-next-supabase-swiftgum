import { createBrowserClient } from "@/utils/supabase/client";
import { Outlet, useNavigate } from "react-router";
import type { Route } from "./+types/_auth._chat";
import { ThreadsList } from "@/components/chat/threads-list";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { PanelLeftClose, PanelLeftOpen, SquarePen } from "lucide-react";
import { cn } from "@/utils/utils";
import { v4 as uuidv4 } from "@lukeed/uuid";

export const clientLoader = async () => {
  const supabase = createBrowserClient();

  const { data, error } = await supabase
    .from("threads")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    throw error;
  }

  return { threads: data };
};

export default function Chat({ loaderData }: Route.ComponentProps) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const navigate = useNavigate();

  const handleNewChat = () => {
    const newThreadId = uuidv4();
    navigate(`/chat/${newThreadId}`);
  };

  return (
    <div
      className={cn(
        "grid h-full max-h-screen overflow-hidden grid-cols-[0_1fr] transition-all duration-300",
        sidebarExpanded && "md:grid-cols-[16rem_1fr]"
      )}
    >
      <div className="min-h-0">
        <aside className="w-[min(16rem,100vw)]">
          <div className="p-2 flex justify-between">
            <button
              className="hover:bg-stone-100 hover:text-stone-600 transition-all p-2 rounded-md cursor-pointer text-stone-400"
              onClick={() => setSidebarExpanded(false)}
            >
              <PanelLeftClose className="h-6 w-6" />
            </button>
            <button
              className="hover:bg-stone-100 hover:text-stone-600 transition-all p-2 rounded-md cursor-pointer text-stone-400"
              onClick={handleNewChat}
            >
              <SquarePen className="h-6 w-6" />
            </button>
          </div>
          <ThreadsList threads={loaderData.threads} />
        </aside>
      </div>
      <div className="bg-white min-h-0 h-full flex flex-col">
        <ScrollArea className="grow basis-0 overflow-auto">
          <div className="sticky top-0 bg-gradient-to-b from-white to-white/0 p-2 z-10">
            <button
              className={cn(
                sidebarExpanded && "md:opacity-0",
                "hover:bg-stone-100 hover:text-stone-600 transition-all p-2 rounded-md cursor-pointer text-stone-400"
              )}
              onClick={() => setSidebarExpanded(true)}
            >
              <PanelLeftOpen className="h-6 w-6" />
            </button>
          </div>
          <Outlet />
        </ScrollArea>
      </div>
    </div>
  );
}
