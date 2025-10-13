import axios, { AxiosInstance } from 'axios';

const BASE_URL = 'http://localhost:8000';

interface AuthHelpers {
  getToken: () => string | null;
  handleAuthError: () => void;
}

export const createApiClient = (basePath: string, authHelpers: AuthHelpers): AxiosInstance => {
  const { getToken, handleAuthError } = authHelpers;

  const client = axios.create({
    baseURL: `${BASE_URL}${basePath}`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  client.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

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
};
