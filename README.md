# TryGPT - Intelligent Conversational AI Workspace

![TryGPT Banner](client/src/assets/logo.svg)

TryGPT is a full-stack AI conversational workspace. It features real-time streaming, image generation, voice recognition, and true Vector Search PDF document chat (RAG). Built to mimic a premium SaaS product, it includes robust authentication, chat persistence, and advanced backend security.

## 🚀 Features

- **Real-time AI Streaming**: Utilizes Server-Sent Events (SSE) for fluid, typewriter-style responses from Gemini 2.0 Flash.
- **True Vector Search Document Chat (RAG)**: Upload PDFs, extract text, automatically chunk and embed the content using Gemini, and perform cosine similarity vector search to answer questions with precise context.
- **Voice Mode**: Built-in speech recognition for hands-free interaction.
- **Image Generation**: Generates high-quality images using Pollinations AI.
- **Persistent Workspaces**: MongoDB-backed authentication and chat history storage.
- **Local Fallback Engine**: A robust local AI mock-engine that simulates streaming responses when API keys are unconfigured or unavailable.
- **Beautiful UI**: Built with React and Tailwind CSS, featuring glassmorphism, fluid animations, and a polished dark mode.
- **Production-Grade Security**: Helmet, Express Rate Limiting, strict CORS, and sanitized inputs.

## 🛠️ Tech Stack

### Frontend
- **React 19** (Vite)
- **Tailwind CSS 4**
- **React Router DOM**
- **Vitest & React Testing Library** (Unit Testing)

### Backend
- **Node.js & Express**
- **MongoDB & Mongoose** (Database)
- **JSON Web Tokens (JWT)** (Authentication)
- **pdf-parse & multer** (Document Parsing)
- **Jest & Supertest** (API Testing)
- **Helmet & Express Rate Limit** (Security)

## 📦 Local Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Gemini API Key

### Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/abhinavsingh2403/TryGpt.git
   cd TryGpt
   ```

2. **Install backend dependencies:**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies:**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Variables:**
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/trygpt
   JWT_SECRET=your_super_secret_key_change_me
   GEMINI_API_KEY=your_gemini_api_key
   NODE_ENV=development
   ```

5. **Run the application:**
   You can run both servers concurrently:
   - Terminal 1 (Backend): `cd server && npm run dev` (Runs on port 5000)
   - Terminal 2 (Frontend): `cd client && npm run dev` (Runs on port 5173)

## 🧪 Testing
- **Frontend**: `cd client && npm run test`
- **Backend**: `cd server && npm run test`

## 🚀 Deployment (Vercel)
This project is configured for Vercel deployment. The `vercel.json` at the root automatically builds the frontend and serves the Express backend via Serverless Functions.

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the root directory.
3. Ensure you add `MONGODB_URI`, `JWT_SECRET`, and `GEMINI_API_KEY` to your Vercel Project Settings.

## 📄 License
MIT License - Free to use and modify.
