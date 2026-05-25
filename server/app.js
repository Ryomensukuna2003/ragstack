import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { QdrantClient } from '@qdrant/js-client-rest';
import docRoutes from './routes/docRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
  checkCompatibility: false,
});

app.get('/healthz', async (req, res) => {
  try {
    await qdrant.getCollections();
    res.status(200).json({ ok: true, qdrant: 'reachable' });
  } catch (err) {
    res.status(200).json({ ok: true, qdrant: 'unreachable', error: err.message });
  }
});

app.use('/api', docRoutes);

const PORT = Number(process.env.PORT) || 3001;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
