import { supabase } from '../config/supabase.js';

export const getServices = async (req, res) => {
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
};
