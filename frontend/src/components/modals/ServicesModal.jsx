import { LuX, LuCheck, LuClock } from 'react-icons/lu';
import { useState, useEffect } from 'react';

const availableServices = [
  { id: 'corte', name: 'Corte', price: 20.00 },
  { id: 'barba', name: 'Barba', price: 15.00 },
  { id: 'cejas', name: 'Cejas', price: 5.00 },
  { id: 'facial', name: 'Limpieza Facial', price: 25.00 },
];

const paymentMethods = [
  { id: 'Efectivo', label: 'Efectivo' },
  { id: 'Tarjeta', label: 'Tarjeta' },
  { id: 'Transferencia', label: 'Transferencia' }
];

export default function ServicesModal({ isOpen, onClose, onSave }) {
  const [selectedServices, setSelectedServices] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');
  const [timeIn, setTimeIn] = useState('');
  const [timeOut, setTimeOut] = useState('');

  // Set default times to current time on open
  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      setTimeIn(timeStr);
      setTimeOut(timeStr);
      setSelectedServices([]);
      setPaymentMethod('Efectivo');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleService = (id) => {
    setSelectedServices(prev => 
      prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    if (selectedServices.length === 0) return;

    const selectedItems = availableServices.filter(s => selectedServices.includes(s.id));
    const total = selectedItems.reduce((acc, curr) => acc + curr.price, 0);
    const servicesNames = selectedItems.map(s => s.name).join(' + ');

    onSave({
      servicesNames,
      total,
      timeIn,
      timeOut,
      paymentMethod
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity">
      {/* Modal Container */}
      <div className="bg-[#0A0A0A] border border-white/10 w-full max-w-lg rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-8 pb-6 border-b border-card flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-white mb-1">Nuevo Servicio</h2>
            <p className="text-white/40 text-[13px] font-bold tracking-wide">Registra los detalles del cliente.</p>
          </div>
          <button 
            onClick={onClose} 
            className="w-12 h-12 bg-card rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <LuX size={20} className="stroke-[3]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 flex flex-col gap-10 max-h-[60vh] overflow-y-auto">
          
          {/* Tiempos */}
          <div className="flex items-center gap-6">
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-white/50 text-[11px] font-bold tracking-widest uppercase ml-1">Hora de Entrada</label>
              <div className="relative">
                <LuClock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                <input 
                  type="time" 
                  value={timeIn}
                  onChange={(e) => setTimeIn(e.target.value)}
                  className="w-full bg-card border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white font-bold outline-none focus:border-primary/50 transition-colors [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                />
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-white/50 text-[11px] font-bold tracking-widest uppercase ml-1">Hora de Salida</label>
              <div className="relative">
                <LuClock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                <input 
                  type="time" 
                  value={timeOut}
                  onChange={(e) => setTimeOut(e.target.value)}
                  className="w-full bg-card border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white font-bold outline-none focus:border-primary/50 transition-colors [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                />
              </div>
            </div>
          </div>

          {/* Services List */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white/50 text-[11px] font-bold tracking-widest uppercase ml-1 mb-1">Servicios</h3>
            {availableServices.map((service) => {
              const isSelected = selectedServices.includes(service.id);
              return (
                <div 
                  key={service.id}
                  onClick={() => toggleService(service.id)}
                  className={`flex items-center justify-between p-5 rounded-2xl cursor-pointer transition-all border ${
                    isSelected 
                      ? 'bg-primary/5 border-primary/40' 
                      : 'bg-card border-transparent hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-7 h-7 rounded-[0.5rem] border-2 flex items-center justify-center transition-all ${
                      isSelected ? 'bg-primary border-primary' : 'border-white/20'
                    }`}>
                      {isSelected && <LuCheck size={16} className="text-[#0A0A0A] stroke-[4]" />}
                    </div>
                    <span className={`font-extrabold text-lg ${isSelected ? 'text-primary' : 'text-white'}`}>
                      {service.name}
                    </span>
                  </div>
                  <span className="text-secondary font-black tracking-tighter text-xl">
                    ${service.price.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Métodos de Pago */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white/50 text-[11px] font-bold tracking-widest uppercase ml-1 mb-1">Método de Pago</h3>
            <div className="grid grid-cols-3 gap-3">
              {paymentMethods.map(method => {
                const isActive = paymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`py-4 px-2 rounded-2xl text-[13px] font-extrabold border transition-all ${
                      isActive 
                        ? 'bg-tertiary/10 border-tertiary text-tertiary shadow-[0_0_20px_rgba(151,176,255,0.15)]' 
                        : 'bg-card border-white/5 text-white/50 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {method.label}
                  </button>
                )
              })}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-8 pt-6 border-t border-card flex items-center gap-5 bg-[#0a0a0a]">
          <button 
            onClick={onClose} 
            className="flex-1 py-5 rounded-2xl border border-white/20 text-white/70 font-bold hover:bg-white/5 hover:text-white transition-colors"
          >
            Cancelar
          </button>
          
          <button 
            onClick={handleSave} 
            className={`flex-1 py-5 rounded-2xl font-extrabold text-lg transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] ${
              selectedServices.length > 0 
                ? 'bg-primary text-[#0A0A0A] hover:bg-primary/90' 
                : 'bg-white/10 text-white/30 cursor-not-allowed shadow-none hover:shadow-none'
            }`}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
