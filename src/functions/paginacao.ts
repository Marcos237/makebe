import { PaginacaoItens } from '../Interfaces/shared/PaginacaoItens';

  
  export const paginar = <T>(
    pagina: T | PaginacaoItens<T> | undefined, 
    page: number = 1
  ): PaginacaoItens<T> => {
    let paginacao: PaginacaoItens<T>;
  
    if (pagina && (pagina as PaginacaoItens<T>).quantidadePagina !== undefined) {
      const paginaCompleta = pagina as PaginacaoItens<T>;
      paginacao = {
        quantidadePagina: paginaCompleta.quantidadePagina || 6,
        paginaAtual: page,
        totalPaginas: paginaCompleta.totalPaginas || 1,
        total: paginaCompleta.total || 0,
        objetoPesquisa: paginaCompleta.objetoPesquisa || undefined,
        objetos: paginaCompleta.objetos || [],
      };
    } else {

        paginacao = {
            quantidadePagina: 6,
            paginaAtual: page,
            totalPaginas: 1,
            total: 0,
            objetoPesquisa: pagina ? (pagina as T) : undefined,
            objetos: [],
          };
    }
  
    return paginacao;
  };
  