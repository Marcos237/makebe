export interface HoraAgendadaItem {
    id?: number;
    name?: string;
    descricaoServico?: string;
    data?: string;
    dataInicio?: Array<string>
    dataFim?: Array<string>;
    tooltipItem?: string;
    idColaborador?: string;
}
