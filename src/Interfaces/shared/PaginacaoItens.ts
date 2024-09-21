export interface PaginacaoItens<T> {
    quantidadePagina : number,
    totalPaginas : number,
    total : number,
    objetoPesquisa: T | null;
}