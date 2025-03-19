import { useCallback } from "react";

import { queryClient } from "@/lib/query-client";

export function useReset({ nutritionistId }: { nutritionistId: string }) {
  const reset = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ["consults", nutritionistId],
    });
    queryClient.invalidateQueries({
      queryKey: ["consults-modal"],
    });
    queryClient.refetchQueries({
      queryKey: ["consults", nutritionistId],
    });
    queryClient.refetchQueries({
      queryKey: ["consults-modal"],
    });
  }, [nutritionistId]);

  return {
    reset,
  };
}
