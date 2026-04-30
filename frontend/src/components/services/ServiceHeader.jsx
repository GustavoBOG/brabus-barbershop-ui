import React from 'react';
import { LuPlus } from 'react-icons/lu';

export default function ServiceHeader({ isAdmin, filter, setFilter, onNewService, categories }) {
  return (
    <header className="relative pt-12 pb-6 border-b border-white/5">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 relative z-10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px] font-bold tracking-[0.2em] uppercase">
            <span className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]'} animate-pulse`} />
            <span className={isAdmin ? 'text-amber-500 font-black' : ''}>
              {isAdmin ? 'SESIÓN DE ADMINISTRADOR ACTIVADA' : 'PERSONAL INTERNO - GUÍA DE OPERACIONES'}
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight">
            Catálogo de <span className="text-primary italic">Servicios</span>
          </h1>
          <p className="text-white/30 text-sm max-w-xl">
            {isAdmin 
              ? 'Gestiona el catálogo oficial de servicios, ajusta precios y actualiza categorías del sistema.' 
              : 'Referencia oficial de precios y desglose de comisiones para el equipo técnico.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1 sm:gap-3 bg-card/40 p-1 rounded-2xl border border-white/5 overflow-x-auto max-w-full no-scrollbar">
            {['all', 'cut', 'beard', 'other'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-[9px] sm:text-[10px] font-black tracking-widest uppercase transition-all whitespace-nowrap ${
                  filter === cat 
                  ? 'bg-primary text-background shadow-lg shadow-primary/20' 
                  : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                }`}
              >
                {cat === 'all' ? 'Ver Todo' : categories[cat]?.label || cat}
              </button>
            ))}
          </div>

          {isAdmin ? (
            <button 
              onClick={onNewService}
              className="flex items-center gap-2 px-6 py-3.5 bg-white text-background rounded-2xl text-[10px] font-black tracking-widest uppercase hover:bg-primary transition-all shadow-xl shadow-white/5 active:scale-95"
            >
              <LuPlus size={16} />
              <span>Nuevo Servicio</span>
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
