import { API_BASE_AGENDA_URL, API_BASE_URL } from "../../../config/apiConfig";
import {
    AgendamentoColaborador,
    UrlAgendamento,
    UrlBuscarPorAno,
    UrlBuscarPorData,
    UrlBuscarPorId as UrlBuscarAgendamentoPorId,
} from "../../../constants/Agendamento/agendamentoConstant";
import { UrlBuscarPorId as UrlBuscarColaboradorPorId } from "../../../constants/Colaborador/colaboradorConstant";
import { BuscarPorColaborador, UrlServico } from "../../../constants/Servicos/servicoConstant";
import { UrlBuscarCliente } from "../../../constants/shared/baseConstant";
import { UrlUsuarioLogado } from "../../../constants/Usuario/usuarioConstant";
import { AgendamentoItem } from "../../../Interfaces/Agendamento/agendamentoItem";
import { ColaboradorItens } from "../../../Interfaces/Colaborador/colaboradorItem";
import { ServicosItens } from "../../../Interfaces/Produto/servicosItens";
import { ResponseItem } from "../../../Interfaces/shared/ResponseItem";
import { UsuarioClienteItem } from "../../../Interfaces/Usuario/usuarioClienteItem";
import { UsuarioLoginItens } from "../../../Interfaces/Usuario/UsuarioLoginItens";
import { DeleteService } from "../../../services/shared/deleteService";
import { GetAllService } from "../../../services/shared/getAllService";
import { GetByIdService } from "../../../services/shared/getByIdService";
import { PostService } from "../../../services/shared/postService";

export const buscarUsuarioLogadoAgendamento = async () => (
    GetAllService(`${API_BASE_URL}${UrlUsuarioLogado}`)
) as Promise<ResponseItem<UsuarioLoginItens>>;

export const buscarColaboradoresAgendamento = async () => (
    GetAllService(`${API_BASE_AGENDA_URL}${AgendamentoColaborador}`)
) as Promise<ResponseItem<ColaboradorItens>>;

export const buscarAgendamentosPorAno = async (ano: string, colaboradorId: number) => (
    GetByIdService(ano, `${API_BASE_AGENDA_URL}${UrlBuscarPorAno}`, colaboradorId)
) as Promise<ResponseItem<AgendamentoItem>>;

export const buscarAgendamentoPorId = async (id: number) => (
    GetByIdService(id, `${API_BASE_AGENDA_URL}${UrlBuscarAgendamentoPorId}`)
) as Promise<ResponseItem<AgendamentoItem>>;

export const buscarAgendamentosPorData = async (data: string, colaboradorId: number) => (
    GetByIdService(data, `${API_BASE_AGENDA_URL}${UrlBuscarPorData}`, colaboradorId)
) as Promise<ResponseItem<AgendamentoItem>>;

export const removerAgendamento = async (id: number) => (
    DeleteService(id, `${API_BASE_AGENDA_URL}${UrlAgendamento}`)
) as Promise<ResponseItem<AgendamentoItem>>;

export const buscarColaboradorPorId = async (id: number) => (
    GetByIdService(id, `${API_BASE_AGENDA_URL}${UrlBuscarColaboradorPorId}`)
) as Promise<ResponseItem<ColaboradorItens>>;

export const buscarServicosAgendamento = async () => (
    GetAllService(`${API_BASE_AGENDA_URL}${UrlServico}`)
) as Promise<ResponseItem<ServicosItens>>;

export const buscarServicosAgendamentoPorColaborador = async (idColaborador: number) => (
    GetByIdService(idColaborador, `${API_BASE_AGENDA_URL}${BuscarPorColaborador}`)
) as Promise<ResponseItem<ServicosItens>>;

export const buscarClientesAgendamento = async (term: string) => (
    GetByIdService(term, `${API_BASE_URL}${UrlBuscarCliente}`)
) as Promise<ResponseItem<UsuarioClienteItem>>;

export const salvarAgendamento = async (agendamento: AgendamentoItem) => (
    PostService(agendamento, `${API_BASE_AGENDA_URL}${UrlAgendamento}`)
);
