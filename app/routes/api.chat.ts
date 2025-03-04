import { type ActionFunctionArgs } from "react-router";
import { createServerClient } from "@/utils/supabase/server";
import { openai } from "@ai-sdk/openai";
import {
  streamText,
  type Message,
  appendResponseMessages,
  generateObject,
} from "ai";
import { z } from "zod";
import type { Json } from "@/utils/supabase/types";
import type { User } from "@supabase/supabase-js";

export const config = {
  maxDuration: 60,
};

interface AddMessageParams {
  threadId: string;
  message: Message;
  role: "user" | "assistant" | "data" | "system";
  user: User;
  request: Request;
}

async function addMessage({
  threadId,
  message,
  role,
  user,
  request,
}: AddMessageParams) {
  const { supabase } = createServerClient(request);

  const { error } = await supabase.from("chats").insert({
    thread_id: threadId,
    content: message as unknown as Json,
    role,
    user_id: user.id,
  });

  if (error) {
    console.error("Error adding message:", error);
    throw error;
  }
}

async function generateThreadTitle(firstMessage: string) {
  const result = await generateObject({
    model: openai("gpt-4"),
    system: `You are a title generator. Generate a concise and descriptive title (max 60 characters) in the same language as the user's message. If the message is a greeting or very short, make the title generic like "General Discussion" or "Quick Chat" in the appropriate language.`,
    prompt: firstMessage,
    schema: z.object({
      title: z
        .string()
        .describe(
          "The generated title in the same language as the input message"
        ),
    }),
  });

  return result.object.title;
}

async function ensureThreadExists(
  threadId: string,
  firstMessage: string | undefined,
  user: User,
  request: Request
) {
  const { supabase } = createServerClient(request);

  // Check if thread exists
  const { data: existingThread } = await supabase
    .from("threads")
    .select("thread_id")
    .eq("thread_id", threadId)
    .single();

  if (!existingThread) {
    // Generate title if this is a new thread with a first message
    const title = firstMessage
      ? await generateThreadTitle(firstMessage)
      : "New Chat";

    // Create new thread
    const { error } = await supabase.from("threads").insert({
      thread_id: threadId,
      title,
      user_id: user.id,
    });

    if (error) {
      console.error("Error creating thread:", error);
      throw error;
    }
  }
}

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  // Authenticate user once at the beginning
  const { supabase } = createServerClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages, id } = await request.json();

  // Get the first message content if it exists
  const firstMessage = messages[messages.length - 1]?.content as string;

  // Ensure thread exists before adding message
  await ensureThreadExists(id, firstMessage, user, request);
  await addMessage({
    threadId: id,
    message: messages[messages.length - 1],
    role: "user",
    user,
    request,
  });

  const result = streamText({
    model: openai("gpt-4"),
    messages,
    async onFinish({ response }) {
      const finalMessages = appendResponseMessages({
        messages,
        responseMessages: response.messages,
      });

      const filteredMessages = finalMessages.slice(
        finalMessages.findIndex(({ id: messageId }) => messageId === id)
      );

      for (const message of filteredMessages) {
        await addMessage({
          threadId: id,
          message,
          role: message.role,
          user,
          request,
        });
      }
    },
  });

  return result.toDataStreamResponse();
}
