import type { Message } from "@ai-sdk/react";
import { Message as MessageComponent } from "./message";
import { useRef, useEffect } from "react";

type MessageListProps = {
  messages: Message[];
};

export const MessageList = ({ messages }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "instant",
    });
  }, [messages]);

  return (
    <div className="flex flex-col gap-8 max-w-screen-md relative mx-auto">
      {messages.map((message) => (
        <MessageComponent
          key={message.id}
          content={message.content}
          role={message.role as "user" | "assistant"}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
