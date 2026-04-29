function computeChartData(servicesList) {
  const counts = { corte: 0, barba: 0, otros: 0 };

  servicesList.forEach((svc) => {
    const name = svc.servicesNames || '';
    const cat = svc.category || '';
    if (cat === 'cut' || name.includes('Corte')) counts.corte++;
    if (cat === 'beard' || name.includes('Barba')) counts.barba++;
    if (cat === 'other' || name.includes('Cejas') || name.includes('Facial') || name.includes('Tinte')) counts.otros++;
  });

  const total = counts.corte + counts.barba + counts.otros;
  const pct = (n) => (total === 0 ? 0 : Math.round((n / total) * 100));

  const pcCorte = pct(counts.corte);
  const pcBarba = pct(counts.barba);
  const pcOtros = pct(counts.otros);

  const conicGradient =
    total > 0
      ? `conic-gradient(#D4AF37 0% ${pcCorte}%, #CD7F32 ${pcCorte}% ${pcCorte + pcBarba}%, #2A2A2A ${pcCorte + pcBarba}% 100%)`
      : `conic-gradient(#2A2A2A 0% 100%)`;

  return { pcCorte, pcBarba, pcOtros, conicGradient, total };
}

const LEGEND = [
  { label: 'Corte de Cabello', color: 'bg-primary', key: 'pcCorte' },
  { label: 'Arreglo de Barba', color: 'bg-secondary', key: 'pcBarba' },
  { label: 'Otros (Cejas / Facial)', color: 'bg-[#2A2A2A]', key: 'pcOtros' },
];

export default function ServicesChart({ servicesList }) {
  const { pcCorte, pcBarba, pcOtros, conicGradient, total } = computeChartData(servicesList);
  const percents = { pcCorte, pcBarba, pcOtros };

  return (
    <div className="bg-[#131313] rounded-[2rem] p-8 flex flex-col border border-white/5 shadow-xl h-full">
      <h2 className="text-white text-2xl font-extrabold mb-12">Resumen de Servicios</h2>

      {/* Donut chart */}
      <div className="relative w-56 h-56 mx-auto mb-10 flex items-center justify-center">
        <div
          className="absolute inset-0 rounded-full transition-all duration-1000 ease-out"
          style={{ background: conicGradient }}
        />
        <div className="absolute inset-[18px] rounded-full bg-[#131313] flex flex-col items-center justify-center shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)]">
          <span className="text-white font-black text-[2.75rem] leading-none mb-1">{total}</span>
          <span className="text-white/40 text-[9px] tracking-widest uppercase font-extrabold">TRABAJOS</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-4 mb-10 px-2 text-sm">
        {LEGEND.map(({ label, color, key }) => (
          <div key={key} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
              <span className="text-white/80 font-bold tracking-wide">{label}</span>
            </div>
            <span className="text-white font-bold">{percents[key]}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
