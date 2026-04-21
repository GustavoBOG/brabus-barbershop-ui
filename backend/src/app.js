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

// ═══════════════════════════════════════════════════════════
//  HISTORY - Historial de Turnos
// ═══════════════════════════════════════════════════════════

// GET: Historial de turnos de un barbero (filtrable por fecha)
app.get('/api/history/:barberId', async (req, res) => {
  try {
    const { barberId } = req.params;
    const { from, to } = req.query;

    let query = supabase
      .from('shifts')
      .select(`
        *,
        profiles(full_name, avatar_url),
        work_records(id, total_price, payment_method, client_name, created_at, services(name, category, price))
      `)
      .eq('barber_id', barberId)
      .order('start_time', { ascending: false });

    // Filtrar por rango de fechas si se proporcionan
    if (from) {
      query = query.gte('start_time', `${from}T00:00:00`);
    }
    if (to) {
      query = query.lte('start_time', `${to}T23:59:59`);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Calcular stats para cada turno
    const shiftsWithStats = data.map(shift => {
      const records = shift.work_records || [];
      const totalRevenue = records.reduce((sum, r) => sum + parseFloat(r.total_price), 0);
      const commission = totalRevenue * 0.5; // 50% comisión

      return {
        ...shift,
        stats: {
          totalClients: records.length,
          totalRevenue,
          commission,
          byCategory: {
            cut: records.filter(r => r.services?.category === 'cut').length,
            beard: records.filter(r => r.services?.category === 'beard').length,
            other: records.filter(r => r.services?.category === 'other').length,
          },
          byPayment: {
            Efectivo: records.filter(r => r.payment_method === 'Efectivo').reduce((s, r) => s + parseFloat(r.total_price), 0),
            Tarjeta: records.filter(r => r.payment_method === 'Tarjeta').reduce((s, r) => s + parseFloat(r.total_price), 0),
            Transferencia: records.filter(r => r.payment_method === 'Transferencia').reduce((s, r) => s + parseFloat(r.total_price), 0),
          }
        }
      };
    });

    res.json(shiftsWithStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: Resumen diario de un barbero
app.get('/api/history/:barberId/daily', async (req, res) => {
  try {
    const { barberId } = req.params;
    const { month } = req.query; // formato: YYYY-MM

    let query = supabase
      .from('shifts')
      .select(`
        id, start_time, end_time, status,
        work_records(id, total_price, services(category))
      `)
      .eq('barber_id', barberId)
      .order('start_time', { ascending: false });

    if (month) {
      const [year, m] = month.split('-');
      const startDate = `${year}-${m}-01T00:00:00`;
      const lastDay = new Date(year, m, 0).getDate();
      const endDate = `${year}-${m}-${lastDay}T23:59:59`;
      query = query.gte('start_time', startDate).lte('start_time', endDate);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Agrupar por día
    const dailyMap = {};
    data.forEach(shift => {
      const day = new Date(shift.start_time).toISOString().split('T')[0];
      if (!dailyMap[day]) {
        dailyMap[day] = { date: day, shifts: [], totalClients: 0, totalRevenue: 0, commission: 0 };
      }
      const records = shift.work_records || [];
      const revenue = records.reduce((sum, r) => sum + parseFloat(r.total_price), 0);
      dailyMap[day].shifts.push(shift.id);
      dailyMap[day].totalClients += records.length;
      dailyMap[day].totalRevenue += revenue;
      dailyMap[day].commission += revenue * 0.5;
    });

    const daily = Object.values(dailyMap).sort((a, b) => b.date.localeCompare(a.date));
    res.json(daily);
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
   GET    /api/history/:barberId
   GET    /api/history/:barberId/daily
  `);
});
