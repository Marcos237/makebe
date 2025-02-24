import { useEffect, useRef, useMemo } from "react";

/**
 * @param callbacks 
 * @param dependencies 
 * @param params 
 */
function useUpdateFetch<T = void>(
  callbacks: ((params: T) => void)[], 
  dependencies: unknown[] = [], 
  params?: T
): void {
    const hasFetchedData = useRef(false);

    const stableDeps = useMemo(() => [...dependencies], [dependencies]);

    useEffect(() => {
        if (!hasFetchedData.current) {
            callbacks.forEach((callback) => callback(params as T));
            hasFetchedData.current = true;
        }
    }, [callbacks, params, stableDeps]); 
}

export default useUpdateFetch;
