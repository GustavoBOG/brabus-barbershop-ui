import { supabase } from '../config/supabase.js';

export const getRecordsByShift = async (req, res) => {
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
};

export const createWorkRecord = async (req, res) => {
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
};
