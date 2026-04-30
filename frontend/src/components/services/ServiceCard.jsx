import React from 'react';
import { LuWallet, LuBuilding2, LuPencil, LuTrash2 } from 'react-icons/lu';

export default function ServiceCard({ service, isAdmin, onEdit, onDelete }) {
  const price = parseFloat(service.price);
  const commission = price * 0.5;

  return (
    <div className="group relative bg-card/60 border border-white/5 rounded-3xl p-6 hover:bg-white/[0.04] hover:border-primary/40 transition-all duration-300 overflow-hidden">
      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors">{service.name}</h3>
            <span className="text-[9px] font-black tracking-widest text-white/20 uppercase block">Ref ID: {service.id.slice(0, 8)}</span>
          </div>
          
          <div className="flex flex-col items-end">
            <div className="text-2xl font-black text-white flex items-center justify-end gap-1">
              <span className="text-primary text-sm font-bold mt-1">$</span>
              <span>{price.toLocaleString()}</span>
            </div>
            {isAdmin ? (
              <div className="flex items-center gap-2 mt-3 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => { e.stopPropagation(); onEdit(service); }}
                  className="p-3 lg:p-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all active:scale-90"
                >
                  <LuPencil size={16} className="lg:w-3.5 lg:h-3.5" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(service); }}
                  className="p-3 lg:p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all active:scale-90"
                >
                  <LuTrash2 size={16} className="lg:w-3.5 lg:h-3.5" />
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
          <div className="bg-white/[0.02] rounded-2xl p-3 border border-white/5 space-y-1">
            <div className="flex items-center gap-2 text-white/30">
              <LuWallet size={12} className="text-green-500" />
              <span className="text-[9px] font-black tracking-widest uppercase">Barbero</span>
            </div>
            <div className="text-sm font-bold text-green-400">${commission.toLocaleString()}</div>
          </div>
          
          <div className="bg-white/[0.02] rounded-2xl p-3 border border-white/5 space-y-1">
            <div className="flex items-center gap-2 text-white/30">
              <LuBuilding2 size={12} className="text-primary/70" />
              <span className="text-[9px] font-black tracking-widest uppercase">Local</span>
            </div>
            <div className="text-sm font-bold text-white/60">${commission.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
