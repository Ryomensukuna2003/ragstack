# Smart Document Search & Q&A (Local, Private, Modern AI Stack)

> [!IMPORTANT]  
> You will need a good GPU to run this project effectively. I was running it on Ryzen 7 CPU with integrated graphics, and it was very slow. I recommend using a GPU with at least 8GB of VRAM for optimal performance. 


Smart Document Search & Q&A is a privacy-focused, local-first application that enables users to upload documents (PDF, DOCX, TXT), ask natural language questions about their content, and receive context-aware answers powered by the latest open-source Large Language Models (LLMs). All processing is performed locally, ensuring full data privacy and zero cloud dependency.

This project blends modern full-stack web development with cutting-edge GenAI workflows:
- **Frontend:** React, Tailwind CSS for a clean and intuitive user interface.
- **Backend:** Node.js & Express for robust file handling and orchestration.
- **AI Layer:** Integrates Ollama (running LLaMA3 or Mistral) for local LLMs, qdrant for high-speed vector search, and LangChain.js to orchestrate retrieval-augmented generation (RAG).

---

## Key Features

- Upload documents in PDF, DOCX, or TXT formats.
- Ask any question about your documents in plain English.
- Get accurate, context-rich answers powered by local LLMs—no data ever leaves your machine.
- Highlights and references the exact place in your documents where answers were found.
- Q&A history for easy reference.
- Built with a modern, responsive UI and a developer-friendly, extensible codebase.

---

## Architecture

```
[User]
   │
   ▼
[React Frontend] ⇄ [Node.js API] ⇄ [qdrant (docker)] ⇄ [LangChain.js + Ollama (Mistral/LLaMA3)]
```

- **Frontend:** Handles document upload, querying, answer display, and highlighting.
- **Backend:** Manages uploads, parses documents, generates embeddings, stores and queries Chroma vectors, and orchestrates the LLM pipeline.
- **AI Layer:** Uses local LLMs via Ollama, local embeddings with nomic-embed-text, and a LangChain.js RAG pipeline for efficient retrieval and answer generation.

---

## Tech Stack

<img src="https://skillicons.dev/icons?i=nextjs,react,nodejs,tailwind,docker,express&theme=dark" alt="Tech Stack" />

- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express, multer
- **Document Parsing:** pdf-parse, mammoth
- **Vector DB:** Chroma (local)
- **Embeddings/LLM:** Ollama (Mistral, LLaMA3), nomic-embed-text
- **Orchestration:** LangChain.js
- **Highlighting:** mark.js

## API Endpoints

### Document Upload
- **POST** `/api/upload`
  - Upload and process documents
  - Accepts: PDF, DOCX, TXT files
  - Returns: Processing status and document ID

### Question Answering
- **POST** `/api/ask`
  - Ask questions about uploaded documents
  - Body: `{ question: string, docId: string }`
  - Returns: AI-generated answer


## Project Structure

```
RAG/
├── client/                 # Next.js frontend application
│   ├── app/               # App router pages and layouts
│   ├── components/        # Reusable UI components
│   └── package.json       # Frontend dependencies
├── server/                # Express.js backend application
│   ├── controllers/       # Request handlers
│   ├── routes/           # API route definitions
│   ├── services/         # Business logic and utilities
│   ├── uploads/          # File upload directory
│   └── package.json      # Backend dependencies
└── README.md             # Project documentation
```

## How It Works

1. **Upload:** User uploads one or more documents. Backend extracts and chunks text for semantic search.
2. **Indexing:** Each chunk is embedded using nomic-embed-text via Ollama and stored in Chroma DB with metadata.
3. **Question Answering:** User asks a question. The system retrieves the most relevant document chunks and feeds them, along with the question, to the LLM using LangChain’s RAG pipeline.
4. **Results:** The LLM generates a precise, context-aware answer and the UI highlights the original document locations.

---

## Why This Project Stands Out

- **Full Privacy:** No cloud APIs. All data and AI computation remain on your hardware.
- **Modern AI Workflows:** Demonstrates hands-on skill with LangChain, RAG, vector databases, and LLM orchestration.
- **Full-Stack Excellence:** Built from the ground up using industry-standard front-end and back-end frameworks.
- **Extensible:** Easily add features like multi-file search, summarization, tagging, or user authentication.

---

## Suggested Use Cases

- Private research assistant for academics, lawyers, or analysts.
- Self-hosted enterprise knowledge base with full data control.
- Learning platform for exploring and experimenting with GenAI and retrieval-augmented architectures.

## Installation
### Prerequisites
- Node.js (v18+)
- Docker (for qdrant)
- Ollama (for local LLMs)
### Setup Steps
1. **Clone the repository:**
   ```bash
   git clone https://github.com/Ryomensukuna2003/ragstack
   cd ragstack
   ```
2. **Install dependencies:**
   ```bash
   cd server
   npm install
   cd ../client
   npm install
   ```
3. **Start the backend server:**
   ```bash
   cd server
   npm run dev
   ```
4. **Start the frontend application:**
   ```bash
   cd ../client
   npm run dev
   ```
5. **Run qdrant in Docker:**
   ```bash
   docker run -d --name qdrant -p 6333:6333 qdrant/qdrant
   ```
6. **Start Ollama with Mistral or LLaMA3:**
   ```bash
   ollama pull mistral
   ollama pull nomic-embed-text
   ollama serve & # Ensure Ollama is running
   ```
