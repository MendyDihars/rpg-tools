import { useMemo, useRef } from "react";

export default function useSafeStorage() {
  const storageRef = useRef(Storage.prototype);
  if (!storageRef.current) storageRef.current = sessionStorage;
  return useMemo(() => {
    try {
      const testKey = "__test_ls__";
      localStorage.setItem(testKey, "1");
      localStorage.removeItem(testKey);
      return localStorage;
    } catch {
      return sessionStorage;
    }
  }, []);
}