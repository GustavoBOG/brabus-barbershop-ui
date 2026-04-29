import { useState, useEffect, useMemo } from 'react';
import { LuCalendar, LuTrendingUp, LuChevronRight, LuChevronLeft, LuScissors, LuSearch, LuLoader, LuFilter } from 'react-icons/lu';
import { historyApi } from '../../services/api';
import { format, startOfDay, startOfWeek, endOfWeek, eachDayOfInterval, addDays, subDays, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';

export default function History({ user }) {
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShift, setSelectedShift] = useState(null);

  const weekDays = useMemo(() => {
    const start = startOfWeek(viewDate, { weekStartsOn: 1 });
    const end = endOfWeek(viewDate, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [viewDate]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const from = format(weekDays[0], 'yyyy-MM-dd');
      const to = format(weekDays[6], 'yyyy-MM-dd');
      const data = await historyApi.getShifts(user.id, from, to);
      setShifts(data);
      
      const todayInShifts = data.find(s => isSameDay(new Date(s.start_time), selectedDate));
      setSelectedShift(todayInShifts || null);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [viewDate]);

  useEffect(() => {
    const shiftForSelectedDate = shifts.find(s => isSameDay(new Date(s.start_time), selectedDate));
    setSelectedShift(shiftForSelectedDate || null);
  }, [selectedDate, shifts]);

  const handlePrevWeek = () => setViewDate(prev => subDays(prev, 7));
  const handleNextWeek = () => setViewDate(prev => addDays(prev, 7));

  const formatDate = (dateString) => {
    return format(new Date(dateString), "eeee, d 'de' MMMM", { locale: es });
  };

  const formatTime = (dateString) => {
    return format(new Date(dateString), 'HH:mm');
  };

  return (
    <div className="flex flex-col gap-6 h-full animate-in fade-in duration-500">
      {/* Top Filter & Horizontal Shift Selector */}
      <div className="flex flex-col gap-6">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500">
                <LuCalendar size={20} />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">Historial Semanal</h2>
                <p className="text-white/40 text-[10px] uppercase tracking-wider font-black">
                  {format(weekDays[0], "d 'de' MMMM", { locale: es })} - {format(weekDays[6], "d 'de' MMMM", { locale: es })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-white font-bold text-sm uppercase tracking-tight">{format(viewDate, 'MMMM yyyy', { locale: es })}</p>
                <p className="text-white/30 text-[10px] font-black uppercase">Semana de trabajo</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevWeek}
                  className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl border border-white/5 transition-all"
                >
                  <LuChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setViewDate(new Date())}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase rounded-2xl border border-white/5 transition-all"
                >
                  Hoy
                </button>
                <button
                  onClick={handleNextWeek}
                  className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl border border-white/5 transition-all"
                >
                  <LuChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Horizontal Week Day Selector (Sub-navbar) */}
        <div className="relative">
          <div className="flex overflow-x-auto gap-3 pb-4 no-scrollbar mask-fade-edges scroll-smooth px-2">
            <AnimatePresence mode="popLayout">
              {weekDays.map((day) => {
                const dayShifts = shifts.filter(s => isSameDay(new Date(s.start_time), day));
                const isSelected = isSameDay(day, selectedDate);
                const hasActivity = dayShifts.length > 0;

                return (
                  <motion.button
                    key={day.toISOString()}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => setSelectedDate(day)}
                    className={`flex-shrink-0 flex flex-col items-center justify-center p-4 min-w-[120px] rounded-3xl border transition-all duration-500 group relative overflow-hidden ${
                      isSelected
                        ? 'bg-amber-500 border-amber-400 shadow-xl shadow-amber-500/20 scale-[1.05] z-10'
                        : 'bg-slate-900/50 border-white/5 hover:border-white/20 hover:bg-slate-800/50'
                    }`}
                  >
                    <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${
                      isSelected ? 'text-white/80' : 'text-white/30 group-hover:text-white/50'
                    }`}>
                      {format(day, 'eee', { locale: es })}
                    </p>
                    <p className={`text-2xl font-black ${
                      isSelected ? 'text-white' : 'text-white/90'
                    }`}>
                      {format(day, 'd')}
                    </p>
                    
                    {hasActivity && !isSelected && (
                      <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    )}
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Main Content: Day Detail */}
      <div className="flex-1">
        <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-8 duration-500">
          {/* Header Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-5 group hover:border-amber-500/30 transition-colors">
              <span className="text-[10px] text-white/30 font-black uppercase tracking-widest block mb-2">Clientes</span>
              <p className="text-2xl font-black text-white">{selectedShift?.stats?.totalClients || 0}</p>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-5 group hover:border-amber-500/30 transition-colors">
              <span className="text-[10px] text-white/30 font-black uppercase tracking-widest block mb-2">Total Turno</span>
              <p className="text-2xl font-black text-white">{selectedShift?.stats?.totalRevenue?.toFixed(2) || '0.00'}€</p>
            </div>

            <div className="bg-amber-500 rounded-3xl p-5 shadow-lg shadow-amber-500/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <LuTrendingUp size={48} />
              </div>
              <span className="text-[10px] text-white/60 font-black uppercase tracking-widest block mb-2 relative z-10">Tu Comisión</span>
              <p className="text-2xl font-black text-white relative z-10">{selectedShift?.stats?.commission?.toFixed(2) || '0.00'}€</p>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-5 group hover:border-emerald-500/30 transition-colors">
              <span className="text-[10px] text-white/30 font-black uppercase tracking-widest block mb-2">Efectivo</span>
              <p className="text-2xl font-black text-emerald-500">{selectedShift?.stats?.byPayment?.Efectivo?.toFixed(2) || '0.00'}€</p>
            </div>
          </div>

          {/* List of Services */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${selectedShift ? 'bg-amber-500 animate-pulse' : 'bg-white/10'}`} />
                <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Detalle de Jornada</h3>
              </div>
              <div className="px-4 py-1.5 bg-white/5 rounded-full border border-white/10">
                <span className="text-[10px] text-white/60 font-bold uppercase tracking-wider">
                  {format(selectedDate, "eeee, d 'de' MMMM", { locale: es })}
                </span>
              </div>
            </div>
            
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full">
                <thead>
                  <tr className="text-left bg-black/40">
                    <th className="px-8 py-5 text-[10px] text-white/40 font-black uppercase tracking-widest">Hora</th>
                    <th className="px-8 py-5 text-[10px] text-white/40 font-black uppercase tracking-widest">Servicio</th>
                    <th className="px-8 py-5 text-[10px] text-white/40 font-black uppercase tracking-widest">Método de Pago</th>
                    <th className="px-8 py-5 text-[10px] text-white/40 font-black uppercase tracking-widest text-right">Monto Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {selectedShift ? (
                    (() => {
                      const groupedRecords = [];
                      selectedShift.work_records?.forEach(record => {
                        const last = groupedRecords[groupedRecords.length - 1];
                        if (last && last.client_name === record.client_name && 
                            Math.abs(new Date(last.created_at) - new Date(record.created_at)) < 5000) {
                        } else {
                          groupedRecords.push(record);
                        }
                      });

                      return groupedRecords.map((record) => (
                        <tr key={record.id} className="hover:bg-white/[0.03] transition-colors group">
                          <td className="px-8 py-6">
                            <span className="text-xs font-bold text-white/40 group-hover:text-white/60 transition-colors">
                              {formatTime(record.created_at)}
                            </span>
                          </td>
                          <td className="px-8 py-6 min-w-[200px]">
                            <div className="flex flex-col gap-1.5">
                              {(record.client_name || '').split(' + ').map((name, i) => (
                                <div key={i} className="flex items-center gap-2">
                                  <LuScissors className="text-amber-500/50" size={12} />
                                  <span className="text-sm font-bold text-white/90">
                                    {name}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex">
                              <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${
                                record.payment_method === 'Efectivo' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                                record.payment_method === 'Tarjeta' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                                'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                              }`}>
                                {record.payment_method}
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <span className="text-lg font-black text-white group-hover:text-amber-500 transition-colors">
                              {(() => {
                                const groupTotal = selectedShift.work_records
                                  .filter(r => r.client_name === record.client_name && Math.abs(new Date(r.created_at) - new Date(record.created_at)) < 5000)
                                  .reduce((sum, r) => sum + parseFloat(r.total_price), 0);
                                return groupTotal.toFixed(2);
                              })()}€
                            </span>
                          </td>
                        </tr>
                      ));
                    })()
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center gap-3 opacity-20">
                          <LuScissors size={40} />
                          <p className="text-sm font-bold uppercase tracking-widest italic">
                            No hay actividad registrada para este día.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
