# Why this project? and what dose these RAG and vector DB even mean? and what problem does it solve?
Easy way to communicate with AI was to send data to AI with additional context and it will return the answer. But the thing with this approach is that it is not scalable and you have to send all the data to AI every time you want to ask a question. What if you have MBs of text data? It will take a lot of time. This is vector database and RAG (Retrieval-Augmented Generation) comes into play. 

### Vector DB
Easy way to understand vector database is to consider a point int a 3D space. Each point has 3 coordinates (x, y, z) and it is unique. So if you have a lot of points like let's say all points in the Uttar-Pradesh and if i ask you what is the best place to visit in Gorakhpur? Now as you have all the points in the Uttar-Pradesh you only have to look at the points in Gorakhpur and find the one that is closest to the question. This is what vector database does. It stores the data in a way that it can be easily searched and retrieved.

### RAG (Retrieval-Augmented Generation)

Remember finding the closest point in the Gorakhpur? This is what RAG does. It retrieves the relevant data from the vector database and sends it to AI for generating the answer. 

# Smart Document Search & Q&A (Cloud-Powered AI Stack)

Smart Document Search & Q&A is a full-stack web application that enables users to upload documents (PDF, DOCX, TXT), ask natural language questions about their content, and receive context-aware answers powered by Google's Gemini 2.5 Flash AI model. The application features cloud deployment for scalability and performance.
1. **Upload:** User uploads documents through the Next.js frontend. Azure-hosted backend extracts and chunks text for semantic search
2. **Indexing:** Each chunk is embedded and stored in Qdrant Cloud with metadata for fast retrieval
3. **Question Answering:** User asks a question. The system retrieves the most relevant document chunks from Qdrant and feeds them to Google Gemini 2.5 Flash using LangChain's RAG pipeline
4. **Results:** Gemini generates a precise, context-aware answer and the UI highlights the original document locations web application that enables users to upload documents (PDF, DOCX, TXT), ask natural language questions about their content, and receive context-aware answers powered by Google's Gemini 2.5 Flash AI model. The application features cloud deployment for scalability and performance.

This project blends modern full-stack web development with cutting-edge GenAI workflows:
- **Frontend:** Next.js with React and Tailwind CSS for a clean and intuitive user interface
- **Backend:** Node.js & Express deployed on Microsoft Azure for robust file handling and orchestration
- **AI Layer:** Google Gemini 2.5 Flash for powerful language understanding, Qdrant Cloud for high-speed vector search, and LangChain.js to orchestrate retrieval-augmented generation (RAG)
- **Infrastructure:** Azure deployment with ngrok for secure HTTPS connectivity

---

## Tech Stack

<img src="https://skillicons.dev/icons?i=nextjs,react,nodejs,tailwind,docker,express&theme=dark" alt="Tech Stack" />

- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** Node.js, Express (deployed on Azure)
- **Document Parsing:** pdf-parse, mammoth
- **Vector DB:** Qdrant Cloud
- **AI Model:** Google Gemini 2.5 Flash
- **Orchestration:** LangChain.js
- **Infrastructure:** Microsoft Azure, ngrok
- **Highlighting:** mark.js


## Architecture

```
[User]
   │
   ▼
[Next.js Frontend] ⇄ [Azure-hosted API] ⇄ [Qdrant Cloud] ⇄ [Google Gemini 2.5 Flash]
                            │
                            ▼
                      [ngrok HTTPS Tunnel]
```

- **Frontend:** Handles document upload, querying, answer display, and highlighting
- **Backend:** Azure-deployed Node.js API that manages uploads, parses documents, generates embeddings, and orchestrates the AI pipeline
- **Vector Database:** Qdrant Cloud for scalable vector storage and similarity search
- **AI Layer:** Google Gemini 2.5 Flash for advanced language understanding and generation
- **Connectivity:** ngrok provides secure HTTPS tunneling for seamless API communication

---


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


## Suggested Use Cases

- Enterprise knowledge base with cloud scalability and AI-powered search
- Research assistant for academics, lawyers, or analysts with advanced language understanding
- Document analysis platform with professional-grade AI capabilities
- Learning platform for exploring modern GenAI and cloud deployment architectures

## Installation & Setup

### Prerequisites
- Node.js (v18+)
- Google Gemini API key
- Qdrant Cloud account
- Azure account (for backend deployment)
- ngrok account (for HTTPS tunneling)

### Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Ryomensukuna2003/ragstack
   cd ragstack
   ```

2. **Install dependencies:**
   ```bash
   # Backend dependencies
   cd server
   npm install
   
   # Frontend dependencies
   cd ../client
   npm install
   ```

3. **Environment Configuration:**
   Create `.env` files in both server and client directories with your API keys:
   ```bash
   # server/.env
   GEMINI_API_KEY=your_gemini_api_key
   QDRANT_URL=your_qdrant_cloud_url
   QDRANT_API_KEY=your_qdrant_api_key
   PORT=3001
   
   # client/.env.local
   NEXT_PUBLIC_API_URL=your_ngrok_or_azure_backend_url
   ```

4. **Start the development servers:**
   ```bash
   # Start backend (in server directory)
   npm start
   
   # Start frontend (in client directory, new terminal)
   npm run dev
   ```

### Production Deployment

The application is currently deployed with:
- **Backend:** Microsoft Azure VM
- **Frontend:** Vercel
- **Database:** Qdrant Cloud for vector storage
- **HTTPS:** ngrok tunnel for secure API communication
