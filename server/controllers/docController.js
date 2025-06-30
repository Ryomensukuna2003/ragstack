import { parseDoc } from "../services/parseService.js";
import { resetVectorStore } from "../services/resetService.js";
import {
  embedAndStoreChunks,
  getAnswerFromChunks,
} from "../services/ragService.js";
import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";


// Controller to handle document upload and processing
export const uploadAndProcessDoc = async (req, res) => {
  const text = await parseDoc(req.file);
  let collectionName = req.file.originalname.replace(/\.[^/.]+$/, "") + Date.now();
  console.log("collectionName --> " + collectionName);
  await embedAndStoreChunks(text, req.file.originalname, collectionName);
  res.status(200).json({ status: "uploaded and embedded", embeddingName: collectionName });
};

// Ask a question based on the uploaded document
export const askQuestion = async (req, res) => {
  try {
    const { question, docId } = req.body;
    const answer = await getAnswerFromChunks(question, docId);
    if (!answer) {
      return res
        .status(404)
        .json({ error: "No answer found for the question" });
    }
    res.json({ answer });
  } catch (error) {
    console.error("Error in askQuestion:", error);
    res.status(500).json({ error: "Failed to process question" });
  }
};

// Reset embeddings for a specific document
export const resetEmbeddings = async (req, res) => {
  try {
    const { collectionName } = req.body;
    if (!collectionName) {
      return res.status(400).json({ error: "collectionName required" });
    }
    await resetVectorStore(collectionName);
    res.json({ status: "collection deleted" });
  } catch (err) {
    console.error("Error in resetEmbeddings:", err);
    res.status(500).json({ error: "Failed to reset vector store" });
  }
};

export const extractTranscript = async (req, res) => {
  try {
    const URL = req.body.URL;
    console.log("Url received:", URL);
    const loader = YoutubeLoader.createFromUrl(URL, {
      language: "en",
      addVideoInfo: true,
    });
    const docs = await loader.load();
    if (!docs || docs.length === 0) {
      return res.status(404).json({ error: "No transcript found for the video" });
    }
    const rawText = docs?.map((doc) => doc.pageContent).join("\n");
    let collectionName = "yt-transcript" + Date.now();
    const result = await embedAndStoreChunks(rawText, "youtube-transcript", collectionName);
    res.status(200).json({ status: "Transcript extracted and embedded", rawText, embeddingName: collectionName });
  } catch (error) {
    console.error("Failed to fetch transcript:", error.message);
    res.status(500).json({ error: "Failed to fetch transcript from YouTube", error: error.message });
  }
};

