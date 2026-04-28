import { supabase } from '../config/supabase.js';

export const getBarberHistory = async (req, res) => {
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

    if (from) {
      query = query.gte('start_time', `${from}T00:00:00`);
    }
    if (to) {
      query = query.lte('start_time', `${to}T23:59:59`);
    }

    const { data, error } = await query;
    if (error) throw error;

    const shiftsWithStats = data.map(shift => {
      const records = shift.work_records || [];
      const totalRevenue = records.reduce((sum, r) => sum + parseFloat(r.total_price), 0);
      const commission = totalRevenue * 0.5;

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
};

export const getDailyResumen = async (req, res) => {
  try {
    const { barberId } = req.params;
    const { month } = req.query;

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
};
