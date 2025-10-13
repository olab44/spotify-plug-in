import { useMemo } from 'react';
import { createApiClient } from './apiClient';
import { useAuth } from './useAuth';

export const createApiHook = (basePath: string) => {
  const useApi = () => {
    const { getToken, handleAuthError } = useAuth();

    const apiClient = useMemo(
      () => createApiClient(basePath, { getToken, handleAuthError }),
      [getToken, handleAuthError],
    );

    return apiClient;
  };

  return useApi;
};
