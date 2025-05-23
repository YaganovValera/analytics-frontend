import React, { createContext, useContext, useEffect, useState } from 'react';
import api, { setAccessToken } from '@api/axios';

type AuthContextType = {
  isAuthenticated: boolean;
  loading: boolean;
  user: { user_id: string; roles: string[] } | null;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  loading: true,
  user: null,
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthContextType['user']>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return;

    try {
      const res = await api.post('/refresh', { refresh_token: refreshToken });
      setAccessToken(res.data.access_token);
    } catch {
      localStorage.removeItem('refresh_token');
    }
  };

  const fetchUser = async () => {
    try {
      const res = await api.get('/me');
      setUser({ user_id: res.data.user_id, roles: res.data.roles });
    } catch {
      setUser(null);
    }
  };

  const init = async () => {
    await refresh();
    await fetchUser();
    setLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  const logout = () => {
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        loading,
        user,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
