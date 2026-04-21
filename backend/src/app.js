import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Supabase Configuration ──────────────────────────────
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey || supabaseKey === 'PONER_AQUI_TU_SERVICE_ROLE_KEY') {
  console.warn('⚠️ ADVERTENCIA: No se ha configurado la SUPABASE_SERVICE_ROLE_KEY en el archivo .env');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// ─── Middlewares ─────────────────────────────────────────
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// ─── Health Check ────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'Brabus Barbershop API is running 🚀' });
});

// ═══════════════════════════════════════════════════════════
//  AUTH - Autenticación
// ═══════════════════════════════════════════════════════════

// POST: Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Obtener el perfil del barbero
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) throw profileError;

    res.json({
      user: {
        id: data.user.id,
        email: data.user.email,
        ...profile,
      },
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      },
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// POST: Logout
app.post('/api/auth/logout', async (req, res) => {
  try {
    res.json({ message: 'Sesión cerrada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: Obtener perfil actual (por token o por ID)
app.get('/api/auth/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════
//  SERVICES - Catálogo de Servicios
// ═══════════════════════════════════════════════════════════

// GET: Obtener todos los servicios
app.get('/api/services', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('price', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════
//  SHIFTS - Gestión de Turnos
// ═══════════════════════════════════════════════════════════

// GET: Obtener el turno activo de un barbero específico
app.get('/api/shifts/active/:barberId', async (req, res) => {
  try {
    const { barberId } = req.params;
    const { data, error } = await supabase
      .from('shifts')
      .select('*')
      .eq('barber_id', barberId)
      .in('status', ['active', 'paused'])
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST: Iniciar un nuevo turno
app.post('/api/shifts/start', async (req, res) => {
  try {
    const { barber_id } = req.body;

    if (!barber_id) {
      return res.status(400).json({ error: 'Se requiere barber_id' });
    }

    // Verificar que no haya un turno activo para este barbero
    const { data: existingShift } = await supabase
      .from('shifts')
      .select('id')
      .eq('barber_id', barber_id)
      .in('status', ['active', 'paused'])
      .limit(1)
      .maybeSingle();

    if (existingShift) {
      return res.status(400).json({ error: 'Ya tienes un turno activo. Ciérralo antes de iniciar uno nuevo.' });
    }

    const { data, error } = await supabase
      .from('shifts')
      .insert({ barber_id, status: 'active', start_time: new Date().toISOString() })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH: Cambiar estado del turno (pausar / reanudar / finalizar)
app.patch('/api/shifts/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['active', 'paused', 'finished'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Estado inválido. Usa: ${validStatuses.join(', ')}` });
    }

    const updateData = { status };
    if (status === 'finished') {
      updateData.end_time = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('shifts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════
//  WORK RECORDS - Registro de Trabajos Realizados
// ═══════════════════════════════════════════════════════════

// GET: Obtener los registros de un turno específico
app.get('/api/shifts/:shiftId/records', async (req, res) => {
  try {
    const { shiftId } = req.params;
    const { data, error } = await supabase
      .from('work_records')
      .select('*, services(name, category)')
      .eq('shift_id', shiftId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST: Registrar un nuevo trabajo
app.post('/api/work-records', async (req, res) => {
  try {
    const { shift_id, service_id, client_name, payment_method, total_price } = req.body;

    if (!shift_id || !total_price) {
      return res.status(400).json({ error: 'Faltan campos obligatorios: shift_id y total_price.' });
    }

    const { data, error } = await supabase
      .from('work_records')
      .insert({ shift_id, service_id, client_name, payment_method, total_price })
      .select('*, services(name, category)')
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════
//  STATS - KPIs y Estadísticas
// ═══════════════════════════════════════════════════════════

// GET: Estadísticas de un turno
app.get('/api/shifts/:shiftId/stats', async (req, res) => {
  try {
    const { shiftId } = req.params;

    const { data: records, error } = await supabase
      .from('work_records')
      .select('total_price, services(category)')
      .eq('shift_id', shiftId);

    if (error) throw error;

    const stats = {
      totalClients: records.length,
      totalRevenue: records.reduce((sum, r) => sum + parseFloat(r.total_price), 0),
      byCategory: {
        cut: records.filter(r => r.services?.category === 'cut').length,
        beard: records.filter(r => r.services?.category === 'beard').length,
        other: records.filter(r => r.services?.category === 'other').length,
      }
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── Start Server ────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
🚀 Servidor de Brabus Barbershop iniciado
📍 Puerto: ${PORT}
🔗 URL: http://localhost:${PORT}
📦 Endpoints disponibles:
   POST   /api/auth/login
   POST   /api/auth/logout
   GET    /api/auth/profile/:userId
   GET    /api/services
   GET    /api/shifts/active/:barberId
   POST   /api/shifts/start
   PATCH  /api/shifts/:id/status
   GET    /api/shifts/:shiftId/records
   POST   /api/work-records
   GET    /api/shifts/:shiftId/stats
  `);
});
