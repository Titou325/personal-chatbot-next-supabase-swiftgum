# Personal Chatbot with Next.js and Supabase

A modern web application that provides a personalized chat experience, built with React Router, Supabase, and OpenAI integration.

## Features

- 🔐 User Authentication (Login/Register)
- 💬 Real-time Chat Interface
- 🤖 AI-powered Conversations
- 🎨 Modern UI with Tailwind CSS
- 🔒 Secure Data Storage with Supabase

## Tech Stack

- **Frontend**: React + React Router
- **Backend**: Supabase
- **AI Integration**: OpenAI
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL

## Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env.local` and fill in your environment variables
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Run the development server:
   ```bash
   pnpm dev
   ```

## Environment Variables

Make sure to set up the following environment variables in your `.env.local`:

- Supabase configuration
- OpenAI API keys
- Other necessary API credentials

## Development

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm typecheck` - Run type checking
- `pnpm gentypes` - Generate Supabase types

## Project Structure

- `/app` - Main application code and routes
- `/components` - Reusable React components
- `/utils` - Utility functions and helpers
- `/supabase` - Supabase configuration and types
