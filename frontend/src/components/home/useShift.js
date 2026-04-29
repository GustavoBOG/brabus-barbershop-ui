import { useState, useEffect } from 'react';
import { shiftsApi, workRecordsApi } from '../../services/api';

export function useShift(userId) {
  const [servicesList, setServicesList] = useState([]);
  const [shiftStatus, setShiftStatus] = useState('inactivo');
  const [currentShift, setCurrentShift] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [intervals, setIntervals] = useState([]);

  // Cargar turno activo al montar el componente
  useEffect(() => {
    async function loadActiveShift() {
      try {
        setInitialLoading(true);
        const shift = await shiftsApi.getActive(userId);
        if (shift) {
          setCurrentShift(shift);
          setShiftStatus(shift.status === 'active' ? 'activo' : 'pausa');

          const storedIntervals = JSON.parse(localStorage.getItem(`shift_intervals_${shift.id}`) || '[]');
          const migratedIntervals = storedIntervals.map(i => ({
            ...i,
            type: i.type || 'work',
          }));
          setIntervals(migratedIntervals);

          const records = await shiftsApi.getRecords(shift.id);
          const formatted = records.map(r => ({
            id: r.id,
            servicesNames: r.client_name || r.services?.name || 'Servicio',
            total: parseFloat(r.total_price),
            timeIn: new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
            timeOut: new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
            paymentMethod: r.payment_method,
            category: r.services?.category || 'other',
          }));
          setServicesList(formatted);
        }
      } catch (error) {
        console.error('Error al cargar turno activo:', error);
      } finally {
        setInitialLoading(false);
      }
    }

    if (userId) {
      loadActiveShift();
    }
  }, [userId]);

  // Timer logic
  useEffect(() => {
    let interval;
    if (shiftStatus === 'activo' && currentShift) {
      interval = setInterval(() => {
        const start = new Date(currentShift.start_time).getTime();
        const now = Date.now();
        const pausedMs = parseInt(localStorage.getItem(`shift_paused_${currentShift.id}`) || '0');
        const diff = Math.max(0, now - start - pausedMs);
        setElapsedTime(Math.floor(diff / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [shiftStatus, currentShift]);

  const formatElapsedTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  // ─── Handlers de Turno ─────────────────────────────────
  const handleStartShift = async () => {
    try {
      setLoading(true);
      const shift = await shiftsApi.start(userId);
      setCurrentShift(shift);
      setShiftStatus('activo');
      setServicesList([]);

      const newIntervals = [{ from: new Date().toISOString(), to: null, duration: 0, type: 'work' }];
      setIntervals(newIntervals);
      localStorage.setItem(`shift_intervals_${shift.id}`, JSON.stringify(newIntervals));
    } catch (error) {
      console.error('Error al iniciar turno:', error);
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePauseShift = async () => {
    try {
      if (currentShift) {
        await shiftsApi.updateStatus(currentShift.id, 'paused');
        const now = new Date().toISOString();
        const updatedIntervals = [...intervals];
        const lastIdx = updatedIntervals.length - 1;
        if (lastIdx >= 0) {
          updatedIntervals[lastIdx].to = now;
          updatedIntervals[lastIdx].duration = (new Date(now) - new Date(updatedIntervals[lastIdx].from)) / 1000;
        }
        updatedIntervals.push({ from: now, to: null, duration: 0, type: 'break' });
        setIntervals(updatedIntervals);
        localStorage.setItem(`shift_intervals_${currentShift.id}`, JSON.stringify(updatedIntervals));
        localStorage.setItem(`shift_break_start_${currentShift.id}`, now);
      }
      setShiftStatus('pausa');
    } catch (error) {
      console.error('Error al pausar turno:', error);
    }
  };

  const handleResumeShift = async () => {
    try {
      if (currentShift) {
        await shiftsApi.updateStatus(currentShift.id, 'active');
        const now = new Date().toISOString();
        const updatedIntervals = [...intervals];
        const lastIdx = updatedIntervals.length - 1;

        if (lastIdx >= 0 && updatedIntervals[lastIdx].type === 'break') {
          updatedIntervals[lastIdx].to = now;
          updatedIntervals[lastIdx].duration = (new Date(now) - new Date(updatedIntervals[lastIdx].from)) / 1000;
        }

        updatedIntervals.push({ from: now, to: null, duration: 0, type: 'work' });
        setIntervals(updatedIntervals);
        localStorage.setItem(`shift_intervals_${currentShift.id}`, JSON.stringify(updatedIntervals));

        const breakStart = localStorage.getItem(`shift_break_start_${currentShift.id}`);
        if (breakStart) {
          const pauseDuration = Date.now() - new Date(breakStart).getTime();
          const currentPaused = parseInt(localStorage.getItem(`shift_paused_${currentShift.id}`) || '0');
          localStorage.setItem(`shift_paused_${currentShift.id}`, (currentPaused + pauseDuration).toString());
          localStorage.removeItem(`shift_break_start_${currentShift.id}`);
        }
      }
      setShiftStatus('activo');
    } catch (error) {
      console.error('Error al reanudar turno:', error);
    }
  };

  const handleEndShift = async () => {
    try {
      if (currentShift) {
        await shiftsApi.updateStatus(currentShift.id, 'finished');
        const now = new Date().toISOString();
        const updatedIntervals = [...intervals];
        const lastIdx = updatedIntervals.length - 1;
        if (lastIdx >= 0 && !updatedIntervals[lastIdx].to) {
          updatedIntervals[lastIdx].to = now;
          updatedIntervals[lastIdx].duration = (new Date(now) - new Date(updatedIntervals[lastIdx].from)) / 1000;
        }
        localStorage.removeItem(`shift_paused_${currentShift.id}`);
        localStorage.removeItem(`shift_break_start_${currentShift.id}`);
        localStorage.removeItem(`shift_intervals_${currentShift.id}`);
      }
      setShiftStatus('inactivo');
      setCurrentShift(null);
      setIntervals([]);
      setServicesList([]);
      setElapsedTime(0);
    } catch (error) {
      console.error('Error al cerrar turno:', error);
      setShiftStatus('inactivo');
      setCurrentShift(null);
    }
  };

  // ─── Handler de Servicio ───────────────────────────────
  const handleSaveService = async (newService) => {
    if (!currentShift) {
      alert('No hay turno activo para registrar servicios.');
      return;
    }

    try {
      for (const item of newService.selectedItems) {
        await workRecordsApi.create({
          shift_id: currentShift.id,
          service_id: item.id,
          client_name: newService.servicesNames,
          payment_method: newService.paymentMethod,
          total_price: parseFloat(item.price),
        });
      }

      setServicesList((prev) => [
        {
          servicesNames: newService.servicesNames,
          total: newService.total,
          timeIn: newService.timeIn,
          timeOut: newService.timeOut,
          paymentMethod: newService.paymentMethod,
          category: newService.selectedItems?.[0]?.category || 'other',
        },
        ...prev,
      ]);
    } catch (error) {
      console.error('Error al guardar servicio:', error);
      alert('Error al guardar: ' + error.message);
    }
  };

  const totalTurno = servicesList.reduce((acc, curr) => acc + curr.total, 0);

  return {
    servicesList,
    shiftStatus,
    loading,
    initialLoading,
    elapsedTime,
    intervals,
    totalTurno,
    formatElapsedTime,
    handleStartShift,
    handlePauseShift,
    handleResumeShift,
    handleEndShift,
    handleSaveService,
  };
}
