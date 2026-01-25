import express from 'express';
import { createServer } from 'http';
import searchRoutes from './search/search.routes';
import profileRoutes from './profiles/profile.routes';
import internalRoutes from './internal/internal.routes';
import { authenticate } from './shared/middleware/auth.middleware';

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Global request logger
app.use((req, res, next) => {
  console.log('🌐 [GLOBAL] Incoming request:', req.method, req.path);
  next();
});

// Public routes (with auth middleware)
app.use('/api/search', authenticate, searchRoutes);
app.use('/api/profiles', authenticate, profileRoutes);

// Internal routes (protected by internalAuth)
app.use('/api/internal', internalRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

const server = createServer(app);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Afrolinked backend running on port ${PORT}`);
});

export default server;
