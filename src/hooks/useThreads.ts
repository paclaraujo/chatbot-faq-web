import { useCallback, useEffect, useState } from "react";
import { getThreads, subscribeToStore, type Thread } from "@/lib/chatStore";

/** Reads threads from localStorage and keeps them in sync with store updates. */
export function useThreads() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const refresh = useCallback(() => setThreads(getThreads()), []);

  useEffect(() => {
    refresh();
    setHydrated(true);
    return subscribeToStore(refresh);
  }, [refresh]);

  return { threads, hydrated, refresh };
}
