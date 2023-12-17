'use client';

import { useMemo } from 'react';
import {
  QueryClient,
  QueryClientProvider,
  HydrationBoundary,
} from '@tanstack/react-query';

export function TanstackProvider(props: WithChildren) {
  const queryClient = useMemo(() => new QueryClient(), []);

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary queryClient={queryClient}>
        {props.children}
      </HydrationBoundary>
    </QueryClientProvider>
  );
}
