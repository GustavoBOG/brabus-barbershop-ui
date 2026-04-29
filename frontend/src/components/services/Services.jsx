import { useState, useEffect } from 'react';
import { 
  LuScissors, LuSparkles, LuUser, LuBadgeDollarSign, 
  LuInfo, LuWallet, LuBuilding2, LuPlus, LuPencil, 
  LuTrash2, LuX, LuSave, LuCheck
} from 'react-icons/lu';
import { servicesApi } from '../../services/api';

export default function Services({ user }) {
  const isAdmin = user?.role === 'admin';
  
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '', category: 'cut' });
  const [isSaving, setIsSaving] = useState(false);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  // Toast State
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await servicesApi.getAll();
      setServices(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('No se pudieron cargar los servicios');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData({ name: service.name, price: service.price, category: service.category });
    } else {
      setEditingService(null);
      setFormData({ name: '', price: '', category: 'cut' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      if (editingService) {
        await servicesApi.update(editingService.id, formData);
        showToast('Servicio actualizado correctamente');
      } else {
        await servicesApi.create(formData);
        showToast('Servicio creado correctamente');
      }
      await fetchServices();
      setIsModalOpen(false);
    } catch (err) {
      showToast('Error al guardar el servicio', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = (service) => {
    setServiceToDelete(service);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!serviceToDelete) return;
    try {
      setIsSaving(true);
      await servicesApi.delete(serviceToDelete.id);
      showToast('Servicio eliminado correctamente');
      await fetchServices();
      setIsDeleteModalOpen(false);
    } catch (err) {
      showToast('Error al eliminar el servicio', 'error');
    } finally {
      setIsSaving(false);
      setServiceToDelete(null);
    }
  };

  const categories = {
    cut: { label: 'CORTES', icon: <LuScissors className="text-primary" /> },
    beard: { label: 'BARBA', icon: <LuUser className="text-primary" /> },
    other: { label: 'COMPLEMENTOS', icon: <LuSparkles className="text-primary" /> }
  };

  const groupedServices = services.reduce((acc, service) => {
    const category = service.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(service);
    return acc;
  }, {});

  if (loading && services.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
        <p className="text-white/40 font-medium tracking-widest text-xs uppercase animate-pulse">Sincronizando catálogo...</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 px-2 sm:px-6 lg:px-8 overflow-x-hidden">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-top-full duration-300">
          <div className={`px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border ${
            toast.type === 'error' ? 'bg-red-500/90 border-red-400 text-white' : 'bg-green-500/90 border-green-400 text-white'
          } backdrop-blur-md`}>
            {toast.type === 'error' ? <LuInfo size={18} /> : <LuCheck size={18} />}
            <span className="text-xs font-bold uppercase tracking-widest">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header Section */}
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

            {isAdmin && (
              <button 
                onClick={() => handleOpenModal()}
                className="flex items-center gap-2 px-6 py-3.5 bg-white text-background rounded-2xl text-[10px] font-black tracking-widest uppercase hover:bg-primary transition-all shadow-xl shadow-white/5 active:scale-95"
              >
                <LuPlus size={16} />
                <span>Nuevo Servicio</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(categories).map(([key, config]) => (
          (filter === 'all' || filter === key) && groupedServices[key] && (
            <section key={key} className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                    {config.icon}
                  </div>
                  <h2 className="text-xs font-black tracking-[0.3em] text-white/60 uppercase">{config.label}</h2>
                </div>
              </div>

              <div className="space-y-4">
                {groupedServices[key].map((service) => {
                  const price = parseFloat(service.price);
                  const commission = price * 0.5;

                  return (
                    <div 
                      key={service.id}
                      className="group relative bg-card/60 border border-white/5 rounded-3xl p-6 hover:bg-white/[0.04] hover:border-primary/40 transition-all duration-300 overflow-hidden"
                    >
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
                            {isAdmin && (
                              <div className="flex items-center gap-2 mt-3 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleOpenModal(service); }}
                                  className="p-3 lg:p-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all active:scale-90"
                                >
                                  <LuPencil size={16} className="lg:w-3.5 lg:h-3.5" />
                                </button>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleConfirmDelete(service); }}
                                  className="p-3 lg:p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all active:scale-90"
                                >
                                  <LuTrash2 size={16} className="lg:w-3.5 lg:h-3.5" />
                                </button>
                              </div>
                            )}
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
                })}
              </div>
            </section>
          )
        ))}
      </div>

      {/* Save/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-lg bg-card border border-white/10 rounded-[2.5rem] shadow-2xl shadow-black/50 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-8 pt-8 pb-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  {editingService ? <LuPencil size={20} /> : <LuPlus size={20} />}
                </div>
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">{editingService ? 'Editar Servicio' : 'Nuevo Servicio'}</h3>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"><LuX size={20} /></button>
            </div>

            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 tracking-widest uppercase ml-1">Nombre</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Ej. Corte Degradado" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary/50 transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/40 tracking-widest uppercase ml-1">Precio ($)</label>
                    <input type="number" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} placeholder="0.00" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary/50 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/40 tracking-widest uppercase ml-1">Categoría</label>
                    <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer">
                      <option value="cut">Corte</option>
                      <option value="beard">Barba</option>
                      <option value="other">Complemento</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-8 py-4 bg-white/5 text-white/60 rounded-2xl text-[10px] font-black tracking-widest uppercase hover:bg-white/10 transition-all">Cancelar</button>
                <button type="submit" disabled={isSaving} className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-primary text-background rounded-2xl text-[10px] font-black tracking-widest uppercase hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
                  {isSaving ? <LuLoader className="animate-spin h-5 w-5" /> : <LuSave size={16} />}
                  <span>{editingService ? 'Actualizar' : 'Crear'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
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
                  {isSaving ? <LuLoader className="animate-spin h-4 w-4" /> : <LuCheck size={16} />}
                  Confirmar Eliminación
                </button>
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="w-full py-4 bg-white/5 border border-white/10 text-white/60 rounded-2xl text-[11px] font-black tracking-widest uppercase hover:bg-white/10 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LuLoader({ className = "h-5 w-5" }) {
  return (
    <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}
