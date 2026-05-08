import { API_BASE_AGENDA_URL } from "../../../config/apiConfig";
import { UrlBuscarPaginado, UrlEndereco } from "../../../constants/Endereco/enderecoConstants";
import { EnderecoItens } from "../../../Interfaces/Endereco/enderecoItens";
import { PaginacaoItens } from "../../../Interfaces/shared/PaginacaoItens";
import { ResponseItem } from "../../../Interfaces/shared/ResponseItem";
import { BuscarDadosCorreios } from "../../../services/shared/correioService";
import { DeleteService } from "../../../services/shared/deleteService";
import { GetByIdService } from "../../../services/shared/getByIdService";
import { GetPaginadoService } from "../../../services/shared/getPaginadoService";
import { PostService } from "../../../services/shared/postService";

export const buscarEnderecosPaginado = async (paginacao: PaginacaoItens<EnderecoItens>) => (
    GetPaginadoService(paginacao, `${API_BASE_AGENDA_URL}${UrlBuscarPaginado}`)
) as Promise<PaginacaoItens<EnderecoItens>>;

export const buscarEnderecoPorId = async (id: number) => (
    GetByIdService(id, `${API_BASE_AGENDA_URL}${UrlEndereco}`)
) as Promise<ResponseItem<EnderecoItens>>;

export const removerEndereco = async (id: number) => (
    DeleteService(id, `${API_BASE_AGENDA_URL}${UrlEndereco}`)
);

export const salvarEndereco = async (endereco: EnderecoItens) => (
    PostService(endereco, `${API_BASE_AGENDA_URL}${UrlEndereco}`)
);

export const buscarDadosCorreiosEndereco = async (cep: string) => BuscarDadosCorreios(cep);
