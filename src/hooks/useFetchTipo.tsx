import { useEffect, useRef } from "react";

/**
 * @param urlParametro 
 * @param callbacks 
 * @param TipoUsuarioLojaId 
 * @param TipoUsuarioColaboradorId 
 */
function useFetchTipo<T = void>(
  urlParametro: string | null,
  callbacks: ((params?: T) => void) | ((params?: T) => void)[],
  TipoUsuarioLojaId: string,
  TipoUsuarioColaboradorId: string
): void {
  const prevUrlParametroRef = useRef<string | null>(null);
  useEffect(() => {
    if (urlParametro !== prevUrlParametroRef.current && prevUrlParametroRef.current !== null) {
      if (urlParametro) {
        const tipoId: any | undefined = urlParametro === "Loja" ? TipoUsuarioLojaId : urlParametro === "Colaborador" ? TipoUsuarioColaboradorId
            : undefined;

        if (tipoId !== undefined) {
          const normalizedCallbacks = Array.isArray(callbacks) ? callbacks : [callbacks];
          normalizedCallbacks.forEach((callback) => callback());
        }
      }
    }
    prevUrlParametroRef.current = urlParametro;
  }, [urlParametro, callbacks, TipoUsuarioLojaId, TipoUsuarioColaboradorId]);
}

export default useFetchTipo;
