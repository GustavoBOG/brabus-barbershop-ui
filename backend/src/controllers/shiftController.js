import { supabase } from '../config/supabase.js';

export const getActiveShift = async (req, res) => {
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
};

export const startShift = async (req, res) => {
  try {
    const { barber_id } = req.body;

    if (!barber_id) {
      return res.status(400).json({ error: 'Se requiere barber_id' });
    }

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
};

export const updateShiftStatus = async (req, res) => {
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
};

export const getShiftStats = async (req, res) => {
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
};
