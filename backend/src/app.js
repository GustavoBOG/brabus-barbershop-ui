import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes/index.js';

const app = express();

// ─── Middlewares ─────────────────────────────────────────
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// ─── Health Check ────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ 
    message: 'Brabus Barbershop API is running 🚀',
    version: '1.0.0',
    status: 'online'
  });
});

// ─── Routes ──────────────────────────────────────────────
app.use('/api', routes);

// ─── Error Handling ──────────────────────────────────────
app.use((req, res, next) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

export default app;
