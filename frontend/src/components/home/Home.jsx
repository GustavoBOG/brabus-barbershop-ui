import { useState, useEffect } from 'react';
import { LuLoader } from 'react-icons/lu';
import ServicesModal from '../modals/ServicesModal';
import EndShiftModal from '../modals/EndShiftModal';
import { shiftsApi, workRecordsApi } from '../../services/api';

export default function Home({ user }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEndShiftModalOpen, setIsEndShiftModalOpen] = useState(false);
  const [servicesList, setServicesList] = useState([]);
  const [shiftStatus, setShiftStatus] = useState('inactivo'); // inactivo, activo, pausa
  const [currentShift, setCurrentShift] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Cargar turno activo al montar el componente
  useEffect(() => {
    async function loadActiveShift() {
      try {
        setInitialLoading(true);
        const shift = await shiftsApi.getActive(user.id);
        if (shift) {
          setCurrentShift(shift);
          setShiftStatus(shift.status === 'active' ? 'activo' : 'pausa');
          // Cargar los registros de ese turno
          const records = await shiftsApi.getRecords(shift.id);
          const formatted = records.map(r => ({
            id: r.id,
            servicesNames: r.client_name || r.services?.name || 'Servicio',
            total: parseFloat(r.total_price),
            timeIn: new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
            timeOut: new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
            paymentMethod: r.payment_method,
            category: r.services?.category || 'other',
          }));
          setServicesList(formatted);
        }
      } catch (error) {
        console.error('Error al cargar turno activo:', error);
      } finally {
        setInitialLoading(false);
      }
    }
    if (user?.id) {
      loadActiveShift();
    }
  }, [user?.id]);

  // ─── Handlers de Turno ─────────────────────────────────
  const handleStartShift = async () => {
    try {
      setLoading(true);
      const shift = await shiftsApi.start(user.id);
      setCurrentShift(shift);
      setShiftStatus('activo');
      setServicesList([]);
    } catch (error) {
      console.error('Error al iniciar turno:', error);
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePauseShift = async () => {
    try {
      if (currentShift) {
        await shiftsApi.updateStatus(currentShift.id, 'paused');
      }
      setShiftStatus('pausa');
    } catch (error) {
      console.error('Error al pausar turno:', error);
    }
  };

  const handleResumeShift = async () => {
    try {
      if (currentShift) {
        await shiftsApi.updateStatus(currentShift.id, 'active');
      }
      setShiftStatus('activo');
    } catch (error) {
      console.error('Error al reanudar turno:', error);
    }
  };

  const handleEndShift = async () => {
    try {
      if (currentShift) {
        await shiftsApi.updateStatus(currentShift.id, 'finished');
      }
      setShiftStatus('inactivo');
      setCurrentShift(null);
      setServicesList([]);
    } catch (error) {
      console.error('Error al cerrar turno:', error);
      setShiftStatus('inactivo');
      setCurrentShift(null);
    }
  };

  // ─── Handler de Servicio ───────────────────────────────
  const handleSaveService = async (newService) => {
    if (!currentShift) {
      alert('No hay turno activo para registrar servicios.');
      return;
    }

    try {
      // Guardar cada servicio seleccionado como work_record en la BD
      for (const item of newService.selectedItems) {
        await workRecordsApi.create({
          shift_id: currentShift.id,
          service_id: item.id,
          client_name: newService.servicesNames,
          payment_method: newService.paymentMethod,
          total_price: parseFloat(item.price),
        });
      }

      // Actualizar UI con los datos guardados
      setServicesList((prev) => [{
        servicesNames: newService.servicesNames,
        total: newService.total,
        timeIn: newService.timeIn,
        timeOut: newService.timeOut,
        paymentMethod: newService.paymentMethod,
        category: newService.selectedItems?.[0]?.category || 'other',
      }, ...prev]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error al guardar servicio:', error);
      alert('Error al guardar: ' + error.message);
    }
  };

  const totalTurno = servicesList.reduce((acc, curr) => acc + curr.total, 0);

  // Cálculos para la gráfica
  const serviceCounts = { corte: 0, barba: 0, otros: 0 };

  servicesList.forEach(svc => {
    const name = svc.servicesNames || '';
    const cat = svc.category || '';
    if (cat === 'cut' || name.includes('Corte')) serviceCounts.corte++;
    if (cat === 'beard' || name.includes('Barba')) serviceCounts.barba++;
    if (cat === 'other' || name.includes('Cejas') || name.includes('Facial') || name.includes('Tinte')) serviceCounts.otros++;
  });

  const totalItems = serviceCounts.corte + serviceCounts.barba + serviceCounts.otros;
  const getPercent = (count) => totalItems === 0 ? 0 : Math.round((count / totalItems) * 100);
  const pcCorte = getPercent(serviceCounts.corte);
  const pcBarba = getPercent(serviceCounts.barba);
  const pcOtros = getPercent(serviceCounts.otros);

  let conicGradient = `conic-gradient(#2A2A2A 0% 100%)`;
  if (totalItems > 0) {
    conicGradient = `conic-gradient(
      #D4AF37 0% ${pcCorte}%, 
      #CD7F32 ${pcCorte}% ${pcCorte + pcBarba}%, 
      #2A2A2A ${pcCorte + pcBarba}% 100%
    )`;
  }

  if (initialLoading) {
    return (
      <div className="w-full max-w-[1400px] mx-auto py-20 flex items-center justify-center">
        <LuLoader size={32} className="text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto py-8 px-6 flex flex-col gap-6">
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Columna Izquierda (Ancha) - Panel del Trabajador */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          
          {/* Card Superior: Perfil del Trabajador, Stats y Botón */}
          <div className="bg-[#131313] rounded-[2rem] p-8 flex flex-col border border-white/5 shadow-xl gap-6">
            
            {/* Top Row: Info & Stats */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Perfil */}
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/5 border border-white/10 grayscale-[30%] contrast-125">
                    <img src={user?.avatar_url || "https://i.pravatar.cc/150?u=default"} alt={user?.full_name} className="w-full h-full object-cover" />
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-[3px] border-[#131313] rounded-full transition-colors ${
                    shiftStatus === 'activo' ? 'bg-green-500' : 
                    shiftStatus === 'pausa' ? 'bg-secondary' : 'bg-white/20'
                  }`}></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-white text-2xl font-extrabold tracking-wide">{user?.full_name || 'Barbero'}</span>
                  <span className="text-white/40 text-[10px] tracking-widest uppercase font-extrabold mt-0.5">
                    {user?.role === 'admin' ? 'Administrador' : 'Master Barber'}
                  </span>
                </div>
              </div>

              <div className="hidden md:block w-px h-12 bg-white/5"></div>

              {/* Contadores */}
              <div className="flex items-center gap-8 bg-[#1A1A1A] p-4 px-6 rounded-2xl border border-white/5">
                <div className="flex flex-col items-center">
                  <span className="text-white/40 text-[10px] tracking-widest uppercase font-extrabold mb-1">Total Clientes</span>
                  <span className="text-white font-black text-2xl">{servicesList.length}</span>
                </div>
                <div className="w-px h-10 bg-white/10"></div>
                <div className="flex flex-col items-center">
                  <span className="text-white/40 text-[10px] tracking-widest uppercase font-extrabold mb-1">Generado</span>
                  <span className="text-primary font-black text-2xl">{totalTurno.toFixed(2)}€</span>
                </div>
              </div>
            </div>

            {/* Bottom Row: Control de Turno & Action */}
            <div className="w-full flex flex-col md:flex-row items-center justify-between border-t border-white/5 pt-6 gap-6">
              
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 px-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-tertiary"></div>
                  <span className="text-white/40 font-bold text-[11px] tracking-widest uppercase">
                    {currentShift 
                      ? `Turno iniciado: ${new Date(currentShift.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                      : 'Sin turno activo'
                    }
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-[#1A1A1A] p-2 rounded-2xl border border-white/5">
                  <button 
                    onClick={shiftStatus === 'pausa' ? handleResumeShift : handleStartShift}
                    disabled={shiftStatus === 'activo' || loading}
                    className={`px-5 py-2.5 rounded-xl text-[10px] uppercase tracking-widest font-extrabold transition-all ${
                      shiftStatus === 'activo' 
                        ? 'bg-green-500/10 text-green-500 border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]' 
                        : 'bg-transparent text-white/40 border border-transparent hover:text-white'
                    }`}
                  >
                    {loading ? <LuLoader size={14} className="animate-spin" /> : 'Iniciar Turno'}
                  </button>
                  <button 
                    onClick={handlePauseShift}
                    disabled={shiftStatus !== 'activo'}
                    className={`px-5 py-2.5 rounded-xl text-[10px] uppercase tracking-widest font-extrabold transition-all ${
                      shiftStatus === 'pausa' 
                        ? 'bg-secondary/10 text-secondary border border-secondary/30 shadow-[0_0_15px_rgba(205,127,50,0.1)]' 
                        : 'bg-transparent text-white/40 border border-transparent hover:text-white'
                    }`}
                  >
                    Descanso
                  </button>
                  <button 
                    onClick={() => setIsEndShiftModalOpen(true)} 
                    disabled={shiftStatus === 'inactivo'}
                    className={`px-5 py-2.5 rounded-xl text-[10px] uppercase tracking-widest font-extrabold transition-all ${
                      shiftStatus === 'inactivo' 
                        ? 'bg-red-500/10 text-red-500 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]' 
                        : 'bg-transparent text-white/40 border border-transparent hover:text-white'
                    }`}
                  >
                    Cierre Turno
                  </button>
                </div>
              </div>

              <button 
                onClick={() => setIsModalOpen(true)}
                disabled={shiftStatus !== 'activo'}
                className={`rounded-2xl font-extrabold text-[12px] tracking-widest uppercase px-8 py-3.5 transition-all whitespace-nowrap ${
                  shiftStatus === 'activo' 
                    ? 'bg-primary text-[#0A0A0A] shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:scale-105' 
                    : 'bg-card text-white/20 border border-white/5 cursor-not-allowed'
                }`}
              >
                Registrar Servicio
              </button>
            </div>

          </div>

          {/* Card Inferior: Trabajos Realizados */}
          <div className="bg-[#131313] rounded-[2rem] p-8 flex flex-col border border-white/5 shadow-xl flex-1 min-h-[400px]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-white text-2xl font-extrabold">Trabajos Realizados</h2>
            </div>
            
            {servicesList.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[1.5rem] bg-white/[0.01]">
                <p className="text-white/30 text-sm font-medium tracking-wide">Aún no hay servicios registrados hoy.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {servicesList.map((svc, idx) => (
                  <div key={svc.id || idx} className="flex items-center justify-between bg-[#1C1C1C] p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-6">
                      <div className="w-1.5 h-10 bg-primary rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
                      <div className="flex flex-col gap-1">
                        <span className="text-white font-extrabold text-lg tracking-wide">{svc.servicesNames}</span>
                        <div className="flex items-center gap-3 mt-1">
                           <span className="text-white/50 text-[11px] tracking-widest font-bold bg-[#131313] px-3 py-1.5 rounded-lg border border-white/5">
                             {svc.timeIn} - {svc.timeOut}
                           </span>
                           <span className="text-tertiary text-[11px] tracking-widest font-bold bg-tertiary/10 border border-tertiary/20 px-3 py-1.5 rounded-lg uppercase">
                             {svc.paymentMethod}
                           </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-secondary font-black text-2xl leading-none">{svc.total.toFixed(2)}€</span>
                      <span className="text-white/30 text-[10px] font-bold tracking-widest uppercase mt-1">EUR</span> 
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Columna Derecha - Resumen de Servicios */}
        <div className="bg-[#131313] rounded-[2rem] p-8 flex flex-col border border-white/5 shadow-xl h-full">
          <h2 className="text-white text-2xl font-extrabold mb-12">Resumen de Servicios</h2>
          
          <div className="relative w-56 h-56 mx-auto mb-10 flex items-center justify-center">
            <div 
              className="absolute inset-0 rounded-full transition-all duration-1000 ease-out"
              style={{ background: conicGradient }}
            />
            <div className="absolute inset-[18px] rounded-full bg-[#131313] flex flex-col items-center justify-center shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)]">
              <span className="text-white font-black text-[2.75rem] leading-none mb-1">{servicesList.length}</span>
              <span className="text-white/40 text-[9px] tracking-widest uppercase font-extrabold">TRABAJOS</span>
            </div>
          </div>

          <div className="flex flex-col gap-4 mb-10 px-2 text-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                <span className="text-white/80 font-bold tracking-wide">Corte de Cabello</span>
              </div>
              <span className="text-white font-bold">{pcCorte}%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-2.5 h-2.5 rounded-full bg-secondary" />
                <span className="text-white/80 font-bold tracking-wide">Arreglo de Barba</span>
              </div>
              <span className="text-white font-bold">{pcBarba}%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-2.5 h-2.5 rounded-full bg-[#2A2A2A]" />
                <span className="text-white/80 font-bold tracking-wide">Otros (Cejas / Facial)</span>
              </div>
              <span className="text-white font-bold">{pcOtros}%</span>
            </div>
          </div>
        </div>

      </div>

      <ServicesModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveService}
      />

      <EndShiftModal
        isOpen={isEndShiftModalOpen}
        onClose={() => setIsEndShiftModalOpen(false)}
        onConfirm={handleEndShift}
        servicesList={servicesList}
        totalTurno={totalTurno}
      />
    </div>
  );
}
