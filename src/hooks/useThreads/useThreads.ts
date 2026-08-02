import { useCallback, useEffect, useState } from "react";
import { getThreads, subscribeToStore, type Thread } from "@/lib/chatStore";

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
