import { useState } from 'react';
import { LuHouse, LuCalendar, LuUsers, LuSettings, LuScissors, LuBell, LuSearch, LuMenu, LuX } from 'react-icons/lu';

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex font-sans text-white overflow-hidden relative">
      {/* Overlay para móvil */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-64 fixed inset-y-0 left-0 bg-background border-r border-white/5 flex flex-col z-50 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-20 lg:h-24 flex items-center justify-between px-6 border-b border-white/5 lg:border-transparent">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-md bg-primary flex items-center justify-center text-background">
              <LuScissors size={18} className="stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-primary text-lg lg:text-xl leading-tight">Brabus</span>
              <span className="text-[9px] lg:text-[10px] text-white/50 tracking-widest font-semibold uppercase">Premium Grooming</span>
            </div>
          </div>
          <button className="lg:hidden text-white/50 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
            <LuX size={24} />
          </button>
        </div>
        
        <nav className="flex-1 py-8 flex flex-col gap-1">
          <NavItem icon={<LuHouse size={20} />} label="DASHBOARD" active />
          <NavItem icon={<LuCalendar size={20} />} label="APPOINTMENTS" />
          <NavItem icon={<LuUsers size={20} />} label="STAFF" />
          <NavItem icon={<LuScissors size={20} />} label="SERVICES" />
          <NavItem icon={<LuSettings size={20} />} label="INVENTORY" />
        </nav>
      </aside>

      {/* Contenedor Principal (Topbar + Contenido) */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen w-full relative">
        {/* Topbar */}
        <header className="h-20 lg:h-24 px-4 lg:px-8 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-white/70 hover:text-white" onClick={() => setIsSidebarOpen(true)}>
              <LuMenu size={24} />
            </button>
            {/* Search container */}
            <div className="relative group hidden sm:block">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <LuSearch size={18} className="text-white/40" />
              </div>
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-card text-sm text-white/80 rounded-xl outline-none pl-10 pr-4 py-2 lg:py-3 w-48 lg:w-72 border border-white/5 focus:border-white/20 transition-all placeholder:text-white/30"
              />
            </div>
          </div>

          {/* Right Header */}
          <div className="flex items-center gap-4 lg:gap-6">
            <div className="flex items-center gap-3 lg:gap-4 text-white/40">
              <button className="hover:text-primary transition-colors hidden sm:block">
                <LuBell size={20} />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-bold text-white">Juan Carlos</span>
                <span className="text-[10px] uppercase tracking-widest text-primary font-bold">MASTER BARBER</span>
              </div>
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-card border-2 border-primary/30 overflow-hidden">
                <img src="https://i.pravatar.cc/150?u=a04258" alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-4 lg:pt-2">
          {children}
        </main>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active }) {
  return (
    <button 
      className={`relative w-full flex items-center gap-4 px-8 py-4 transition-all duration-300 ${
        active 
          ? 'bg-card/40 text-primary' 
          : 'text-white/50 hover:text-white/90 hover:bg-white/[0.02]'
      }`}
    >
      {/* Indicador lateral */}
      {(active) && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
      )}
      <span className={active ? 'text-primary' : 'text-white/40'}>{icon}</span>
      <span className="text-sm font-bold tracking-widest uppercase">{label}</span>
      
    </button>
  );
}
