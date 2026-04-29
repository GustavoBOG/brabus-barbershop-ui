import React from 'react';
import { LuPlay, LuPause, LuPower, LuClock, LuCalendar, LuX } from 'react-icons/lu';

export default function ShiftManagementModal({ 
  isOpen, 
  onClose, 
  shiftStatus, 
  onStart, 
  onPause, 
  onResume, 
  onEnd,
  loading,
  elapsedTime,
  formatElapsedTime,
  intervals = []
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-[#131313] w-full max-w-md rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
              shiftStatus === 'activo' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
              shiftStatus === 'pausa' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
              'bg-red-500/10 text-red-500 border-red-500/20'
            }`}>
              <LuClock size={20} />
            </div>
            <div>
              <h3 className="text-white font-black text-lg tracking-tight">Gestión de Turno</h3>
              <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">
                Estado: {shiftStatus.charAt(0).toUpperCase() + shiftStatus.slice(1)}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors"
          >
            <LuX size={20} />
          </button>
        </div>

        {/* Timer Display */}
        {(shiftStatus === 'activo' || shiftStatus === 'pausa') && (
          <div className="p-8 pb-4 text-center">
            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Tiempo Transcurrido</p>
            <p className="text-white text-5xl font-black tracking-tighter tabular-nums">
              {formatElapsedTime(elapsedTime)}
            </p>
          </div>
        )}

        {/* Intervals Summary */}
        {intervals.length > 0 && (
          <div className="px-8 py-4 max-h-40 overflow-y-auto">
             <div className="grid grid-cols-3 text-[9px] font-black uppercase tracking-widest text-white/20 mb-3 px-2">
                <span>Desde</span>
                <span>Hasta</span>
                <span className="text-right">Total</span>
              </div>
              <div className="flex flex-col gap-2">
                {intervals.map((interval, idx) => (
                  <div key={idx} className={`grid grid-cols-3 items-center px-2 py-2 rounded-lg border transition-colors ${
                    interval.type === 'break' 
                      ? 'bg-amber-500/5 border-amber-500/10' 
                      : 'bg-white/[0.02] border-white/5'
                  }`}>
                    <div className="flex flex-col">
                      <span className="text-white font-bold text-[11px]">
                        {new Date(interval.from).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                      </span>
                      {interval.type === 'break' && (
                        <span className="text-amber-500 text-[8px] font-black uppercase tracking-tighter">Descanso</span>
                      )}
                    </div>
                    <span className="text-white font-bold text-[11px]">
                      {interval.to 
                        ? new Date(interval.to).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
                        : '--:--'
                      }
                    </span>
                    <span className={`text-right font-black text-xs ${interval.type === 'break' ? 'text-amber-500' : 'text-white/40'}`}>
                      {interval.duration > 0 
                        ? (interval.duration >= 3600 
                            ? `${Math.floor(interval.duration / 3600)}h ${Math.floor((interval.duration % 3600) / 60)}m` 
                            : `${Math.floor(interval.duration / 60)}m`)
                        : (interval.to ? '0m' : '--')
                      }
                    </span>
                  </div>
                ))}
              </div>
          </div>
        )}

        {/* Actions */}
        <div className="p-8 flex flex-col gap-4">
          {shiftStatus === 'inactivo' ? (
            <button
              onClick={() => { onStart(); onClose(); }}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-500 text-white rounded-2xl py-4 font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-green-600/20"
            >
              <LuPlay size={18} fill="currentColor" />
              Iniciar Turno
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  shiftStatus === 'pausa' ? onResume() : onPause();
                  onClose();
                }}
                className={`w-full rounded-2xl py-4 font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 ${
                  shiftStatus === 'pausa'
                    ? 'bg-amber-500 text-[#0A0A0A] shadow-lg shadow-amber-500/20'
                    : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
                }`}
              >
                {shiftStatus === 'pausa' ? (
                  <><LuPlay size={18} fill="currentColor" /> Reanudar</>
                ) : (
                  <><LuPause size={18} fill="currentColor" /> Tomar Descanso</>
                )}
              </button>
              
              <button
                onClick={() => { onEnd(); onClose(); }}
                className="w-full bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/20 rounded-2xl py-4 font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95"
              >
                <LuPower size={18} />
                Finalizar Jornada
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
