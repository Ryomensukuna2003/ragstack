import { QdrantVectorStore } from "@langchain/qdrant";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OllamaEmbeddings } from "@langchain/ollama";
import { ChatOllama } from "@langchain/ollama";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { ChatPromptTemplate } from "@langchain/core/prompts";

let vectorStore;

export const embedAndStoreChunks = async (rawText, docName) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });

  const chunks = await splitter.splitText(rawText);
  const metadatas = chunks.map((_, i) => ({ doc: docName, index: i }));

  const embeddings = new OllamaEmbeddings({ model: "nomic-embed-text" });

  vectorStore = await QdrantVectorStore.fromTexts(
    chunks,
    metadatas,
    embeddings,
    {
      url: "http://localhost:6333",
      collectionName: "smart-docs",
    }
  );
};
export const getAnswerFromChunks = async (question) => {
  if (!vectorStore) {
  throw new Error("Vector store not initialized. Upload a document first.");
}

  const model = new ChatOllama({ model: "mistral" });

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
