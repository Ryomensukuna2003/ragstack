import express from 'express';
import multer from 'multer';
import { uploadAndProcessDoc, askQuestion } from '../controllers/docController.js';
import { resetEmbeddings } from '../controllers/docController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), uploadAndProcessDoc); // Upload Endpoint
router.post('/ask', askQuestion);                                   // Ask Question Endpoint
router.delete('/reset', resetEmbeddings);                           // Reset Embeddings Endpoint   

export default router;