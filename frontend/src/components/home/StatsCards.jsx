import { LuCalendar, LuTrendingUp } from 'react-icons/lu';

export default function StatsCards({ clientCount, totalTurno }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Total Clientes */}
      <div className="bg-[#131313] rounded-[2rem] p-8 border border-white/5 shadow-xl flex items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white/40">
          <LuCalendar size={32} />
        </div>
        <div className="flex flex-col">
          <span className="text-white/40 text-[10px] tracking-widest uppercase font-black mb-1">Clientes Hoy</span>
          <span className="text-white font-black text-4xl">{clientCount}</span>
        </div>
      </div>

      {/* Generado en Turno */}
      <div className="bg-[#131313] rounded-[2rem] p-8 border border-white/5 shadow-xl flex items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
          <LuTrendingUp size={32} />
        </div>
        <div className="flex flex-col">
          <span className="text-white/40 text-[10px] tracking-widest uppercase font-black mb-1">Generado en Turno</span>
          <span className="text-white font-black text-4xl">{totalTurno.toFixed(2)}€</span>
        </div>
      </div>
    </div>
  );
}
