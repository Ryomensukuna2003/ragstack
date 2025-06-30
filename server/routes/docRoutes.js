import express from 'express';
import multer from 'multer';
import { uploadAndProcessDoc, askQuestion, resetEmbeddings,extractTranscript } from '../controllers/docController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), uploadAndProcessDoc); // Upload Endpoint
router.post('/ask', askQuestion);                                   // Ask Question Endpoint
router.delete('/reset', resetEmbeddings);                           // Reset Embeddings Endpoint   
router.post('/yt-transcript',extractTranscript)                     // Extract Transcript from YouTube Endpoint

export default router;