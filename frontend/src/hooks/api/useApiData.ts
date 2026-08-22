import { AxiosError, AxiosInstance } from 'axios';
import { useCallback, useEffect, useReducer } from 'react';
import { useAuth } from './useAuth';

interface State<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}
type Action<T> =
  | { type: 'FETCH_INIT' }
  | { type: 'FETCH_SUCCESS'; payload: T }
  | { type: 'FETCH_FAILURE'; payload: string };

const apiReducer = <T>(state: State<T>, action: Action<T>): State<T> => {
  switch (action.type) {
    case 'FETCH_INIT':
      return { data: null, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { data: action.payload, loading: false, error: null };
    case 'FETCH_FAILURE':
      return { data: null, loading: false, error: action.payload };
    default:
      throw new Error('Unexpected error occured');
  }
};

export const useApiData = <T>(apiInstance: AxiosInstance, endpoint: string | null) => {
  const { isAuthenticated } = useAuth();
  const [state, dispatch] = useReducer(apiReducer as (s: State<T>, a: Action<T>) => State<T>, {
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(
    async (abortSignal: AbortSignal) => {
      if (endpoint === null) return;

      dispatch({ type: 'FETCH_INIT' });
      try {
        const response = await apiInstance.get<T>(endpoint, { signal: abortSignal });
        dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
      } catch (err) {
        if (err instanceof AxiosError && err.name !== 'CanceledError') {
          dispatch({ type: 'FETCH_FAILURE', payload: 'Failed to fetch data' });
        }
      }
    },
    [endpoint, apiInstance],
  );

  useEffect(() => {
    if (!isAuthenticated || endpoint === null) {
      dispatch({ type: 'FETCH_SUCCESS', payload: null as T });
      return;
    }

    const controller = new AbortController();
    fetchData(controller.signal);

    return () => {
      controller.abort();
    };
  }, [isAuthenticated, endpoint, fetchData]);

  return { ...state, refetch: () => fetchData(new AbortController().signal) };
};
