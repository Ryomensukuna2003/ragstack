import { QdrantVectorStore } from "@langchain/qdrant";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import {
  GoogleGenerativeAIEmbeddings,
  ChatGoogleGenerativeAI,
} from "@langchain/google-genai";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import "dotenv/config";

let vectorStore;

export const embedAndStoreChunks = async (rawText, docName) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });

  const chunks = await splitter.splitText(rawText);
  const metadatas = chunks.map((_, i) => ({ doc: docName, index: i }));

  const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "embedding-001",
    apiKey: process.env.GOOGLE_API_KEY,
  });

  vectorStore = await QdrantVectorStore.fromTexts(
    chunks,
    metadatas,
    embeddings,
    {
      url: process.env.QDRANT_URL || "http://localhost:6333",
      apiKey: process.env.QDRANT_API_KEY || undefined,
      https: {
        rejectUnauthorized: false,
      },
      checkCompatibility: false,
      collectionName: "smart-docs",
    }
  );
};

export const getAnswerFromChunks = async (question) => {
  if (!vectorStore) {
    throw new Error("Vector store not initialized. Upload a document first.");
  }

  const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    apiKey: process.env.GOOGLE_API_KEY,
  });

  const prompt = ChatPromptTemplate.fromTemplate(
    `Use the following documents to answer the question:
    
    {context}
    
    Question: {input}`
  );

  const combineDocsChain = await createStuffDocumentsChain({
    llm: model,
    prompt,
  });

  const chain = await createRetrievalChain({
    combineDocsChain,
    retriever: vectorStore.asRetriever(),
  });

  const result = await chain.invoke({ input: question });

  return result.answer;
};
