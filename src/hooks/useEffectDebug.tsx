// utils-debug.ts
import { useEffect, useRef } from "react";

export const tap = <T extends (...a: any[]) => any>(nome: string, fn: T): T =>
  ((...args: any[]) => {
    console.count(`[CALL] ${nome}`);
    console.trace(`[TRACE] ${nome}`);
    return fn(...args);
  }) as T;

export function useEffectDebug(tag: string, deps: any[]) {
  const prev = useRef<any[] | null>(null);
  useEffect(() => {
    if (prev.current) {
      const diffs = deps
        .map((d, i) => ({ i, changed: d !== prev.current![i], prev: prev.current![i], next: d }))
        .filter(x => x.changed);
      if (diffs.length) console.log(`[DEPS] ${tag} mudou:`, diffs);
    } else {
      console.log(`[DEPS] ${tag} (primeira vez)`);
    }
    prev.current = deps;
  }, deps);
}
