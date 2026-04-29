const paymentStyles = {
  Efectivo: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  Tarjeta: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  _default: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
};

function ServiceRow({ svc, idx }) {
  const paymentClass = paymentStyles[svc.paymentMethod] || paymentStyles._default;

  return (
    <div
      key={svc.id || idx}
      className="flex items-center justify-between bg-[#1C1C1C] p-4 sm:p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors gap-4"
    >
      <div className="flex items-center gap-3 sm:gap-6 min-w-0">
        <div className="w-1 self-stretch bg-primary rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)] shrink-0 my-1" />
        <div className="flex flex-col gap-1 min-w-0">
          {svc.servicesNames.split(' + ').map((name, i) => (
            <span key={i} className="text-white font-extrabold text-sm sm:text-base tracking-wide truncate block">
              • {name}
            </span>
          ))}
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="text-white/50 text-[10px] sm:text-[11px] tracking-widest font-bold bg-[#131313] px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-white/5 whitespace-nowrap">
              {svc.timeIn} - {svc.timeOut}
            </span>
            <span className={`text-[10px] sm:text-[11px] tracking-widest font-black px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg uppercase whitespace-nowrap border ${paymentClass}`}>
              {svc.paymentMethod}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end shrink-0 ml-auto">
        <span className="text-secondary font-black text-xl sm:text-2xl leading-none">{svc.total.toFixed(2)}€</span>
        <span className="text-white/30 text-[9px] sm:text-[10px] font-bold tracking-widest uppercase mt-1">EUR</span>
      </div>
    </div>
  );
}

export default function ServicesList({ servicesList }) {
  return (
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
            <ServiceRow key={svc.id || idx} svc={svc} idx={idx} />
          ))}
        </div>
      )}
    </div>
  );
}
