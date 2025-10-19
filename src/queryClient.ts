import { QueryClient } from '@tanstack/react-query';

type RetryError =
  | {
      type?: string;
      status?: number;
      message?: string;
    }
  | Error
  | null;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error: RetryError) => {
        if (failureCount >= 3) return false;

        // Don't retry on certain error types
        if (error && 'type' in error && error.type === 'parse') return false;
        if (error && 'status' in error && error.status === 404) return false;
        if (error && 'status' in error && error.status === 403) return false;

        return true;
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
});

export default queryClient;
