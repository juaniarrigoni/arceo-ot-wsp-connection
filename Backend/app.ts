import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { router } from './routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);

// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', project: 'ot-wsp' });
});

// Error handler — siempre ÚLTIMO
app.use(errorHandler);

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
    console.log(`[OT-WSP] Server corriendo en puerto ${PORT}`);
});
