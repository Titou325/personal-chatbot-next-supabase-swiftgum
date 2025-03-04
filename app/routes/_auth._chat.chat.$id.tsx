import { useChat, type Message } from "@ai-sdk/react";
import type { Route } from "./+types/_auth._chat.chat.$id";
import { v4 as uuidv4 } from "@lukeed/uuid";
import { createBrowserClient } from "@/utils/supabase/client";
import { MessageList } from "@/components/chat/message-list";
import { ChatBox } from "@/components/chat/chat-box";
import { cn } from "@/utils/utils";
import { useRevalidator } from "react-router";

export const clientLoader = async ({ params }: Route.ClientLoaderArgs) => {
  const supabase = createBrowserClient();

  const { data: thread, error: threadError } = await supabase
    .from("threads")
    .select("*")
    .eq("thread_id", params.id)
    .single();

  // If thread doesn't exist yet, that's okay - it will be created when first message is sent
  if (threadError && threadError.code === "PGRST116") {
    return { thread: null, chats: [] };
  }

  // For other errors, throw them
  if (threadError) {
    throw threadError;
  }

  const { data: chats, error: chatError } = await supabase
    .from("chats")
    .select("*")
    .eq("thread_id", params.id)
    .order("created_at", { ascending: false })
    .limit(500)
    .overrideTypes<
      Array<{
        content: Message;
      }>
    >();

  if (chatError) {
    throw chatError;
  }

  return { thread, chats: chats.reverse() || [] };
};

export default function Chat({ params, loaderData }: Route.ComponentProps) {
  const revalidator = useRevalidator();

  const { messages, input, setInput, handleSubmit, status } = useChat({
    id: params.id,
    api: `/api/chat`,
    initialMessages: loaderData.chats?.map((chat) => chat.content) || [],
    sendExtraMessageFields: true,
    generateId: uuidv4,
    onResponse: () => {
      revalidator.revalidate();
    },
  });

  return (
    <div>
      <div className="pt-12 min-h-screen box-border">
        <MessageList messages={messages} />
      </div>
      <div
        className={cn(
          "mx-auto max-w-screen-md bg-white rounded-t-3xl",
          "sticky transition-all duration-300",
          messages.length ? "bottom-0 pb-6" : "bottom-1/2"
        )}
      >
        <ChatBox
          input={input}
          setInput={setInput}
          onSubmit={async (e) => handleSubmit(e)}
          isLoading={status !== "ready"}
        />
      </div>
    </div>
  );
}
