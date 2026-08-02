import { useEffect, useState } from "react";

import { getAuthEmail, subscribeToAuth } from "@/lib/authStore";

/** Tracks the logged-in user's email, staying in sync across tabs/logout. */
export function useAuthEmail(): string | null {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const refresh = () => setEmail(getAuthEmail());
    refresh();
    return subscribeToAuth(refresh);
  }, []);

  return email;
}