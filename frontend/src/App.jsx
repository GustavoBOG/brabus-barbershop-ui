import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import Home from './components/home/Home';
import LoginScreen from './components/auth/LoginScreen';
import History from './components/history/History';
import Services from './components/services/Services';
import { authApi } from './services/api';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar si hay sesión guardada al cargar
  useEffect(() => {
    const initAuth = async () => {
      const savedUser = localStorage.getItem('brabus_user');
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          
          // Si no tiene el rol, intentamos recuperarlo del servidor
          if (!parsedUser.role) {
            const profile = await authApi.getProfile(parsedUser.id);
            const fullUser = { ...parsedUser, ...profile };
            setUser(fullUser);
            localStorage.setItem('brabus_user', JSON.stringify(fullUser));
          } else {
            setUser(parsedUser);
          }
        } catch (error) {
          console.error('Error initializing auth:', error);
          localStorage.removeItem('brabus_user');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const handleLogin = async (email, password) => {
    const data = await authApi.login(email, password);
    const userData = data.user;
    setUser(userData);
    localStorage.setItem('brabus_user', JSON.stringify(userData));
    localStorage.setItem('brabus_session', JSON.stringify(data.session));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('brabus_user');
    localStorage.removeItem('brabus_session');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <LoginScreen onLogin={handleLogin} /> : <Navigate to="/" />} 
        />
        
        <Route 
          path="/" 
          element={
            user ? (
              <DashboardLayout user={user} onLogout={handleLogout}>
                <Home user={user} />
              </DashboardLayout>
            ) : (
              <Navigate to="/login" />
            )
          } 
        />

        <Route 
          path="/history" 
          element={
            user ? (
              <DashboardLayout user={user} onLogout={handleLogout}>
                <History user={user} />
              </DashboardLayout>
            ) : (
              <Navigate to="/login" />
            )
          } 
        />

        <Route 
          path="/services" 
          element={
            user ? (
              <DashboardLayout user={user} onLogout={handleLogout}>
                <Services user={user} />
              </DashboardLayout>
            ) : (
              <Navigate to="/login" />
            )
          } 
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
