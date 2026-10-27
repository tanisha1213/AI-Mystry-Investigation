import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiGetMe, apiLogin, apiRegister, apiLogout } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [guestId, setGuestId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await apiGetMe();
        if (res.user) {
          setUser(res.user);
        }
        if (res.guestSessionId) {
          setGuestId(res.guestSessionId);
        }
      } catch {
        // Guest mode fallback
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await apiLogin({ email, password });
    setUser(res.user);
    return res;
  };

  const register = async (name, email, password) => {
    const res = await apiRegister({ name, email, password });
    setUser(res.user);
    return res;
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, guestId, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
