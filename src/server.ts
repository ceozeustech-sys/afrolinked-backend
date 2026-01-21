import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import profileRoutes from './profiles/profile.routes';
import internalRoutes from './internal/internal.routes';
import searchRoutes from './search/search.routes';
import { authenticate } from './shared/middleware/auth.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/profiles', authenticate, profileRoutes);
app.use('/api/internal', internalRoutes);
app.use('/api/search', authenticate, searchRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Afrolinked Backend' });
});

app.listen(PORT, () => {
  console.log(`✅ Afrolinked backend running on http://localhost:${PORT}`);
});
