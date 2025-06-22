import { QdrantClient } from "@qdrant/js-client-rest";
import "dotenv/config";

// const qdrant = new QdrantClient({ url: 'http://localhost:6333' });
const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL || "http://localhost:6333",
  apiKey: process.env.QDRANT_API_KEY || undefined,
  https: {
    rejectUnauthorized: false,
  },
  checkCompatibility: false,
});

export const resetVectorStore = async (collectionName) => {
  try {
    console.log("Testing Qdrant connection...");
    console.log(process.env.QDRANT_URL);
    console.log(process.env.QDRANT_API_KEY);
    const exists = await qdrant.getCollections();
    const names = exists.collections.map((c) => c.name);
    if (names.includes(collectionName)) {
      await qdrant.deleteCollection(collectionName);
      console.log(`[INFO] Qdrant collection "${collectionName}" deleted.`);
    } else {
      console.log(
        `[INFO] Collection "${collectionName}" does not exist. Nothing to delete.`
      );
    }
  } catch (error) {
    console.error("Failed to delete collection:", error);
    throw error;
  }
};
