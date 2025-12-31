# Support AI
A robust, production-ready AI customer support chat agent is ready. This application simulates a live chat experience where an AI agent assists users with store policies using an LLM (OpenAI) and persists conversations in a PostgreSQL database.

Live Demo: https://llm-customer-support.vercel.app/

Backend API: https://llm-customer-support.onrender.com

## Quick Start
1. **Prerequisites**
-Node.js (v18 or higher)
-PostgreSQL instance (local or hosted on Supabase/Aiven)
-OpenAI API Key

2. **Backend Setup**
-Navigate to the /backend folder.
-Install dependencies: npm install
-Create a .env file:

```env
PORT=3000
DATABASE_URL="postgresql://user:password@localhost:5432/db"
OPENAI_API_KEY="your_key_here"
OPENAI_MODEL="gpt-3.5-turbo"
```

-Run migrations: npx prisma migrate dev
-Start the server: npm run dev

3. **Frontend Setup**
-Navigate to the /frontend folder.
-Install dependencies: npm install
-Create a .env file:

```env
VITE_API_URL="http://localhost:3000"
```
-Start the app: npm run dev

## Architecture Overview
The project is structured with a clear separation of concerns to ensure scalability and ease of maintenance.

Backend (Node.js + TypeScript)
Routes Layer: Handles HTTP requests and delegates to services.

Service Layer: Contains business logic, LLM integration, and DB interactions.

Validation Layer: A dedicated validator ensuring all incoming data (messages, IDs) is "clean" before processing.

Global Error Handler: A centralized middleware that catches custom AppError instances and standardizes API responses.

Frontend (React + Tailwind CSS)
Atomic Components: Reusable UI components (ChatContainer, MessageList, MessageInput).

Hooks & State: Manages chat history and persistence using localStorage for session continuity.

Markdown Rendering: Integration of react-markdown to ensure AI responses are beautifully formatted.

## Key Features & "Idiot-Proofing" (Robustness)
I implemented several layers of protection against common failures:

Input Validation:

Messages are capped at 2000 characters to prevent LLM token overflow and cost spikes.

Empty or whitespace-only messages are rejected with a 400 Bad Request.

Referential Integrity:

The backend validates conversationID against the database before attempting to save messages. This prevents Foreign Key Constraint crashes (P2003 errors).

Security (Payload Limits):

Configured Express with a 1MB JSON limit. If a malicious user sends a massive payload, the server returns a 413 Payload Too Large instead of crashing.

AI Guardrails (System Prompting):

Implemented a strict System Prompt that prevents "Jailbreaking." The agent refuses to roleplay (e.g., as a pirate) and stays focused solely on TechWorld Store support.

Graceful Error Handling:

Custom AppError class differentiates between operational errors (4xx) and unexpected server errors (5xx), ensuring the user always receives a helpful message instead of a raw stack trace.

## LLM Notes
Provider: groq (llama-3.3-70b-versatile).

Context Management: The agent is seeded with a STORE_CONTEXT containing shipping and return policies.

Conversation History: The backend fetches and passes previous messages in the array to provide the LLM with full context for follow-up questions.

## Trade-offs & "If I Had More Time..."
Redis Caching: I would implement Redis to cache frequently asked FAQ responses to save on LLM costs and latency.

Streaming: I would implement Server-Sent Events (SSE) to stream the AI response character-by-character for a better "typing" experience.

Advanced Memory: Instead of sending the entire history, I would implement a "sliding window" or summarization logic to handle very long conversations efficiently.

Unit Testing: I would add Jest/Supertest suites for the validation logic and route handlers.

# ⚠️Note on Deployment (Render Free Tier)
The backend is hosted on Render's free tier. If the application is idle, the server will "spin down." Please allow 30-60 seconds for the first message to process as the instance wakes up.