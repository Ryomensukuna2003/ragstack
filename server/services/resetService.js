import { QdrantClient } from "@qdrant/js-client-rest";

const qdrant = new QdrantClient({ url: 'http://localhost:6333' });

export const resetVectorStore = async (collectionName) => {
  try {
    const exists = await qdrant.getCollections();
    const names = exists.collections.map((c) => c.name);
    if (names.includes(collectionName)) {
      await qdrant.deleteCollection(collectionName);
      console.log(`[INFO] Qdrant collection "${collectionName}" deleted.`);
    } else {
      console.log(`[INFO] Collection "${collectionName}" does not exist. Nothing to delete.`);
    }
  } catch (error) {
    console.error('Failed to delete collection:', error);
    throw error;
  }
};
