import { useCallback, useEffect, useState } from "react";
import {
  getThreads,
  seedDemoData,
  subscribeToStore,
  type Thread,
} from "@/lib/chat-store";

/** Reads threads from localStorage and keeps them in sync with store updates. */
export function useThreads() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const refresh = useCallback(() => setThreads(getThreads()), []);

  useEffect(() => {
    seedDemoData();
    refresh();
    setHydrated(true);
    return subscribeToStore(refresh);
  }, [refresh]);

  return { threads, hydrated, refresh };
}
