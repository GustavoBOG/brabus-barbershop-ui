import React from 'react';
import { LuTrash2, LuCheck } from 'react-icons/lu';
import Loader from '../ui/Loader';

export default function ServiceDeleteModal({ 
  isOpen, 
  onClose, 
  serviceToDelete, 
  handleDelete, 
  isSaving 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-sm bg-card border border-white/10 rounded-[2.5rem] shadow-2xl shadow-black/50 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-10 flex flex-col items-center text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
            <LuTrash2 size={40} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black text-white uppercase tracking-tight">¿Eliminar Servicio?</h3>
            <p className="text-white/40 text-sm leading-relaxed">
              Estás a punto de eliminar <span className="text-white font-bold">"{serviceToDelete?.name}"</span>. Esta acción no se puede deshacer.
            </p>
          </div>
          <div className="flex flex-col w-full gap-3">
            <button 
              onClick={handleDelete}
              disabled={isSaving}
              className="w-full py-4 bg-red-500 text-white rounded-2xl text-[11px] font-black tracking-widest uppercase hover:bg-red-600 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSaving ? <Loader className="animate-spin h-4 w-4" /> : <LuCheck size={16} />}
              Confirmar Eliminación
            </button>
            <button 
              onClick={onClose}
              className="w-full py-4 bg-white/5 border border-white/10 text-white/60 rounded-2xl text-[11px] font-black tracking-widest uppercase hover:bg-white/10 transition-all"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
