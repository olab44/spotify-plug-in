// in src/hooks/useAuth.ts
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const navigate = useNavigate();

  const getToken = useCallback(() => localStorage.getItem('access_token'), []);

  const setToken = useCallback((token: string, expiresIn?: string) => {
    localStorage.setItem('access_token', token);
    if (expiresIn) localStorage.setItem('expires_in', expiresIn);
  }, []);

  const clearToken = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('expires_in');
  }, []);

  const handleAuthError = useCallback(() => {
    clearToken();
    navigate('/');
  }, [clearToken, navigate]);

  const isAuthenticated = !!getToken();

  return {
    getToken,
    setToken,
    clearToken,
    handleAuthError,
    isAuthenticated,
  };
};
