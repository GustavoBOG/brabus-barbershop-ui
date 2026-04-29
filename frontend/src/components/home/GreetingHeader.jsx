export default function GreetingHeader({ user, shiftStatus, onOpenShiftManagement }) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '¡Buenos días';
    if (hour < 20) return '¡Buenas tardes';
    return '¡Buenas noches';
  };

  const statusColorDot = {
    activo: 'bg-green-500',
    pausa: 'bg-amber-500',
    inactivo: 'bg-red-500',
  };

  const statusColorText = {
    activo: 'text-green-500/60',
    pausa: 'text-amber-500/60',
    inactivo: 'text-red-500/60',
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="text-white text-3xl font-black tracking-tight">
          {getGreeting()}, {user?.full_name?.split(' ')[0]}!
        </h1>
        <p className="text-white/40 font-bold text-sm">
          Hoy, {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* Botón de Gestión de Turno */}
      <div
        onClick={onOpenShiftManagement}
        className="flex items-center gap-4 bg-[#131313] p-2 pr-6 rounded-2xl border border-white/5 cursor-pointer hover:border-white/20 transition-all hover:scale-105 group"
      >
        <div className="relative">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/5 border border-white/10 grayscale-[30%] group-hover:grayscale-0 transition-all">
            <img
              src={user?.avatar_url || 'https://i.pravatar.cc/150?u=default'}
              alt={user?.full_name}
              className="w-full h-full object-cover"
            />
          </div>
          <div
            className={`absolute -bottom-1 -right-1 w-4 h-4 border-[3px] border-[#131313] rounded-full transition-colors ${statusColorDot[shiftStatus] || 'bg-red-500'}`}
          />
        </div>
        <div className="flex flex-col">
          <span className="text-white text-sm font-black tracking-tight">Gestión de Turno</span>
          <span className={`text-[10px] font-black uppercase tracking-widest ${statusColorText[shiftStatus] || 'text-red-500/60'}`}>
            {shiftStatus}
          </span>
        </div>
      </div>
    </div>
  );
}
