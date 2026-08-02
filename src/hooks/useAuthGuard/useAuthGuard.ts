import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";

import { ApiError } from "@/lib/api";
import { clearSession } from "@/lib/authStore";

export function useAuthGuard(redirectTo: string) {
  const navigate = useNavigate();

  return useCallback(
    (err: unknown) => {
      if (err instanceof ApiError && err.status === 401) {
        clearSession();
        navigate({ to: "/login", search: { redirect: redirectTo } });
        return true;
      }
      return false;
    },
    [navigate, redirectTo],
  );
}
