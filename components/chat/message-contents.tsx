import { cn } from "@/utils/utils";
import { MarkdownMemo } from "./markdown-memo";

export const MessageContents = ({
  content,
  role,
}: {
  content: string;
  role: "user" | "assistant" | "system" | "data";
}) => {
  return (
    <div className={cn("flex", role === "user" && "flex-row-reverse")}>
      <div
        className={cn(
          "prose prose-code:max-w-full prose-code:overflow-auto max-w-none prose-stone",
          role === "user" && "bg-stone-100 px-4 py-2 rounded-3xl"
        )}
      >
        <MarkdownMemo content={content} />
      </div>
    </div>
  );
};
