import React from 'react';
import { 
  LuScissors, LuSparkles, LuUser, 
  LuInfo, LuCheck
} from 'react-icons/lu';

// Components
import Loader from '../ui/Loader';
import ServiceHeader from './ServiceHeader';
import ServiceCard from './ServiceCard';
import ServiceAdminModal from './ServiceAdminModal';
import ServiceDeleteModal from './ServiceDeleteModal';

// Hooks
import { useServicesManager } from '../../hooks/useServicesManager';

const CATEGORIES = {
  cut: { label: 'CORTES', icon: <LuScissors className="text-primary" /> },
  beard: { label: 'BARBA', icon: <LuUser className="text-primary" /> },
  other: { label: 'COMPLEMENTOS', icon: <LuSparkles className="text-primary" /> }
};

export default function Services({ user }) {
  const isAdmin = user?.role === 'admin';
  const {
    loading,
    filter,
    setFilter,
    isModalOpen,
    setIsModalOpen,
    editingService,
    formData,
    setFormData,
    isSaving,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    serviceToDelete,
    toast,
    handleOpenModal,
    handleSave,
    handleConfirmDelete,
    handleDelete,
    groupedServices
  } = useServicesManager();

  if (loading && Object.keys(groupedServices).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader className="w-12 h-12 border-4 border-primary/20 border-t-primary text-primary rounded-full animate-spin mb-4" />
        <p className="text-white/40 font-medium tracking-widest text-xs uppercase animate-pulse">Sincronizando catálogo...</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 px-2 sm:px-6 lg:px-8 overflow-x-hidden">
      {/* Toast Notification */}
      {toast ? (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-top-full duration-300">
          <div className={`px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border ${
            toast.type === 'error' ? 'bg-red-500/90 border-red-400 text-white' : 'bg-green-500/90 border-green-400 text-white'
          } backdrop-blur-md`}>
            {toast.type === 'error' ? <LuInfo size={18} /> : <LuCheck size={18} />}
            <span className="text-xs font-bold uppercase tracking-widest">{toast.message}</span>
          </div>
        </div>
      ) : null}

      <ServiceHeader 
        isAdmin={isAdmin} 
        filter={filter} 
        setFilter={setFilter} 
        onNewService={() => handleOpenModal()} 
        categories={CATEGORIES}
      />

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(CATEGORIES).map(([key, config]) => (
          (filter === 'all' || filter === key) && groupedServices[key] ? (
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
                {groupedServices[key].map((service) => (
                  <ServiceCard 
                    key={service.id} 
                    service={service} 
                    isAdmin={isAdmin} 
                    onEdit={handleOpenModal} 
                    onDelete={handleConfirmDelete} 
                  />
                ))}
              </div>
            </section>
          ) : null
        ))}
      </div>

      <ServiceAdminModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        editingService={editingService} 
        formData={formData} 
        setFormData={setFormData} 
        handleSave={handleSave} 
        isSaving={isSaving} 
      />

      <ServiceDeleteModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        serviceToDelete={serviceToDelete} 
        handleDelete={handleDelete} 
        isSaving={isSaving} 
      />
    </div>
  );
}
