# Smart Document Search & Q&A (Local, Private, Modern AI Stack)


## Overview

Smart Document Search & Q&A is a privacy-focused, local-first application that enables users to upload documents (PDF, DOCX, TXT), ask natural language questions about their content, and receive context-aware answers powered by the latest open-source Large Language Models (LLMs). All processing is performed locally, ensuring full data privacy and zero cloud dependency.

This project blends modern full-stack web development with cutting-edge GenAI workflows:
- **Frontend:** React, Tailwind CSS for a clean and intuitive user interface.
- **Backend:** Node.js & Express for robust file handling and orchestration.
- **AI Layer:** Integrates Ollama (running LLaMA3 or Mistral) for local LLMs, ChromaDB for high-speed vector search, and LangChain.js to orchestrate retrieval-augmented generation (RAG).

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
[React Frontend] ⇄ [Node.js API] ⇄ [Chroma DB (local)] ⇄ [LangChain.js + Ollama (Mistral/LLaMA3)]
```

- **Frontend:** Handles document upload, querying, answer display, and highlighting.
- **Backend:** Manages uploads, parses documents, generates embeddings, stores and queries Chroma vectors, and orchestrates the LLM pipeline.
- **AI Layer:** Uses local LLMs via Ollama, local embeddings with nomic-embed-text, and a LangChain.js RAG pipeline for efficient retrieval and answer generation.

---

## Tech Stack

<img src="https://skillicons.dev/icons?i=nextjs,react,nodejs,tailwind,express&theme=dark" alt="Tech Stack" />

- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express, multer
- **Document Parsing:** pdf-parse, mammoth
- **Vector DB:** Chroma (local)
- **Embeddings/LLM:** Ollama (Mistral, LLaMA3), nomic-embed-text
- **Orchestration:** LangChain.js
- **Highlighting:** mark.js

---

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
