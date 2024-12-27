import { NotificationItens } from "./NotificationItens";


export interface PaginacaoItens<T> {

    quantidadePagina?: number;
    totalPaginas?: number;
    paginaAtual?: number;
    total?: number;
    objetoPesquisa?: T;
    objetos?: Array<T>;
    notifications?: NotificationItens[]

}