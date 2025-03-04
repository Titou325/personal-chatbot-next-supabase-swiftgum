import { MessageContents } from "./message-contents";

type MessageProps = {
  content: string;
  role: "user" | "assistant" | "system" | "data";
};

export const Message = ({ content, role }: MessageProps) => {
  return (
    <div>
      <MessageContents role={role} content={content} />
    </div>
  );
};
