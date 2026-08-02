import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useAuthEmail } from "@/hooks/useAuthEmail";
import { clearSession, setSession } from "@/lib/authStore";

describe("useAuthEmail", () => {
  it("returns null when there is no session", () => {
    const { result } = renderHook(() => useAuthEmail());
    expect(result.current).toBeNull();
  });

  it("reflects the current session email and updates on change", () => {
    const { result } = renderHook(() => useAuthEmail());

    act(() => {
      setSession("tok", "user@example.com");
    });
    expect(result.current).toBe("user@example.com");

    act(() => {
      clearSession();
    });
    expect(result.current).toBeNull();
  });
});
