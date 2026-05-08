import { API_BASE_AGENDA_URL, API_BASE_URL } from "../../../config/apiConfig";
import { UrlColaborador } from "../../../constants/Colaborador/colaboradorConstant";
import {
    UrlBuscarPaginado,
    UrlColaboradorProfissional,
    UrlServico,
    urlPersistir,
} from "../../../constants/ColaboradorProfissional/colaboradorProfissionalConstant";
import { UrlLoja } from "../../../constants/Loja/lojaConstant";
import { UrlUsuarioLogado } from "../../../constants/Usuario/usuarioConstant";
import { ColaboradorItens } from "../../../Interfaces/Colaborador/colaboradorItem";
import { ColaboradorProfissionalItem } from "../../../Interfaces/ColaboradorProfissional/colaboradorProfissionalItem";
import { LojaItens } from "../../../Interfaces/Loja/lojaItens";
import { ServicosItens } from "../../../Interfaces/Produto/servicosItens";
import { PaginacaoItens } from "../../../Interfaces/shared/PaginacaoItens";
import { ResponseItem } from "../../../Interfaces/shared/ResponseItem";
import { UsuarioLoginItens } from "../../../Interfaces/Usuario/UsuarioLoginItens";
import { DeleteService } from "../../../services/shared/deleteService";
import { GetAllService } from "../../../services/shared/getAllService";
import { GetByIdService } from "../../../services/shared/getByIdService";
import { GetPaginadoService } from "../../../services/shared/getPaginadoService";
import { PostService } from "../../../services/shared/postService";

export const buscarColaboradoresProfissionaisPaginado = async (paginacao: PaginacaoItens<ColaboradorProfissionalItem>) => (
    GetPaginadoService(paginacao, `${API_BASE_AGENDA_URL}${UrlBuscarPaginado}`)
) as Promise<PaginacaoItens<ColaboradorProfissionalItem>>;

export const buscarUsuarioLogadoColaboradorProfissional = async () => (
    GetAllService(`${API_BASE_URL}${UrlUsuarioLogado}`)
) as Promise<ResponseItem<UsuarioLoginItens>>;

export const buscarColaboradoresParaProfissional = async () => (
    GetAllService(`${API_BASE_AGENDA_URL}${UrlColaborador}`)
) as Promise<ResponseItem<ColaboradorItens>>;

export const buscarLojasParaProfissional = async () => (
    GetAllService(`${API_BASE_AGENDA_URL}${UrlLoja}`)
) as Promise<ResponseItem<LojaItens>>;

export const buscarServicosParaProfissional = async () => (
    GetAllService(`${API_BASE_AGENDA_URL}${UrlServico}`)
) as Promise<ResponseItem<ServicosItens>>;

export const buscarColaboradorProfissionalPorId = async (id: number) => (
    GetByIdService(id, `${API_BASE_AGENDA_URL}${UrlColaboradorProfissional}`)
) as Promise<ResponseItem<ColaboradorProfissionalItem>>;

export const removerColaboradorProfissional = async (id: number) => (
    DeleteService(id, `${API_BASE_AGENDA_URL}${UrlColaboradorProfissional}`)
);

export const salvarColaboradorProfissional = async (item: ColaboradorProfissionalItem) => (
    PostService(item, `${API_BASE_AGENDA_URL}${urlPersistir}`)
);
