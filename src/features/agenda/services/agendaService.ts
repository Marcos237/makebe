import { API_BASE_AGENDA_URL, API_BASE_URL } from "../../../config/apiConfig";
import { UrlAgenda, UrlBuscarPaginado } from "../../../constants/Agenda/agendaConstant";
import { UrlColaborador } from "../../../constants/Colaborador/colaboradorConstant";
import { UrlLoja } from "../../../constants/Loja/lojaConstant";
import { UrlUsuarioLogado } from "../../../constants/Usuario/usuarioConstant";
import { AgendaItens } from "../../../Interfaces/Agenda/AgendaItens";
import { ColaboradorItens } from "../../../Interfaces/Colaborador/colaboradorItem";
import { LojaItens } from "../../../Interfaces/Loja/lojaItens";
import { PaginacaoItens } from "../../../Interfaces/shared/PaginacaoItens";
import { ResponseItem } from "../../../Interfaces/shared/ResponseItem";
import { DeleteService } from "../../../services/shared/deleteService";
import { GetAllService } from "../../../services/shared/getAllService";
import { GetByIdService } from "../../../services/shared/getByIdService";
import { GetPaginadoService } from "../../../services/shared/getPaginadoService";
import { PostService } from "../../../services/shared/postService";
import { UsuarioLoginItens } from "../../../Interfaces/Usuario/UsuarioLoginItens";

export const buscarAgendaPaginada = async (paginacao: PaginacaoItens<AgendaItens>) => (
    GetPaginadoService(paginacao, `${API_BASE_AGENDA_URL}${UrlBuscarPaginado}`)
) as Promise<PaginacaoItens<AgendaItens>>;

export const buscarUsuarioLogado = async () => (
    GetAllService(`${API_BASE_URL}${UrlUsuarioLogado}`)
) as Promise<ResponseItem<UsuarioLoginItens>>;

export const buscarLojasAgenda = async () => (
    GetAllService(`${API_BASE_AGENDA_URL}${UrlLoja}`)
) as Promise<ResponseItem<LojaItens>>;

export const buscarColaboradoresAgenda = async () => (
    GetAllService(`${API_BASE_AGENDA_URL}${UrlColaborador}`)
) as Promise<ResponseItem<ColaboradorItens>>;

export const buscarAgendaPorId = async (id: number, tipo?: number) => (
    GetByIdService(id, `${API_BASE_AGENDA_URL}${UrlAgenda}`, tipo)
) as Promise<ResponseItem<AgendaItens>>;

export const salvarAgenda = async (agenda: AgendaItens) => (
    PostService(agenda, `${API_BASE_AGENDA_URL}${UrlAgenda}`)
);

export const removerAgenda = async (id: number) => (
    DeleteService(id, `${API_BASE_AGENDA_URL}${UrlAgenda}`)
);
