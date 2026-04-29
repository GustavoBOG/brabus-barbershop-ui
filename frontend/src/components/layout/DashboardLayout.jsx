import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LuHouse, LuCalendar, LuUsers, LuSettings, LuScissors, LuMenu, LuX, LuLogOut, LuClock } from 'react-icons/lu';

export default function DashboardLayout({ children, user, onLogout }) {
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
          <NavItem to="/" icon={<LuHouse size={20} />} label="DASHBOARD" onClick={() => setIsSidebarOpen(false)} />
          <NavItem to="/history" icon={<LuClock size={20} />} label="HISTORIAL" onClick={() => setIsSidebarOpen(false)} />
          <NavItem to="/appointments" icon={<LuCalendar size={20} />} label="APPOINTMENTS" disabled />
          <NavItem to="/staff" icon={<LuUsers size={20} />} label="STAFF" disabled />
          <NavItem to="/services" icon={<LuScissors size={20} />} label="SERVICES" onClick={() => setIsSidebarOpen(false)} />
          <NavItem to="/inventory" icon={<LuSettings size={20} />} label="INVENTORY" disabled />
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={() => {
              setIsSidebarOpen(false);
              onLogout();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/5 transition-all"
          >
            <LuLogOut size={18} />
            <span className="text-[11px] font-bold tracking-widest uppercase">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Contenedor Principal */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen w-full relative">
        {/* Topbar minimalista — solo para el botón hamburguesa en móvil */}
        <header className="lg:hidden h-16 px-4 flex items-center border-b border-white/5 bg-background">
          <button
            className="w-10 h-10 flex items-center justify-center bg-card border border-white/10 rounded-xl text-white/70 hover:text-white transition-colors"
            onClick={() => setIsSidebarOpen(true)}
          >
            <LuMenu size={22} />
          </button>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-4 lg:pt-2 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

function NavItem({ to, icon, label, disabled, onClick }) {
  if (disabled) {
    return (
      <div className="relative w-full flex items-center gap-4 px-8 py-4 text-white/20 cursor-not-allowed">
        <span>{icon}</span>
        <span className="text-sm font-bold tracking-widest uppercase">{label}</span>
      </div>
    );
  }

  return (
    <NavLink 
      to={to}
      onClick={onClick}
      className={({ isActive }) => `
        relative w-full flex items-center gap-4 px-8 py-4 transition-all duration-300 group
        ${isActive 
          ? 'bg-card/40 text-primary' 
          : 'text-white/50 hover:text-white/90 hover:bg-white/[0.02]'
        }
      `}
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
          )}
          <span className={isActive ? 'text-primary' : 'text-white/40 group-hover:text-white/70'}>{icon}</span>
          <span className="text-sm font-bold tracking-widest uppercase">{label}</span>
        </>
      )}
    </NavLink>
  );
}

