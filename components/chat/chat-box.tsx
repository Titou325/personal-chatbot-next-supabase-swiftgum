import { cn } from "@/utils/utils";
import { EditorState } from "prosemirror-state";
import {
  ProseMirror,
  ProseMirrorDoc,
  reactKeys,
} from "@handlewithcare/react-prosemirror";
import { schema } from "prosemirror-schema-basic";
import "prosemirror-view/style/prosemirror.css";
import { useEffect, useState } from "react";
import { Send } from "lucide-react";

type ChatBoxProps = {
  input: string;
  isLoading: boolean;
  setInput: (input: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
};

export const ChatBox = ({
  input,
  isLoading,
  setInput,
  onSubmit,
}: ChatBoxProps) => {
  const [editorState, setEditorState] = useState(
    EditorState.create({ schema, plugins: [reactKeys()] })
  );

  useEffect(() => {
    setInput(editorState.doc.textContent);
  }, [editorState.doc.textContent]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(e);
        setEditorState(EditorState.create({ schema, plugins: [reactKeys()] }));
      }}
      className={cn(
        "flex items-start gap-2",
        "bg-white border border-stone-200 rounded-3xl shadow-lg shadow-stone-300/10 overflow-hidden",
        "transition-all duration-200",
        "focus-within:border-stone-300 focus-within:shadow-stone-300/20"
      )}
    >
      <span
        className={cn(
          "absolute px-4 opacity-50 place-self-center",
          "focus-within:opacity-0",
          input.length && "opacity-0"
        )}
      >
        Ask anything
      </span>
      <ProseMirror
        className="min-h-[1em] px-4 py-3 content-box focus:outline-none grow"
        state={editorState}
        dispatchTransaction={(tr) => {
          setEditorState((s) => s.apply(tr));
        }}
      >
        <ProseMirrorDoc />
      </ProseMirror>
      <button
        type="submit"
        className="p-3 hover:bg-stone-100 transition-all duration-200 rounded-full m-1 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading || !input.trim().length}
      >
        <Send className="w-4 h-4" />
      </button>
    </form>
  );
};
