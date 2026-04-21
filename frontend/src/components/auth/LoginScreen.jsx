import { useState } from 'react';
import { LuScissors, LuLoader, LuTriangleAlert } from 'react-icons/lu';

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onLogin(email, password);
    } catch (err) {
      setError(err.message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  // Quick login buttons para desarrollo
  const quickLogins = [
    { name: 'Juan Carlos', email: 'juancarlos@brabus.com', password: 'Brabus2024!' },
    { name: 'Miguel Ángel', email: 'miguel@brabus.com', password: 'Brabus2024!' },
    { name: 'Admin', email: 'admin@brabus.com', password: 'BrabusAdmin2024!' },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-[0_0_40px_rgba(212,175,55,0.2)]">
            <LuScissors size={28} className="text-background stroke-[2.5]" />
          </div>
          <h1 className="text-3xl font-black text-primary tracking-wider">BRABUS</h1>
          <p className="text-white/40 text-[10px] tracking-[0.3em] uppercase font-bold mt-1">Premium Grooming</p>
        </div>

        {/* Login Card */}
        <div className="bg-[#131313] rounded-[2rem] p-8 border border-white/5 shadow-2xl">
          <h2 className="text-white text-xl font-extrabold mb-1">Bienvenido</h2>
          <p className="text-white/40 text-sm mb-8">Inicia sesión para acceder a tu turno</p>

          {error && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
              <LuTriangleAlert size={18} className="text-red-500 shrink-0" />
              <span className="text-red-400 text-sm font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-white/50 text-[11px] font-bold tracking-widest uppercase ml-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@brabus.com"
                required
                className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl py-4 px-5 text-white font-medium outline-none focus:border-primary/50 transition-colors placeholder:text-white/20"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-white/50 text-[11px] font-bold tracking-widest uppercase ml-1">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl py-4 px-5 text-white font-medium outline-none focus:border-primary/50 transition-colors placeholder:text-white/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-primary text-background font-extrabold text-sm tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <LuLoader size={18} className="animate-spin" />
                  Entrando...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>
        </div>

        {/* Quick Login (Dev Only) */}
        <div className="mt-6 bg-[#131313] rounded-[1.5rem] p-6 border border-white/5">
          <p className="text-white/30 text-[10px] tracking-widest uppercase font-bold mb-4 text-center">Acceso Rápido</p>
          <div className="flex flex-col gap-2">
            {quickLogins.map((ql) => (
              <button
                key={ql.email}
                onClick={() => { setEmail(ql.email); setPassword(ql.password); }}
                className="w-full py-3 px-4 rounded-xl bg-[#1A1A1A] border border-white/5 text-white/60 text-sm font-bold hover:border-primary/30 hover:text-primary transition-all text-left flex items-center justify-between"
              >
                <span>{ql.name}</span>
                <span className="text-white/20 text-xs">{ql.email}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
