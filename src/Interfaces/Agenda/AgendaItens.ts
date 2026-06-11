import { AgendaSemanaItens } from "./AgendaSemanaItens";

export interface AgendaItens {
    id?: number;
    razaoSocial?: string;
    nome?: string;
    descricao?: string;
    agendaAbertaInicio?: string;
    agendaAbertaFim?: string;
    IsBloqueadoHoje?: boolean;
    isBloqueadoHoje?: boolean;
    isTodoDia?: boolean;
    idAgendaSemanaInicio?: number;
    idAgendaSemanaFim?: number;
    agendaBloqueadaInicio?: string;
    agendaBloqueadaFim?: string;
    agendasSemana?: Array<AgendaSemanaItens>;
    diaInicioSemana?: string;
    diaSemanaFim?: string;
    tipo?: number;
    idLoja?: number,
    idColaborador?: number;
}
