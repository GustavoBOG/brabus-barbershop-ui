import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, Send } from 'lucide-react';

export default function EndShiftModal({ isOpen, onClose, onConfirm, servicesList, totalTurno }) {
  const [step, setStep] = useState(1);

  if (!isOpen) return null;

  const handleConfirm = () => {
    setStep(2);
  };

  const handleClose = () => {
    setStep(1);
    onConfirm();
    onClose();
  };

  const barberCut = totalTurno * 0.70;
  const totalClients = servicesList.length;

  const handleWhatsApp = () => {
    const mensaje = `💈 *Resumen del Día - Brabus Barbershop* 💈\n\nTurno: Hoy 9:30 AM - Ahora\nBarbero: Juan Carlos\n\n✂️ Clientes atendidos: ${totalClients}\n💰 Total generado: ${totalTurno.toFixed(2)}€\n💶 Tus ganancias (70%): ${barberCut.toFixed(2)}€\n\n¡Gran trabajo!`;
    const numero = "34603534213"; 
    
    // Enlace nativo directo a la aplicación (salta la página puente wa.me)
    const nativeUrl = `whatsapp://send?phone=${numero}&text=${encodeURIComponent(mensaje)}`;
    window.location.href = nativeUrl;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#131313] border border-white/5 shadow-2xl w-full max-w-[400px] rounded-[2rem] p-8 relative overflow-hidden">
        
        {step === 1 ? (
          <div className="flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
            <div className="w-[72px] h-[72px] rounded-full bg-red-500/10 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(239,68,68,0.15)] border border-red-500/20">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-white text-2xl font-black mb-3 tracking-wide">¿Cerrar tu turno?</h2>
            <p className="text-white/50 text-sm font-medium mb-10 leading-relaxed px-2">
              Estás a punto de finalizar tu día de trabajo. No podrás registrar más servicios ni contar actividad nueva hasta el próximo turno.
            </p>
            <div className="flex w-full gap-4">
              <button 
                onClick={onClose}
                className="flex-1 py-4 rounded-xl border border-white/10 text-white/50 text-[11px] font-extrabold tracking-widest hover:text-white hover:bg-white/5 transition-all uppercase"
              >
                Cancelar
              </button>
              <button 
                onClick={handleConfirm}
                className="flex-1 py-4 rounded-xl bg-red-500/90 text-white text-[11px] font-extrabold tracking-widest hover:bg-red-500 transition-all uppercase shadow-[0_0_20px_rgba(239,68,68,0.2)]"
              >
                Sí, Cerrar
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center animate-in slide-in-from-right-16 fade-in duration-500">
            <div className="w-[72px] h-[72px] rounded-full bg-green-400/10 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(74,222,128,0.2)] border border-green-400/20">
              <CheckCircle2 className="w-10 h-10 text-green-400" />
            </div>
            <h2 className="text-white text-[1.65rem] font-black mb-1">Turno Finalizado</h2>
            <p className="text-white/40 text-[10px] tracking-widest uppercase font-extrabold mb-8">Cierre realizado con éxito</p>
            
            <div className="w-full bg-[#1A1A1A] border border-white/5 rounded-[1.5rem] p-6 flex flex-col gap-5 mb-8 shadow-inner">
               <div className="flex justify-between items-center">
                 <span className="text-white/50 text-[11px] font-bold tracking-widest uppercase">Fichaje</span>
                 <span className="text-white font-extrabold text-sm tracking-wide">9:30 AM - Ahora</span>
               </div>
               
               <div className="w-full h-px bg-white/5"></div>
               
               <div className="flex justify-between items-center">
                 <span className="text-white/50 text-[11px] font-bold tracking-widest uppercase">Clientes Atendidos</span>
                 <span className="text-white font-black text-xl">{totalClients}</span>
               </div>
               
               <div className="flex justify-between items-center">
                 <span className="text-white/50 text-[11px] font-bold tracking-widest uppercase">Total Generado</span>
                 <span className="text-white font-black text-xl">{totalTurno.toFixed(2)}€</span>
               </div>
               
               <div className="w-full h-px bg-white/5"></div>
               
               <div className="flex justify-between items-center py-2">
                 <div className="flex flex-col items-start gap-1">
                   <span className="text-primary text-[13px] font-black tracking-widest uppercase">Tu Ganancia</span>
                   <span className="text-[#CD7F32] text-[9px] uppercase tracking-widest font-extrabold bg-[#CD7F32]/10 px-2 py-0.5 rounded-sm">70% COMISIÓN</span>
                 </div>
                 <span className="text-primary font-black text-4xl tracking-tighter">{barberCut.toFixed(2)}€</span>
               </div>
            </div>

            <div className="w-full flex flex-col gap-3">
              <button 
                onClick={handleWhatsApp}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] text-[11px] font-extrabold tracking-widest hover:bg-[#25D366]/20 transition-all uppercase shadow-[0_0_15px_rgba(37,211,102,0.1)]"
              >
                <Send className="w-4 h-4" />
                Enviar por WhatsApp
              </button>
              
              <button 
                onClick={handleClose}
                className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white/50 text-[11px] font-extrabold tracking-widest hover:bg-white/10 hover:text-white transition-colors uppercase"
              >
                Volver al inicio
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
