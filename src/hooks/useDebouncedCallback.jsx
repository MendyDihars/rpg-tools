import { useCallback, useRef } from "react";

export default function useDebouncedCallback(fn, ms = 150) {
  const t = useRef(null);
  return useCallback((...args) => {
    if (t.current) clearTimeout(t.current);
    t.current = setTimeout(() => fn(...args), ms);
  }, [fn, ms]);
}
