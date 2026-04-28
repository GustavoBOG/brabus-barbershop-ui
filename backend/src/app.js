import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes/index.js';

const app = express();

// ─── Middlewares ─────────────────────────────────────────
const allowedOrigins = [
  'https://brabus-barbershop.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir peticiones sin origen (como herramientas de test o móviles) 
    // o si el origen está en la lista blanca
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS no permitido para este origen'));
    }
  }
}));
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
