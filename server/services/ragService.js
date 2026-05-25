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

const qdrantConfig = (collectionName) => ({
  url: process.env.QDRANT_URL || "http://localhost:6333",
  apiKey: process.env.QDRANT_API_KEY || undefined,
  https: {
    rejectUnauthorized: false,
  },
  checkCompatibility: false,
  collectionName: collectionName || "default_collection",
});

const buildEmbeddings = () =>
  new GoogleGenerativeAIEmbeddings({
    model: "gemini-embedding-001",
    apiKey: process.env.GEMINI_API_KEY,
  });

export const embedAndStoreChunks = async (rawText, docName, collName) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });

  const chunks = await splitter.splitText(rawText);
  const metadatas = chunks.map((_, i) => ({ doc: docName, index: i }));

  await QdrantVectorStore.fromTexts(
    chunks,
    metadatas,
    buildEmbeddings(),
    qdrantConfig(collName)
  );
};

export const getAnswerFromChunks = async (question, collectionName) => {
  if (!collectionName) {
    throw new Error("collectionName (docId) is required.");
  }

  const vectorStore = await QdrantVectorStore.fromExistingCollection(
    buildEmbeddings(),
    qdrantConfig(collectionName)
  );

  const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    apiKey: process.env.GEMINI_API_KEY,
  });

  const prompt = ChatPromptTemplate.fromTemplate(
    `Hey! I've gone through the following documents to help you out:

    {context}

    So, based on all that, heres my answer to your question:
    {input}`
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
