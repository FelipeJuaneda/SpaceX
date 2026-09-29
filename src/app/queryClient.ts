import { QueryClient } from "@tanstack/react-query";
import { isNotFound } from "@/services/http";

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // A missing snapshot file will not appear on retry; transient failures might.
        retry: (failures, error) => !isNotFound(error) && failures < 2,
        refetchOnWindowFocus: false,
      },
    },
  });
}

/** Shared by the React tree and route loaders, which prefetch data in parallel with route chunks. */
export const queryClient = createQueryClient();
