-- Enable the pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create threads table
CREATE TABLE threads (
  thread_id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create chats table
CREATE TABLE chats (
  chat_id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
  thread_id UUID NOT NULL REFERENCES threads (thread_id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  content JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'assistant')),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create content table
CREATE TABLE content (
  content_id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  content BYTEA NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  file_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size BIGINT NOT NULL
);

-- Create chunks table
CREATE TABLE chunks (
  chunk_id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
  content_id UUID NOT NULL REFERENCES content (content_id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  embedding vector (1536),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create chat_chunks junction table
CREATE TABLE chat_chunks (
  chat_id UUID NOT NULL REFERENCES chats (chat_id) ON DELETE CASCADE,
  chunk_id UUID NOT NULL REFERENCES chunks (chunk_id) ON DELETE CASCADE,
  PRIMARY KEY (chat_id, chunk_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_threads_user_id ON threads (user_id);

CREATE INDEX idx_chats_thread_id ON chats (thread_id);

CREATE INDEX idx_chats_user_id ON chats (user_id);

CREATE INDEX idx_content_user_id ON content (user_id);

CREATE INDEX idx_chunks_content_id ON chunks (content_id);

CREATE INDEX idx_chunks_user_id ON chunks (user_id);

CREATE INDEX idx_chunks_embedding ON chunks USING ivfflat (embedding vector_cosine_ops);

-- Create function to update thread's updated_at timestamp when a new chat is created
CREATE OR REPLACE FUNCTION update_thread_updated_at_on_chat () RETURNS TRIGGER AS $$
BEGIN
    UPDATE threads
    SET updated_at = NEW.created_at
    WHERE thread_id = NEW.thread_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for chats table to update thread's updated_at
CREATE TRIGGER update_thread_updated_at_on_chat
AFTER INSERT ON chats FOR EACH ROW
EXECUTE FUNCTION update_thread_updated_at_on_chat ();
