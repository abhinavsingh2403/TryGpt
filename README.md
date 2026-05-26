<div align="center">

<!-- Animated Hero Banner -->
<img src="client/src/assets/logo_full.svg" alt="TryGPT Logo" width="280" />

<br />
<br />

# ✦ TryGPT — Intelligent Conversational AI Workspace ✦

**The premium, full-stack AI workspace built for the modern developer.**
<br />
Real-time streaming · Vector Search RAG · Voice Mode · Image Generation · Production Security

<br />

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Gemini](https://img.shields.io/badge/Gemini-2.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-⚡-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![License](https://img.shields.io/badge/License-MIT-F59E0B?style=for-the-badge)](LICENSE)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

<br />

[🚀 Live Demo](https://trygpt.vercel.app) · [📖 Documentation](#-architecture) · [🐛 Report Bug](https://github.com/abhinavsingh2403/TryGpt/issues) · [💡 Request Feature](https://github.com/abhinavsingh2403/TryGpt/issues)

<br />

---

</div>

<br />

## 🎬 Preview

<div align="center">
<table>
<tr>
<td width="50%">

**🌙 Dark Mode — Chat Interface**

<img src="client/src/assets/ai_image1.jpg" alt="TryGPT Dark Mode Chat" width="100%" style="border-radius: 12px;" />

</td>
<td width="50%">

**🎨 Community Gallery**

<img src="client/src/assets/ai_image2.jpg" alt="TryGPT Community Gallery" width="100%" style="border-radius: 12px;" />

</td>
</tr>
</table>
</div>

<br />

## 📋 Table of Contents

<details>
<summary><b>Click to expand</b></summary>

- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Tech Stack](#️-tech-stack)
- [📦 Installation](#-installation)
- [⚙️ Configuration](#️-configuration)
- [🚀 Usage](#-usage)
- [⌨️ Keyboard Shortcuts](#️-keyboard-shortcuts)
- [📡 API Reference](#-api-reference)
- [📂 Project Structure](#-project-structure)
- [🧪 Testing](#-testing)
- [☁️ Deployment](#️-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [🙏 Acknowledgements](#-acknowledgements)

</details>

<br />

## ✨ Features

### 🧠 Core AI Engine

| Feature | Description | Tech |
|:--------|:------------|:-----|
| **Real-time Streaming** | Fluid, typewriter-style responses via Server-Sent Events (SSE) with chunk-by-chunk rendering | Gemini 2.5 Flash + SSE |
| **Vector Search RAG** | Upload PDFs → auto-chunk → embed with Gemini → cosine similarity search for context-aware answers | `text-embedding-004` |
| **Smart Fallback Engine** | Fully functional local AI mock-engine that simulates streaming when API keys are unavailable or rate-limited | Custom JS Engine |
| **Multi-personality Modes** | Switch between `Helpful`, `Concise`, and `Creative` response styles with tuned temperature settings | Dynamic Prompt Engineering |

### 🎨 Multimodal Capabilities

| Feature | Description |
|:--------|:------------|
| **🖼️ Image Generation** | Generate high-quality, watermark-free images from natural language prompts using intelligent keyword extraction |
| **📷 Vision Analysis** | Attach images directly to chat — Gemini analyzes and responds to visual content with inline base64 encoding |
| **📄 PDF Document Chat** | Upload PDFs up to ~50 pages, auto-extracted and chunked with overlapping windows for precise retrieval |
| **🎙️ Voice Mode** | Built-in Web Speech API integration for hands-free dictation with real-time interim transcription |

### 💎 Premium Experience

| Feature | Description |
|:--------|:------------|
| **✨ Glassmorphism UI** | Frosted-glass panels, gradient accents, and depth layers with parallax mouse-tracking on login |
| **🌗 Dark & Light Themes** | Full dual-theme support with smooth transitions and persistent preference storage |
| **💬 Persistent Workspaces** | MongoDB-backed chat history with auto-generated titles, pinning, search, and bulk management |
| **📤 Export Conversations** | Download chats as formatted Markdown (`.md`) or plain text (`.txt`) with timestamps |
| **🎭 Community Gallery** | Masonry-grid showcase of AI-generated images with likes, downloads, sharing, and category filters |
| **💳 Credits & Pricing** | Beautiful pricing page with tiered plans, animated cards, and gradient CTAs |
| **⚡ Smart Auto-resize** | Textarea auto-grows with content up to a max height, with smooth keyboard interaction |
| **🔄 Regenerate & Edit** | Re-generate any AI response or edit previous messages to fork the conversation |
| **🛑 Stop Generation** | Cancel in-flight streaming responses instantly with abort controller integration |

### 🔒 Enterprise-Grade Security

| Layer | Implementation |
|:------|:---------------|
| **Authentication** | JWT-based auth with bcrypt password hashing and protected route middleware |
| **HTTP Security** | Helmet.js with CSP, HSTS, X-Frame-Options, and XSS protection headers |
| **Rate Limiting** | Express Rate Limit — 100 requests per 15-minute window per IP |
| **CORS** | Strict cross-origin policy with credentials support |
| **Input Sanitization** | Request body size limits (50MB), validated payloads, and safe error messages |
| **Error Handling** | Global error middleware with stack trace suppression in production |

<br />

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        CLIENT (React 19 + Vite)                  │
│                                                                  │
│   ┌──────────┐  ┌──────────┐  ┌───────────┐  ┌──────────────┐   │
│   │  Login   │  │ Chatbox  │  │ Community │  │   Credits    │   │
│   │  Page    │  │Component │  │  Gallery  │  │   Page       │   │
│   └────┬─────┘  └────┬─────┘  └───────────┘  └──────────────┘   │
│        │              │                                          │
│   ┌────┴──────────────┴──────────────────────────────────────┐   │
│   │              AppContext (Global State Manager)            │   │
│   │  • Auth state   • Chat CRUD   • Streaming   • Settings   │   │
│   └────┬─────────────────────────────────────────────────────┘   │
│        │                                                         │
│   ┌────┴─────────────────┐  ┌────────────────────────────────┐   │
│   │   API Client Layer   │  │   Local AI Fallback Engine     │   │
│   │  (JWT + SSE Stream)  │  │  (Image Gen + Code + Email)    │   │
│   └────┬─────────────────┘  └────────────────────────────────┘   │
│        │                                                         │
└────────┼─────────────────────────────────────────────────────────┘
         │  HTTPS / SSE
         ▼
┌────────────────────────────────────────────────────────────────── ┐
│                     SERVER (Express 5 + Node.js)                  │
│                                                                   │
│   ┌───────────┐  ┌───────────┐  ┌──────────┐  ┌──────────────┐   │
│   │  Helmet   │  │   CORS    │  │  Rate    │  │    JWT       │   │
│   │  Headers  │  │  Policy   │  │  Limiter │  │  Auth MW     │   │
│   └───────────┘  └───────────┘  └──────────┘  └──────────────┘   │
│                                                                   │
│   ┌─────────────────────────────────────────────────────────── ┐  │
│   │                     ROUTE HANDLERS                         │  │
│   │                                                            │  │
│   │  POST /api/auth/register    POST /api/auth/login           │  │
│   │  GET  /api/auth/me          GET  /api/chats                │  │
│   │  POST /api/chats            PUT  /api/chats/:id            │  │
│   │  DELETE /api/chats/:id      POST /api/ai/generate          │  │
│   │  POST /api/pdf/extract      GET  /api/health               │  │
│   └───────────────────────────────────────────────────────────┘   │
│                                                                   │
│   ┌─────────────┐  ┌────────────────┐  ┌──────────────────────┐   │
│   │  AI Engine  │  │  PDF Pipeline  │  │  Vector Search (RAG) │   │
│   │ Gemini 2.5  │  │  pdf-parse +   │  │  Embed → Chunk →     │   │
│   │ Flash SSE   │  │  multer upload │  │  Cosine Similarity   │   │
│   └──────┬──────┘  └───────┬────────┘  └──────────┬───────────┘   │
│          │                 │                       │               │
└──────────┼─────────────────┼───────────────────────┼──────────────┘
           │                 │                       │
           ▼                 ▼                       ▼
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│   ☁️  Google Gemini API          🍃  MongoDB Atlas               │
│   • generateContent (SSE)        • Users collection              │
│   • embedContent                 • Chats collection              │
│   • text-embedding-004           • Document vectors              │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### 🔄 RAG Pipeline — How Document Chat Works

```
   📄 PDF Upload                    💬 User Question
       │                                 │
       ▼                                 ▼
  ┌─────────┐                     ┌─────────────┐
  │pdf-parse│                     │  Embed the   │
  │ extract │                     │   question   │
  └────┬────┘                     └──────┬───────┘
       │                                 │
       ▼                                 ▼
  ┌──────────────┐               ┌───────────────┐
  │ Chunk text   │               │ Cosine sim vs │
  │ (400 words,  │               │ all stored    │
  │  50 overlap) │               │ chunk vectors │
  └──────┬───────┘               └───────┬───────┘
         │                               │
         ▼                               ▼
  ┌──────────────┐               ┌───────────────┐
  │ Embed each   │               │  Top 3 chunks │
  │ chunk via    │               │  injected as  │
  │ Gemini API   │               │  context into │
  └──────┬───────┘               │  the prompt   │
         │                       └───────┬───────┘
         ▼                               │
  ┌──────────────┐                       ▼
  │ Store in     │               ┌───────────────┐
  │ MongoDB with │               │ Gemini answers│
  │ embeddings   │               │ using context │
  └──────────────┘               └───────────────┘
```

<br />

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|:-----------|:--------|:--------|
| [React](https://react.dev) | `19` | UI library with hooks and context API |
| [Vite](https://vitejs.dev) | `latest` | Lightning-fast HMR dev server & bundler |
| [Tailwind CSS](https://tailwindcss.com) | `4` | Utility-first CSS with dark mode support |
| [React Router DOM](https://reactrouter.com) | `latest` | Client-side routing (`/`, `/credits`, `/community`) |
| [Vitest](https://vitest.dev) | `latest` | Blazing-fast unit testing framework |
| [React Testing Library](https://testing-library.com) | `latest` | Component testing utilities |

### Backend

| Technology | Version | Purpose |
|:-----------|:--------|:--------|
| [Express](https://expressjs.com) | `5` | Fast, minimal web framework |
| [Mongoose](https://mongoosejs.com) | `9` | MongoDB ODM with schema validation |
| [JWT](https://jwt.io) | `9` | Stateless authentication tokens |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | `3` | Password hashing (12 salt rounds) |
| [Helmet](https://helmetjs.github.io) | `8` | HTTP security headers |
| [express-rate-limit](https://github.com/express-rate-limit/express-rate-limit) | `8` | API rate limiting middleware |
| [pdf-parse](https://www.npmjs.com/package/pdf-parse) | `2` | PDF text extraction |
| [multer](https://github.com/expressjs/multer) | `2` | Multipart file upload handling |
| [Jest](https://jestjs.io) | `30` | Backend testing framework |
| [Supertest](https://github.com/ladjs/supertest) | `7` | HTTP assertion library |

### AI & ML

| Service | Model | Purpose |
|:--------|:------|:--------|
| Google Gemini | `gemini-2.5-flash` | Primary LLM for chat generation (streaming + non-streaming) |
| Google Gemini | `text-embedding-004` | Text embeddings for RAG vector search |
| LoremFlickr | — | Dynamic image generation from keyword extraction |

<br />

## 📦 Installation

### Prerequisites

| Requirement | Minimum Version | Check Command |
|:------------|:----------------|:--------------|
| Node.js | `v18.0.0` | `node --version` |
| npm | `v9.0.0` | `npm --version` |
| MongoDB | `6.0+` or Atlas | `mongod --version` |
| Gemini API Key | — | [Get one here →](https://aistudio.google.com/app/apikey) |

### Quick Start

```bash
# 1️⃣  Clone the repository
git clone https://github.com/abhinavsingh2403/TryGpt.git
cd TryGpt

# 2️⃣  Install all dependencies
cd server && npm install
cd ../client && npm install
cd ..

# 3️⃣  Configure environment (see next section)
cp server/.env.example server/.env

# 4️⃣  Start development servers
# Terminal 1 — Backend (Port 5000)
cd server && npm run dev

# Terminal 2 — Frontend (Port 5173)
cd client && npm run dev
```

> [!TIP]
> You can also use the included `start.bat` (Windows) to launch both servers simultaneously.

<br />

## ⚙️ Configuration

Create a `.env` file in the `server/` directory:

```env
# ─── Server ────────────────────────────────────
PORT=5000
NODE_ENV=development

# ─── Database ──────────────────────────────────
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/trygpt

# ─── Authentication ────────────────────────────
JWT_SECRET=your_super_secret_jwt_key_min_32_chars

# ─── AI Services ───────────────────────────────
GEMINI_API_KEY=your_gemini_api_key_from_google_ai_studio
```

<details>
<summary><b>📝 Environment Variable Reference</b></summary>

| Variable | Required | Default | Description |
|:---------|:---------|:--------|:------------|
| `PORT` | No | `5000` | Express server port |
| `NODE_ENV` | No | `development` | Environment mode (`development` / `production` / `test`) |
| `MONGODB_URI` | **Yes** | — | MongoDB connection string (Atlas or local) |
| `JWT_SECRET` | **Yes** | — | Secret key for signing JWT tokens (use a strong random string) |
| `GEMINI_API_KEY` | **Yes** | — | Google AI Studio API key for Gemini models |

</details>

> [!IMPORTANT]
> Never commit your `.env` file. It is already included in `.gitignore`. If the `GEMINI_API_KEY` is missing, the app gracefully falls back to the local AI engine.

<br />

## 🚀 Usage

### Starting the App

| Command | Directory | Description |
|:--------|:----------|:------------|
| `npm run dev` | `server/` | Start backend with Nodemon (auto-reload) |
| `npm run dev` | `client/` | Start Vite dev server with HMR |
| `npm start` | `server/` | Start backend in production mode |

### In-App Features

| Action | How |
|:-------|:----|
| **New Chat** | Click `+` in sidebar or press `Ctrl+N` |
| **Send Message** | Type in the input box and press `Enter` |
| **Voice Input** | Click the 🎙️ microphone button to dictate |
| **Attach Image** | Click 📎 and select an image file for vision analysis |
| **Upload PDF** | Click 📎 and select a PDF for document chat |
| **Generate Image** | Type "Generate an image of..." or "Create a picture of..." |
| **Switch Theme** | Click the theme toggle in sidebar or press `Ctrl+Shift+T` |
| **Export Chat** | Right-click a chat in sidebar → Export as Markdown/Text |
| **Stop Generation** | Click the ⏹️ stop button during AI streaming |
| **Regenerate** | Click the 🔄 regenerate button on any AI response |
| **Edit Message** | Click the ✏️ edit button on any user message |
| **Pin Chat** | Click the 📌 pin icon in sidebar to pin important chats |

<br />

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|:---------|:-------|
| <kbd>Ctrl</kbd> + <kbd>N</kbd> | Create new chat |
| <kbd>Ctrl</kbd> + <kbd>/</kbd> | Focus chat input |
| <kbd>Ctrl</kbd> + <kbd>B</kbd> | Toggle sidebar |
| <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>T</kbd> | Toggle dark/light theme |
| <kbd>Esc</kbd> | Close sidebar |
| <kbd>Enter</kbd> | Send message |
| <kbd>Shift</kbd> + <kbd>Enter</kbd> | New line in message |

<br />

## 📡 API Reference

### Authentication

| Method | Endpoint | Auth | Description |
|:-------|:---------|:-----|:------------|
| `POST` | `/api/auth/register` | ❌ | Register a new user account |
| `POST` | `/api/auth/login` | ❌ | Login and receive JWT token |
| `GET` | `/api/auth/me` | 🔒 | Get current authenticated user |

### Chat Management

| Method | Endpoint | Auth | Description |
|:-------|:---------|:-----|:------------|
| `GET` | `/api/chats` | 🔒 | Fetch all chats for authenticated user |
| `POST` | `/api/chats` | 🔒 | Create a new chat workspace |
| `PUT` | `/api/chats/:id` | 🔒 | Update chat (messages, name, documents) |
| `DELETE` | `/api/chats/:id` | 🔒 | Delete a specific chat |

### AI Generation

| Method | Endpoint | Auth | Description |
|:-------|:---------|:-----|:------------|
| `POST` | `/api/ai/generate` | 🔒 | Generate AI response (supports SSE streaming) |

<details>
<summary><b>Request Body Example</b></summary>

```json
{
  "chatId": "6651abc...",
  "messages": [
    { "role": "user", "content": "Explain quantum computing" }
  ],
  "personality": "helpful",
  "streaming": true
}
```

</details>

### PDF Processing

| Method | Endpoint | Auth | Description |
|:-------|:---------|:-----|:------------|
| `POST` | `/api/pdf/extract` | ❌ | Upload PDF, extract text, chunk & embed for RAG |

### Health Check

| Method | Endpoint | Auth | Description |
|:-------|:---------|:-----|:------------|
| `GET` | `/api/health` | ❌ | Server status and environment check |

<br />

## 📂 Project Structure

```
TryGpt/
├── 📁 client/                    # Frontend (React 19 + Vite)
│   ├── 📁 src/
│   │   ├── 📁 assets/            # Images, SVG icons, community gallery assets
│   │   ├── 📁 components/
│   │   │   ├── chatbox.jsx       # Main chat interface with input, voice, attachments
│   │   │   ├── message.jsx       # Message bubble with markdown, code highlighting
│   │   │   └── sidebar.jsx       # Navigation, chat list, search, settings panel
│   │   ├── 📁 context/
│   │   │   └── Appcontext.jsx    # Global state: auth, chats, streaming, settings
│   │   ├── 📁 pages/
│   │   │   ├── login.jsx         # Auth page with parallax, typing animation
│   │   │   ├── credits.jsx       # Pricing tiers with animated cards
│   │   │   ├── community.jsx     # Masonry image gallery with filters
│   │   │   └── loading.jsx       # Loading spinner component
│   │   ├── 📁 utils/
│   │   │   ├── api.js            # HTTP client with JWT, SSE stream parser
│   │   │   ├── aiEngine.js       # Local fallback AI engine
│   │   │   ├── exportUtils.js    # Markdown/text export + clipboard helpers
│   │   │   └── useKeyboardShortcuts.js  # Global keyboard shortcut hook
│   │   ├── 📁 __tests__/
│   │   │   └── App.test.jsx      # Component unit tests
│   │   ├── App.jsx               # Root component with routing
│   │   ├── main.jsx              # React DOM entry point
│   │   └── index.css             # Global styles & Tailwind imports
│   └── package.json
│
├── 📁 server/                    # Backend (Express 5 + Node.js)
│   ├── 📁 config/
│   │   └── db.js                 # MongoDB connection manager
│   ├── 📁 controllers/
│   │   ├── aiController.js       # Gemini SSE streaming + RAG vector search
│   │   ├── authController.js     # Register, login, JWT issuance
│   │   ├── chatController.js     # CRUD operations for chat workspaces
│   │   └── pdfController.js      # PDF extraction, chunking, embedding
│   ├── 📁 middleware/
│   │   └── authMiddleware.js     # JWT verification middleware
│   ├── 📁 models/
│   │   ├── chatModel.js          # Chat schema with messages + document vectors
│   │   └── userModel.js          # User schema with hashed passwords
│   ├── 📁 routes/
│   │   ├── aiRoutes.js           # AI generation endpoints
│   │   ├── authRoutes.js         # Authentication endpoints
│   │   ├── chatRoutes.js         # Chat CRUD endpoints
│   │   └── pdfRoutes.js          # PDF upload + extraction endpoints
│   ├── 📁 utils/
│   │   └── pdfParseWrapper.js    # Lazy-loaded pdf-parse (Vercel compatibility)
│   ├── 📁 tests/
│   │   └── auth.test.js          # Authentication API tests
│   ├── server.js                 # Express app entry point
│   ├── .env.example              # Environment template
│   └── package.json
│
├── vercel.json                   # Vercel deployment configuration
├── start.bat                     # Windows: start both servers
├── build.bat                     # Windows: build for production
├── .gitignore
└── README.md                     # ← You are here
```

<br />

## 🧪 Testing

### Frontend Tests

```bash
cd client
npm run test
```

> Powered by **Vitest** with React Testing Library for component-level assertions.

### Backend Tests

```bash
cd server
npm run test
```

> Powered by **Jest 30** with Supertest for API endpoint testing.

### Test Coverage

| Area | Framework | What's Tested |
|:-----|:----------|:--------------|
| Components | Vitest + RTL | App rendering, routing, context integration |
| Auth API | Jest + Supertest | Registration, login, token validation |

<br />

## ☁️ Deployment

### Vercel (Recommended)

This project includes a pre-configured [`vercel.json`](vercel.json) that handles both frontend static build and backend serverless functions automatically.

```bash
# 1️⃣  Install Vercel CLI
npm i -g vercel

# 2️⃣  Deploy from root directory
vercel

# 3️⃣  Set production environment variables
vercel env add MONGODB_URI
vercel env add JWT_SECRET
vercel env add GEMINI_API_KEY
```

> [!WARNING]
> The `pdf-parse` module may crash during Vercel's serverless cold start. TryGPT handles this gracefully — PDF routes are loaded dynamically with a fallback 503 response if the module fails to initialize.

### Vercel Configuration Breakdown

| Setting | Value | Purpose |
|:--------|:------|:--------|
| Frontend Build | `@vercel/static-build` | Compiles React app from `client/` |
| Backend | `@vercel/node` | Runs Express via serverless function |
| API Rewrite | `/api/*` → `server.js` | Routes all API calls to Express |
| SPA Fallback | `/*` → `index.html` | Enables client-side routing |

<br />

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

```bash
# 1. Fork the repository
# 2. Create your feature branch
git checkout -b feature/amazing-feature

# 3. Commit your changes
git commit -m "feat: add amazing feature"

# 4. Push to the branch
git push origin feature/amazing-feature

# 5. Open a Pull Request
```

### Commit Convention

| Prefix | Usage |
|:-------|:------|
| `feat:` | New features |
| `fix:` | Bug fixes |
| `docs:` | Documentation changes |
| `style:` | Code style (formatting, semicolons, etc.) |
| `refactor:` | Code refactoring without feature changes |
| `test:` | Adding or updating tests |
| `chore:` | Maintenance tasks |

<br />

## 📄 License

This project is licensed under the **MIT License** — you are free to use, modify, and distribute it.

```
MIT License

Copyright (c) 2025 Abhinav Singh

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

<br />

## 🙏 Acknowledgements

<div align="center">

| Resource | Description |
|:---------|:------------|
| [Google Gemini](https://ai.google.dev) | LLM and embedding models powering the AI engine |
| [React](https://react.dev) | The frontend UI library |
| [Tailwind CSS](https://tailwindcss.com) | Utility-first CSS framework |
| [MongoDB](https://mongodb.com) | Document database for chat persistence |
| [Vite](https://vitejs.dev) | Next-generation frontend build tool |
| [Vercel](https://vercel.com) | Serverless deployment platform |
| [LoremFlickr](https://loremflickr.com) | Dynamic placeholder image API |

</div>

<br />

---

<div align="center">

<img src="client/src/assets/favicon.svg" alt="TryGPT Icon" width="40" />

**Built with ❤️ by [Abhinav Singh](https://github.com/abhinavsingh2403)**

If you found this project helpful, please consider giving it a ⭐

<br />

[![Star](https://img.shields.io/github/stars/abhinavsingh2403/TryGpt?style=social)](https://github.com/abhinavsingh2403/TryGpt)
[![Fork](https://img.shields.io/github/forks/abhinavsingh2403/TryGpt?style=social)](https://github.com/abhinavsingh2403/TryGpt/fork)
[![Watch](https://img.shields.io/github/watchers/abhinavsingh2403/TryGpt?style=social)](https://github.com/abhinavsingh2403/TryGpt)

</div>
