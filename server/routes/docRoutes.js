import express from 'express';
import multer from 'multer';
import { uploadAndProcessDoc, askQuestion, resetEmbeddings } from '../controllers/docController.js';

import { webCrawler } from '../controllers/webCrawler.js';
import { extractTranscript } from '../controllers/yt_Transcript.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), uploadAndProcessDoc); // Upload Endpoint
router.post('/ask', askQuestion);                                   // Ask Question Endpoint
router.post('/yt-transcript', extractTranscript)                    // Extract Transcript from YouTube Endpoint
router.post('/web-crawler', webCrawler)                             // Web Crawler Endpoint
router.delete('/reset', resetEmbeddings);                           // Reset Embeddings Endpoint   
export default router;