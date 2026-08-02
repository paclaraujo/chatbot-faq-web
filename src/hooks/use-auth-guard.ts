import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";

import { ApiError } from "@/lib/api";
import { clearSession } from "@/lib/auth-store";

/**
 * Returns a handler for API errors that clears a stale session and redirects
 * to /login when the API responds with 401. Call it from a catch block and
 * bail out early when it returns true.
 */
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
