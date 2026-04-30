import React from 'react';
import { LuX, LuPencil, LuPlus, LuSave } from 'react-icons/lu';
import Loader from '../ui/Loader';

export default function ServiceAdminModal({ 
  isOpen, 
  onClose, 
  editingService, 
  formData, 
  setFormData, 
  handleSave, 
  isSaving 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-card border border-white/10 rounded-[2.5rem] shadow-2xl shadow-black/50 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="px-8 pt-8 pb-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              {editingService ? <LuPencil size={20} /> : <LuPlus size={20} />}
            </div>
            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">
                {editingService ? 'Editar Servicio' : 'Nuevo Servicio'}
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
          >
            <LuX size={20} />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/40 tracking-widest uppercase ml-1">Nombre</label>
              <input 
                type="text" 
                required 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                placeholder="Ej. Corte Degradado" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary/50 transition-all" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/40 tracking-widest uppercase ml-1">Precio ($)</label>
                <input 
                  type="number" 
                  required 
                  value={formData.price} 
                  onChange={(e) => setFormData({...formData, price: e.target.value})} 
                  placeholder="0.00" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary/50 transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/40 tracking-widest uppercase ml-1">Categoría</label>
                <select 
                  value={formData.category} 
                  onChange={(e) => setFormData({...formData, category: e.target.value})} 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
                >
                  <option value="cut">Corte</option>
                  <option value="beard">Barba</option>
                  <option value="other">Complemento</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 px-8 py-4 bg-white/5 text-white/60 rounded-2xl text-[10px] font-black tracking-widest uppercase hover:bg-white/10 transition-all"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={isSaving} 
              className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-primary text-background rounded-2xl text-[10px] font-black tracking-widest uppercase hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
            >
              {isSaving ? <Loader className="animate-spin h-5 w-5" /> : <LuSave size={16} />}
              <span>{editingService ? 'Actualizar' : 'Crear'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
