import { useState, useEffect } from 'react';
import { servicesApi } from '../services/api';

export function useServicesManager() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  // Modal States
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
    if (e) e.preventDefault();
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

  const groupedServices = services.reduce((acc, service) => {
    const category = service.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(service);
    return acc;
  }, {});

  return {
    services,
    loading,
    error,
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
    setToast,
    handleOpenModal,
    handleSave,
    handleConfirmDelete,
    handleDelete,
    groupedServices
  };
}
