import axios from 'axios';
import { useMemo } from 'react';
import { useAuth } from './useAuth';

const BASE_URL = 'http://localhost:8000';

export const createApiHook = (basePath: string) => {
  const useApi = () => {
    const { getToken, handleAuthError } = useAuth();

    return useMemo(() => {
      const client = axios.create({
        baseURL: `${BASE_URL}${basePath}`,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      client.interceptors.request.use((config) => {
        const token = getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      });

      client.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.response?.status === 401) {
            handleAuthError();
          }
          return Promise.reject(error);
        },
      );

      return client;
    }, [getToken, handleAuthError]);
  };

  return useApi;
};
