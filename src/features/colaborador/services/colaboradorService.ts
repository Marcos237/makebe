import { API_BASE_AGENDA_URL, API_BASE_URL } from "../../../config/apiConfig";
import {
    UrlBuscarPaginado,
    UrlBuscarPermissao,
    UrlBuscarPorIdUsuario,
    UrlColaborador,
} from "../../../constants/Colaborador/colaboradorConstant";
import { UrlUsuarioLogado } from "../../../constants/Usuario/usuarioConstant";
import { ColaboradorItens } from "../../../Interfaces/Colaborador/colaboradorItem";
import { PermissaoItens } from "../../../Interfaces/Colaborador/permissaoItens";
import { PaginacaoItens } from "../../../Interfaces/shared/PaginacaoItens";
import { ResponseItem } from "../../../Interfaces/shared/ResponseItem";
import { UsuarioLoginItens } from "../../../Interfaces/Usuario/UsuarioLoginItens";
import { GetAllService } from "../../../services/shared/getAllService";
import { GetByIdService } from "../../../services/shared/getByIdService";
import { GetPaginadoService } from "../../../services/shared/getPaginadoService";
import { PostService } from "../../../services/shared/postService";

export const buscarColaboradoresPaginado = async (paginacao: PaginacaoItens<ColaboradorItens>) => (
    GetPaginadoService(paginacao, `${API_BASE_AGENDA_URL}${UrlBuscarPaginado}`)
) as Promise<PaginacaoItens<ColaboradorItens>>;

export const buscarUsuarioLogadoColaborador = async () => (
    GetAllService(`${API_BASE_URL}${UrlUsuarioLogado}`)
) as Promise<ResponseItem<UsuarioLoginItens>>;

export const buscarPermissoesColaborador = async () => (
    GetAllService(`${API_BASE_URL}${UrlBuscarPermissao}`)
) as Promise<ResponseItem<PermissaoItens>>;

export const buscarColaboradorPorUsuarioId = async (usuarioId: string) => (
    GetByIdService(usuarioId, `${API_BASE_AGENDA_URL}${UrlColaborador}`)
) as Promise<ResponseItem<ColaboradorItens>>;

export const buscarGestorPorUsuarioId = async (usuarioId: string) => (
    GetByIdService(usuarioId || "0", `${API_BASE_AGENDA_URL}${UrlBuscarPorIdUsuario}`)
) as Promise<ResponseItem<ColaboradorItens>>;

export const salvarColaborador = async (colaborador: ColaboradorItens) => (
    PostService(colaborador, `${API_BASE_AGENDA_URL}${UrlColaborador}`)
);
