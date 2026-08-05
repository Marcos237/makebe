import { Dayjs } from "dayjs";

export interface AgendamentoItem {
  id: number;
  idLoja?: number;
  razaoSocial?: string;
  idAgendaColaborador?: number;
  idColaborador?: string;
  nomeColaborador?: string;
  idServico?: number;
  descricaoServico?: string;
  idUsuario?: string;
  nomeUsuario?: string;
  nomeCliente?: string;
  telefoneCliente?: string;
  dataInicioAgendamentoExtenso?: string;
  dataInicioAgendamento?: Dayjs
  dataTerminoAgendamento?: Dayjs
  dataTerminoAgendamentoExtenso?: string;
  ativo: boolean;
  urlImagem?: string;
  data?:string;
}
