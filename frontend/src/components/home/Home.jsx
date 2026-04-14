import { useState } from 'react';
import ServicesModal from '../modals/ServicesModal';
import EndShiftModal from '../modals/EndShiftModal';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEndShiftModalOpen, setIsEndShiftModalOpen] = useState(false);
  const [servicesList, setServicesList] = useState([]);
  const [shiftStatus, setShiftStatus] = useState('inactivo'); // inactivo, activo, pausa

  const handleSaveService = (newService) => {
    setServicesList((prev) => [newService, ...prev]);
    setIsModalOpen(false);
  };

  const totalTurno = servicesList.reduce((acc, curr) => acc + curr.total, 0);

  // Cálculos para la gráfica
  const serviceCounts = {
    corte: 0,
    barba: 0,
    otros: 0
  };

  servicesList.forEach(svc => {
    if (svc.servicesNames.includes('Corte')) serviceCounts.corte++;
    if (svc.servicesNames.includes('Barba')) serviceCounts.barba++;
    if (svc.servicesNames.includes('Cejas') || svc.servicesNames.includes('Facial')) serviceCounts.otros++;
  });

  const totalItems = serviceCounts.corte + serviceCounts.barba + serviceCounts.otros;

  const getPercent = (count) => totalItems === 0 ? 0 : Math.round((count / totalItems) * 100);

  const pcCorte = getPercent(serviceCounts.corte);
  const pcBarba = getPercent(serviceCounts.barba);
  const pcOtros = getPercent(serviceCounts.otros);

  // Generamos el degradado cónico dinámico
  let conicGradient = `conic-gradient(#2A2A2A 0% 100%)`; // Por defecto, dona gris oscura
  if (totalItems > 0) {
    conicGradient = `conic-gradient(
      #D4AF37 0% ${pcCorte}%, 
      #CD7F32 ${pcCorte}% ${pcCorte + pcBarba}%, 
      #2A2A2A ${pcCorte + pcBarba}% 100%
    )`;
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
                    <img src="https://i.pravatar.cc/150?u=a04258" alt="Juan Carlos" className="w-full h-full object-cover" />
                  </div>
                  {/* Online indicator based on shift status */}
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-[3px] border-[#131313] rounded-full transition-colors ${
                    shiftStatus === 'activo' ? 'bg-green-500' : 
                    shiftStatus === 'pausa' ? 'bg-secondary' : 'bg-white/20'
                  }`}></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-white text-2xl font-extrabold tracking-wide">Juan Carlos</span>
                  <span className="text-white/40 text-[10px] tracking-widest uppercase font-extrabold mt-0.5">Master Barber</span>
                </div>
              </div>

              {/* Separador */}
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
                {/* Horario Programado */}
                <div className="flex items-center gap-2 px-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-tertiary"></div>
                  <span className="text-white/40 font-bold text-[11px] tracking-widest uppercase">Martes 14 de abril | 9:30 AM - 9:30 PM</span>
                </div>

                <div className="flex items-center gap-2 bg-[#1A1A1A] p-2 rounded-2xl border border-white/5">
                  <button 
                    onClick={() => setShiftStatus('activo')} 
                    className={`px-5 py-2.5 rounded-xl text-[10px] uppercase tracking-widest font-extrabold transition-all ${
                      shiftStatus === 'activo' 
                        ? 'bg-green-500/10 text-green-500 border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]' 
                        : 'bg-transparent text-white/40 border border-transparent hover:text-white'
                    }`}
                  >
                    Iniciar Turno
                  </button>
                  <button 
                    onClick={() => setShiftStatus('pausa')} 
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

              {/* Botón de Acción Condicionado */}
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
                  <div key={idx} className="flex items-center justify-between bg-[#1C1C1C] p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                    
                    <div className="flex items-center gap-6">
                      {/* Indicador Dorado a la izquierda */}
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
            {/* Gráfico circular Dinámico */}
            <div 
              className="absolute inset-0 rounded-full transition-all duration-1000 ease-out"
              style={{ background: conicGradient }}
            />
            {/* Centro oscuro */}
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
        onConfirm={() => setShiftStatus('inactivo')}
        servicesList={servicesList}
        totalTurno={totalTurno}
      />
    </div>
  );
}
