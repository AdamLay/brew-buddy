import { QueryClient } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

// Shared QueryClient instance (one per request in SSR)
let queryClient: ReturnType<typeof createQueryClient> | undefined;

export function getQueryClient() {
  if (typeof window === "undefined") {
    return (queryClient ??= createQueryClient());
  }
  // Client-side: always use the singleton
  return (queryClient ??= createQueryClient());
}

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
      },
    },
  });
}

export function getRouter() {
  // QueryClient is created lazily via getQueryClient() in __root.tsx
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
  });

  return router;
}

// Hook to access the QueryClient from anywhere
export function useQueryClient() {
  const queryClient = getQueryClient();
  return queryClient;
}
