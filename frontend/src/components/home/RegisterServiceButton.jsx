import { LuScissors } from 'react-icons/lu';

export default function RegisterServiceButton({ shiftStatus, onClick }) {
  const isActive = shiftStatus === 'activo';

  return (
    <button
      onClick={onClick}
      disabled={!isActive}
      className={`w-full rounded-[2rem] font-black text-base tracking-[0.2em] uppercase py-5 transition-all relative overflow-hidden group ${
        isActive
          ? 'bg-amber-500 text-[#0A0A0A] hover:scale-[1.01] active:scale-[0.99] shadow-[0_8px_30px_rgba(212,175,55,0.25)]'
          : 'bg-white/5 text-white/10 border border-white/5 cursor-not-allowed opacity-50'
      }`}
    >
      <div className="relative flex items-center justify-center gap-3">
        <LuScissors size={20} className="group-hover:rotate-12 transition-transform" />
        <span>Registrar Servicio</span>
      </div>

      {!isActive ? (
        <p className="absolute bottom-2 left-0 w-full text-center text-[9px] tracking-[0.4em] font-black opacity-40">
          Inicia turno para comenzar
        </p>
      ) : null}
    </button>
  );
}
