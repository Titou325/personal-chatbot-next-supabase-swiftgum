import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { memo } from "react";

const remarkPlugins = [remarkGfm];

export const MarkdownMemo = memo(({ content }: { content: string }) => {
  return <Markdown remarkPlugins={remarkPlugins}>{content}</Markdown>;
});

// Add display name for better debugging
MarkdownMemo.displayName = "MarkdownMemo";
