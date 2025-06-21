import express from 'express';
import docRoutes from './routes/docRoutes.js';
import cors from 'cors';
const app = express();
app.use(cors());


app.use(express.json());
app.use('/api', docRoutes);

const PORT = 3001;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
