import { supabase } from '../config/supabase.js';

/**
 * Obtiene todos los barberos con sus estadísticas agregadas
 */
export const getAllStaff = async (req, res) => {
  try {
    const { from, to } = req.query;
    // Default: última semana
    const startDate = from || new Date(new Date().setDate(new Date().getDate() - 7)).toISOString();
    const endDate = to || new Date().toISOString();

    // 1. Obtener perfiles de barberos activos
    const { data: profiles, error: pError } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, role, commission_rate, is_active')
      .eq('is_active', true)
      .eq('role', 'barber');

    if (pError) throw pError;

    // 2. Obtener turnos y registros en el rango
    const { data: shifts, error: sError } = await supabase
      .from('shifts')
      .select(`
        barber_id,
        work_records (total_price)
      `)
      .gte('start_time', startDate)
      .lte('start_time', endDate);

    if (sError) throw sError;

    // 3. Procesar estadísticas
    const stats = profiles.map(barber => {
      const barberShifts = shifts.filter(s => s.barber_id === barber.id);
      const allRecords = barberShifts.flatMap(s => s.work_records || []);
      
      const totalGenerated = allRecords.reduce((sum, rec) => sum + parseFloat(rec.total_price || 0), 0);
      const commissionRate = parseFloat(barber.commission_rate) || 0.50;

      return {
        ...barber,
        total_generated: totalGenerated,
        total_clients: allRecords.length,
        total_commission: totalGenerated * commissionRate
      };
    });

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtiene el detalle de un barbero con estadísticas
 */
export const getBarberById = async (req, res) => {
  try {
    const { id } = req.params;
    const { from, to } = req.query;
    const startDate = from || new Date(new Date().setDate(new Date().getDate() - 7)).toISOString();
    const endDate = to || new Date().toISOString();

    const { data: profile, error: pError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (pError) throw pError;

    const { data: shifts, error: sError } = await supabase
      .from('shifts')
      .select('work_records (total_price)')
      .eq('barber_id', id)
      .gte('start_time', startDate)
      .lte('start_time', endDate);

    if (sError) throw sError;

    const allRecords = shifts.flatMap(s => s.work_records || []);
    const totalGenerated = allRecords.reduce((sum, rec) => sum + parseFloat(rec.total_price || 0), 0);

    res.json({
      ...profile,
      total_generated: totalGenerated,
      total_clients: allRecords.length,
      total_commission: totalGenerated * (parseFloat(profile.commission_rate) || 0.5)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Actualiza el perfil de un barbero
 */
export const updateBarber = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtiene horarios
 */
export const getSchedules = async (req, res) => {
  try {
    const { barberId } = req.params;
    const { data, error } = await supabase
      .from('staff_schedules')
      .select('*')
      .eq('barber_id', barberId)
      .order('day_of_week', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Sincroniza horarios
 */
export const manageSchedules = async (req, res) => {
  try {
    const { barberId } = req.params;
    const { schedules } = req.body;

    // Eliminar actuales
    await supabase.from('staff_schedules').delete().eq('barber_id', barberId);

    // Insertar nuevos
    if (schedules && schedules.length > 0) {
      const { data, error } = await supabase
        .from('staff_schedules')
        .insert(schedules.map(s => ({ ...s, barber_id: barberId })))
        .select();

      if (error) throw error;
      return res.json(data);
    }

    res.json([]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
