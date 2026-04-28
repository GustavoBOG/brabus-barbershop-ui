import { useState, useEffect } from 'react';
import { LuCalendar, LuTrendingUp, LuUsers, LuWallet, LuChevronRight, LuScissors, LuSearch, LuLoader, LuFilter } from 'react-icons/lu';
import { historyApi } from '../../services/api';
import { format, startOfDay, startOfWeek, startOfMonth, startOfYear, endOfDay } from 'date-fns';
import { es } from 'date-fns/locale';

export default function History({ user }) {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShift, setSelectedShift] = useState(null);
  const [activeFilter, setActiveFilter] = useState('week');
  const [dateRange, setDateRange] = useState({
    from: format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd'),
    to: format(new Date(), 'yyyy-MM-dd')
  });

  const filters = [
    { id: 'today', label: 'Hoy', getRange: () => ({ 
      from: format(new Date(), 'yyyy-MM-dd'), 
      to: format(new Date(), 'yyyy-MM-dd') 
    })},
    { id: 'week', label: 'Esta Semana', getRange: () => ({ 
      from: format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd'), 
      to: format(new Date(), 'yyyy-MM-dd') 
    })},
    { id: 'month', label: 'Este Mes', getRange: () => ({ 
      from: format(startOfMonth(new Date()), 'yyyy-MM-dd'), 
      to: format(new Date(), 'yyyy-MM-dd') 
    })},
    { id: 'year', label: 'Este Año', getRange: () => ({ 
      from: format(startOfYear(new Date()), 'yyyy-MM-dd'), 
      to: format(new Date(), 'yyyy-MM-dd') 
    })},
  ];

  const handleFilterChange = (filter) => {
    setActiveFilter(filter.id);
    setDateRange(filter.getRange());
  };

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await historyApi.getShifts(user.id, dateRange.from, dateRange.to);
      setShifts(data);
      if (data.length > 0) {
        setSelectedShift(data[0]);
      } else {
        setSelectedShift(null);
      }
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [dateRange]);

  const formatDate = (dateString) => {
    return format(new Date(dateString), "eeee, d 'de' MMMM", { locale: es });
  };

  const formatTime = (dateString) => {
    return format(new Date(dateString), 'HH:mm');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full animate-in fade-in duration-500">
      {/* Sidebar: List of Shifts */}
      <div className="w-full lg:w-96 flex flex-col gap-4">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500">
              <LuFilter size={20} />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Historial</h2>
              <p className="text-white/40 text-xs uppercase tracking-wider">Filtra tu actividad</p>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => handleFilterChange(f)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                  activeFilter === f.id
                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'
                    : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-white/30 uppercase font-bold ml-1">Desde</label>
                <input 
                  type="date" 
                  value={dateRange.from}
                  onChange={(e) => {
                    setDateRange(prev => ({ ...prev, from: e.target.value }));
                    setActiveFilter('custom');
                  }}
                  className="bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500/50 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-white/30 uppercase font-bold ml-1">Hasta</label>
                <input 
                  type="date" 
                  value={dateRange.to}
                  onChange={(e) => {
                    setDateRange(prev => ({ ...prev, to: e.target.value }));
                    setActiveFilter('custom');
                  }}
                  className="bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500/50 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-320px)] pr-2 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-white/20">
              <LuLoader className="animate-spin mb-4" size={32} />
              <p className="text-sm font-medium">Cargando historial...</p>
            </div>
          ) : shifts.length === 0 ? (
            <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-8 text-center">
              <p className="text-white/30 text-sm">No hay turnos en este periodo</p>
            </div>
          ) : (
            shifts.map((shift) => (
              <button
                key={shift.id}
                onClick={() => setSelectedShift(shift)}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 group ${
                  selectedShift?.id === shift.id
                    ? 'bg-amber-500 border-amber-400 shadow-lg shadow-amber-500/20'
                    : 'bg-slate-900/50 border-white/5 hover:border-white/20 hover:bg-slate-800/50'
                }`}
              >
                <div className={`p-3 rounded-xl transition-colors ${
                  selectedShift?.id === shift.id ? 'bg-white/20' : 'bg-white/5'
                }`}>
                  <LuCalendar className={selectedShift?.id === shift.id ? 'text-white' : 'text-amber-500'} size={18} />
                </div>
                <div className="flex-1 text-left">
                  <p className={`text-xs font-bold uppercase tracking-tight ${
                    selectedShift?.id === shift.id ? 'text-white' : 'text-white/40'
                  }`}>
                    {formatDate(shift.start_time)}
                  </p>
                  <p className={`text-sm font-bold ${
                    selectedShift?.id === shift.id ? 'text-white' : 'text-white'
                  }`}>
                    {formatTime(shift.start_time)} - {shift.end_time ? formatTime(shift.end_time) : 'En curso'}
                  </p>
                </div>
                <LuChevronRight className={`transition-transform group-hover:translate-x-1 ${
                  selectedShift?.id === shift.id ? 'text-white' : 'text-white/20'
                }`} size={18} />
              </button>
            ))
          )}
        </div>
      </div>
      {/* Main Content: Shift Detail */}
      <div className="flex-1">
        {selectedShift ? (
          <div className="flex flex-col gap-6 animate-in slide-in-from-right-8 duration-500">
            {/* Header Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
                <span className="text-[9px] text-white/30 font-bold uppercase tracking-widest block mb-1">Clientes</span>
                <p className="text-xl font-black text-white">{selectedShift.stats?.totalClients || 0}</p>
              </div>

              <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
                <span className="text-[9px] text-white/30 font-bold uppercase tracking-widest block mb-1">Total Turno</span>
                <p className="text-xl font-black text-white">{selectedShift.stats?.totalRevenue?.toFixed(2) || '0.00'}€</p>
              </div>

              <div className="bg-amber-500 rounded-2xl p-4 shadow-lg shadow-amber-500/10">
                <span className="text-[9px] text-white/60 font-bold uppercase tracking-widest block mb-1">Tu Comisión</span>
                <p className="text-xl font-black text-white">{selectedShift.stats?.commission?.toFixed(2) || '0.00'}€</p>
              </div>

              <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
                <span className="text-[9px] text-white/30 font-bold uppercase tracking-widest block mb-1">Efectivo</span>
                <p className="text-xl font-black text-emerald-500">{selectedShift.stats?.byPayment?.Efectivo?.toFixed(2) || '0.00'}€</p>
              </div>
            </div>

            {/* List of Services */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
              <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Detalle del Turno</h3>
                <span className="text-[10px] text-white/30 font-medium">
                  {formatDate(selectedShift.start_time)}
                </span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left bg-black/20">
                      <th className="px-6 py-3 text-[9px] text-white/20 font-bold uppercase tracking-widest">Hora</th>
                      <th className="px-6 py-3 text-[9px] text-white/20 font-bold uppercase tracking-widest">Servicio / Cliente</th>
                      <th className="px-6 py-3 text-[9px] text-white/20 font-bold uppercase tracking-widest">Pago</th>
                      <th className="px-6 py-3 text-[9px] text-white/20 font-bold uppercase tracking-widest text-right">Monto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {(() => {
                      const groupedRecords = [];
                      selectedShift.work_records?.forEach(record => {
                        const last = groupedRecords[groupedRecords.length - 1];
                        // Agrupar si tienen el mismo client_name y fueron creados con menos de 5s de diferencia
                        if (last && last.client_name === record.client_name && 
                            Math.abs(new Date(last.created_at) - new Date(record.created_at)) < 5000) {
                          // Es parte del mismo combo, ya está incluido en el client_name
                        } else {
                          groupedRecords.push(record);
                        }
                      });

                      return groupedRecords.map((record) => (
                        <tr key={record.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4">
                            <span className="text-[10px] font-medium text-white/40">{formatTime(record.created_at)}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1.5">
                              {(record.client_name || '').split(' + ').map((name, i) => (
                                <div key={i} className="flex items-start gap-2">
                                  <span className="text-white/30 mt-1 shrink-0">•</span>
                                  <span className="text-sm font-bold text-white/90 leading-tight">
                                    {name}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              record.payment_method === 'Efectivo' ? 'bg-emerald-500/10 text-emerald-500' :
                              record.payment_method === 'Tarjeta' ? 'bg-blue-500/10 text-blue-500' :
                              'bg-amber-500/10 text-amber-500'
                            }`}>
                              {record.payment_method}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-sm font-black text-white">
                              {(() => {
                                // Sumar el total de todos los registros que pertenecen a este mismo combo
                                const groupTotal = selectedShift.work_records
                                  .filter(r => r.client_name === record.client_name && Math.abs(new Date(r.created_at) - new Date(record.created_at)) < 5000)
                                  .reduce((sum, r) => sum + parseFloat(r.total_price), 0);
                                return groupTotal.toFixed(2);
                              })()}€
                            </span>
                          </td>
                        </tr>
                      ));
                    })()}
                    {(!selectedShift.work_records || selectedShift.work_records.length === 0) && (
                      <tr>
                        <td colSpan="4" className="px-6 py-12 text-center text-white/20 text-sm italic">
                          No hay servicios registrados en este turno.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-slate-900/20 border border-dashed border-white/10 rounded-3xl">
            <div className="p-6 bg-white/5 rounded-full mb-6 text-white/10">
              <LuSearch size={48} />
            </div>
            <h3 className="text-white font-bold text-xl mb-2">Selecciona un turno</h3>
            <p className="text-white/40 max-w-sm mx-auto text-sm">
              Elige un turno de la lista para ver el resumen de servicios e ingresos generados.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
