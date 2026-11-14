"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type CartCtx = { ids: string[]; toggle: (id: string) => void; remove: (id: string) => void; ready: boolean };
const Ctx = createContext<CartCtx>({ ids: [], toggle: () => {}, remove: () => {}, ready: false });
const KEY = "cart-v1";

/** Troli pratonton Fasa 3: disimpan dalam pelayar sahaja, tiada bayaran sebenar. */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) setIds(parsed.filter((x) => typeof x === "string"));
    } catch {}
    setReady(true);
  }, []);

  const save = useCallback((next: string[]) => {
    setIds(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
  }, []);

  const toggle = useCallback((id: string) => save(ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]), [ids, save]);
  const remove = useCallback((id: string) => save(ids.filter((x) => x !== id)), [ids, save]);
  const value = useMemo(() => ({ ids, toggle, remove, ready }), [ids, toggle, remove, ready]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useCart = () => useContext(Ctx);
