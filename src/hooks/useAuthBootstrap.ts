import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

/**
 * Initialize login state once so that routes can rely on `initialized`.
 */
export const useAuthBootstrap = () => {
  const initialized = useAuthStore((state) => state.initialized);
  const loading = useAuthStore((state) => state.loading);
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);

  useEffect(() => {
    if (!initialized && !loading) {
      void fetchCurrentUser();
    }
  }, [initialized, loading, fetchCurrentUser]);
};

