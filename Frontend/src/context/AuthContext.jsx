import { createContext, useState, useContext, useEffect } from 'react';
import { getCurrentUser, loginUser, registerUser, logoutUser } from '../api/auth.api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await getCurrentUser();
      setUser(response.data.data);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await loginUser({ email, password });
    localStorage.setItem('accessToken', response.data.data.accessToken);
    setUser(response.data.data.user);
    return response.data.data;
  };

  const register = async (userData) => {
    const response = await registerUser(userData);
    localStorage.setItem('accessToken', response.data.data.accessToken);
    setUser(response.data.data.user);
    return response.data.data;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      localStorage.removeItem('accessToken');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
