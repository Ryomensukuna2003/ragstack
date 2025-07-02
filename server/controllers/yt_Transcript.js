
import { embedAndStoreChunks } from "../services/ragService.js";
import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";

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
        await embedAndStoreChunks(rawText, "youtube-transcript", collectionName);
        res.status(200).json({ status: "Transcript extracted and embedded", rawText, embeddingName: collectionName });
    } catch (error) {
        console.error("Failed to fetch transcript:", error.message);
        res.status(500).json({ error: "Failed to fetch transcript from YouTube", error: error.message });
    }
};

