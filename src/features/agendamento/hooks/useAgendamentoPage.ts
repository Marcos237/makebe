import { useCallback, useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { SelectChangeEvent } from "@mui/material/Select";
import { mapToSelectItens } from "../../../functions/mapToSelectItens";
import { formatarData } from "../../../functions/formatDataHora";
import { useHiddenItem } from "../../../hooks/useHiddenItem";
import useUpdateFetch from "../../../hooks/useUpdateFetch";
import { AgendamentoItem } from "../../../Interfaces/Agendamento/agendamentoItem";
import { HoraAgendadaItem } from "../../../Interfaces/Agendamento/horaAgendadaItem";
import { ColaboradorItens } from "../../../Interfaces/Colaborador/colaboradorItem";
import { CalendarioItem } from "../../../Interfaces/shared/calendarioItem";
import { PersistirItens } from "../../../Interfaces/shared/persistirItens";
import { SelectItens } from "../../../Interfaces/shared/selectItens";
import { UsuarioLoginItens } from "../../../Interfaces/Usuario/UsuarioLoginItens";
import {
    buscarAgendamentoPorId,
    buscarAgendamentosPorAno,
    buscarAgendamentosPorData,
    buscarColaboradoresAgendamento,
    buscarUsuarioLogadoAgendamento,
    removerAgendamento,
} from "../services/agendamentoService";

export const useAgendamentoPage = () => {
    const [usuarioLogado, setUsuarioLogado] = useState<UsuarioLoginItens>();
    const [agendamentoItem, setAgendamentoItem] = useState<AgendamentoItem>();
    const [anoItem, setAnoItem] = useState<Number>();
    const [colaboradorId, setColaboradorId] = useState<Number>();
    const [imagem, setImagem] = useState<string>("");
    const [colaboradores, setColaboradores] = useState<Array<SelectItens>>();
    const [isHiddenItem, setIsHiddenItem] = useState(true);
    const [horasAgendadas, setHorasAgendadas] = useState<HoraAgendadaItem[]>([]);
    const [isHoraOpen, setIsHoraOpen] = useState<boolean>(false);
    const [isLeitura, setIsLeitura] = useState<boolean>(true);
    const [mesSelected, setMesSelected] = useState<number>(0);
    const [isReadOnly, setIsReadOnly] = useState<boolean>(true);
    const [isDayItem, setIsDayItem] = useState<boolean>(true);
    const [selectedDateParam, setSelectedDateParam] = useState<string>("");
    const currentYear = dayjs().year();

    useHiddenItem("lista", "persistir", isHiddenItem);

    const mapAgendamentosToHoras = useCallback((agendamentos?: AgendamentoItem[]) => {
        if (!agendamentos) return [];

        return agendamentos.map((a) => {
            const ini = dayjs(a.dataInicioAgendamento as any);
            const fim = dayjs(a.dataTerminoAgendamento as any);
            const nomeCliente = a.nomeCliente ?? a.nomeUsuario ?? "";

            return {
                id: a.id ?? 0,
                name: nomeCliente,
                nomeCliente,
                telefoneCliente: a.telefoneCliente ?? "",
                descricaoServico: a.descricaoServico ?? "",
                data: ini.isValid() ? ini.format("DD/MM/YYYY") : "",
                dataInicio: ini.isValid() ? [ini.format("HH:mm")] : [],
                dataFim: fim.isValid() ? [fim.format("HH:mm")] : [],
                tooltipItem: "editar",
                idColaborador: a.idColaborador ?? "",
            };
        });
    }, []);

const criarHoraAgendadaPadrao = useCallback((data?: string, id?: number): HoraAgendadaItem[] => {
        const dataPadrao = dayjs(data, "DD/MM/YYYY", true);
        const dataSelecionada = dataPadrao.isValid()
            ? dataPadrao.format("DD/MM/YYYY")
            : dayjs().format("DD/MM/YYYY");

        return [{
            id: 1,
            data: dataSelecionada,
            dataInicio: [dataSelecionada],
            dataFim: [],
            idColaborador: id?.toString() ?? String(colaboradorId ?? "0"),
            name: "",
            nomeCliente: "",
            telefoneCliente: "",
            descricaoServico: "",
            tooltipItem: "salvar",
        }];
    }, [colaboradorId]);

    const limparCamposAgendamento = useCallback((dataSelecionada?: Dayjs | null, id?: string) => {
        setAgendamentoItem((prev) => ({
            ...prev,
            id: prev?.id ?? 0,
            nomeUsuario: "",
            nomeCliente: "",
            telefoneCliente: "",
            descricaoServico: "",
            idServico: 0,
            dataInicioAgendamento: dataSelecionada ?? prev?.dataInicioAgendamento,
            dataTerminoAgendamento: undefined,
            idColaborador: id ?? prev?.idColaborador ?? "0",
            ativo: true,
            urlImagem: imagem,
        }));
    }, [imagem]);

    const agendamentoData = useCallback(async () => {
        if (isDayItem) {
            setIsDayItem(true);
            return;
        }

        const anoCuston = Number(anoItem);
        const ano = (Number.isFinite(anoCuston) && anoCuston !== 0 ? anoCuston : currentYear).toString();
        const idColaborador = Number(colaboradorId ?? 0) ?? 0;
        const response = await buscarAgendamentosPorAno(ano, idColaborador);

        if (!response.datas) {
            setHorasAgendadas([]);
            return;
        }

        setIsReadOnly(false);
        setHorasAgendadas(mapAgendamentosToHoras(response.datas));
        setIsDayItem(true);
    }, [anoItem, colaboradorId, currentYear, isDayItem, mapAgendamentosToHoras]);

    const fetchColaboradorData = useCallback(async () => {
        const colaboradorResponse = await buscarColaboradoresAgendamento();
        const itensSelect = mapToSelectItens(colaboradorResponse?.datas, "id", "nome", "urlImagem", true);
        const persistirPropsColaborador: PersistirItens<ColaboradorItens> = {
            selectItems: itensSelect,
            name: "colaborador",
            onSave: agendamentoData,
        };

        setColaboradores(persistirPropsColaborador.selectItems ?? []);
    }, [agendamentoData]);

    const usuarioData = useCallback(async () => {
        const sessao = await buscarUsuarioLogadoAgendamento();
        setUsuarioLogado(sessao);
    }, []);

    const refreshSelectedDay = useCallback(async (dateParam?: string) => {
        const dataParam = dateParam ?? selectedDateParam;
        const idColaborador = Number(colaboradorId ?? 0) ?? 0;

        if (!dataParam || idColaborador === 0) {
            return;
        }

        const response = await buscarAgendamentosPorData(dataParam, idColaborador);

        const dataSelecionada = dayjs(dataParam, "YYYY-MM-DD", true).format("DD/MM/YYYY");
        const itensDoDia = response.datas?.length
            ? mapAgendamentosToHoras(response.datas)
            : criarHoraAgendadaPadrao(dataSelecionada, idColaborador);

        setHorasAgendadas((prev) => {
            const semDiaSelecionado = prev.filter((item) => item.data !== dataSelecionada);
            return [...semDiaSelecionado, ...itensDoDia];
        });
    }, [colaboradorId, criarHoraAgendadaPadrao, selectedDateParam, mapAgendamentosToHoras]);

    const handlerCloseClick = async () => {
        await refreshSelectedDay();
        setIsHoraOpen(false);
        setIsDayItem(true);
    };

    const handlerEditar = useCallback(async (id?: number) => {
        if (!id) return;

        await refreshSelectedDay();
        const response = await buscarAgendamentoPorId(id);
        if (!response.data) {
            setHorasAgendadas([]);
            setIsHiddenItem(false);
            setIsHoraOpen(true);
            return;
        }

        const ini = dayjs(response?.data?.dataInicioAgendamento as any);
        const fim = dayjs(response?.data?.dataTerminoAgendamento as any);
        limparCamposAgendamento(ini.isValid() ? ini : dayjs(selectedDateParam, "YYYY-MM-DD", true), String(response?.data?.idColaborador ?? "0"));
        setHorasAgendadas(mapAgendamentosToHoras([response.data]));
        setAgendamentoItem((prev) => ({
            ...prev,
            id: response?.data?.id ?? 0,
            dataInicioAgendamento: ini.isValid() ? ini : prev?.dataInicioAgendamento,
            dataTerminoAgendamento: fim,
            idColaborador: String(response?.data?.idColaborador) ?? "0",
            nomeUsuario: response.data?.nomeUsuario,
            nomeCliente: response.data?.nomeCliente ?? response.data?.nomeUsuario,
            telefoneCliente: response.data?.telefoneCliente,
            idServico: response?.data?.idServico,
            descricaoServico: response?.data?.descricaoServico,
            nomeColaborador: response?.data?.nomeColaborador,
            ativo: true,
            urlImagem: imagem,
            idUsuario: response?.data?.idUsuario,
        }));
        setIsHiddenItem(false);
    }, [imagem, limparCamposAgendamento, mapAgendamentosToHoras, refreshSelectedDay, selectedDateParam]);

    const handlerNovo = useCallback(async (data?: string, id?: number) => {
        const dataBase = data ?? dayjs().format("DD/MM/YYYY");
        const dataFormat = formatarData(dataBase);
        const idColaborador = id?.toString() ?? "0";
        const parsed = dayjs(dataBase, "DD/MM/YYYY", true);
        const dataSelecionada = parsed.isValid() ? parsed : dayjs();
        setSelectedDateParam(dataSelecionada.format("YYYY-MM-DD"));
        limparCamposAgendamento(dataSelecionada, String(idColaborador));

        setAgendamentoItem((prev) => ({
            ...prev,
            id: 0,
            dataInicioAgendamento: dataFormat ?? prev?.dataInicioAgendamento ?? dataSelecionada,
            idColaborador: String(idColaborador),
            ativo: true,
        }));

        setHorasAgendadas(criarHoraAgendadaPadrao(dataBase, id));
        setIsHiddenItem(false);
        setIsHoraOpen(true);
    }, [criarHoraAgendadaPadrao, limparCamposAgendamento]);

    const handlerDeletar = useCallback(async (id?: number) => {
        if (!id) return;

        const response = await removerAgendamento(id);
        if (!response) {
            setHorasAgendadas([]);
            setIsHoraOpen(true);
            return;
        }

        await refreshSelectedDay();
        setIsHoraOpen(false);
    }, [refreshSelectedDay]);

    const handleDropdownChange = (e: SelectChangeEvent<string>, tipo: string) => {
        if (tipo === "ano") {
            setAnoItem(Number(e.target.value));
        }
        if (tipo === "colaborador") {
            setColaboradorId(Number(e.target.value));
            setIsLeitura(false);
            setIsReadOnly(false);
            if (Number(e.target.value) === 0) {
                setAnoItem(0);
                setIsLeitura(true);
            }

            const selecionado = colaboradores?.find((opt) => String(opt.key) === e.target.value.toString());
            setImagem(selecionado?.urlImagem ?? "");
            setIsDayItem(false);
        }
    };

    const handleDayClick = useCallback(async (date: Dayjs | null, id?: number) => {
        if (!date) return;

        const mesNumero = date.month() + 1;
        setMesSelected(mesNumero);
        const dataParam = date.format("YYYY-MM-DD");
        setSelectedDateParam(dataParam);
        const idColaborador = Number(colaboradorId ?? 0) ?? 0;
        const response = await buscarAgendamentosPorData(dataParam, idColaborador);
        const dataSelecionada = date.format("DD/MM/YYYY");
        const itensDoDia = response.datas?.length
            ? mapAgendamentosToHoras(response.datas)
            : criarHoraAgendadaPadrao(dataSelecionada, idColaborador);

        if (!itensDoDia.length) {
            setHorasAgendadas((prev) => {
                const semDiaSelecionado = prev.filter((item) => item.data !== dataSelecionada);
                return [...semDiaSelecionado, ...criarHoraAgendadaPadrao(dataSelecionada, idColaborador)];
            });
            setAgendamentoItem((prev) => ({
                ...prev,
                id: 0,
                dataInicioAgendamento: date,
                dataTerminoAgendamento: undefined,
                idColaborador: String(colaboradorId) ?? id,
                ativo: true,
                urlImagem: imagem,
                nomeUsuario: "",
                nomeCliente: "",
                telefoneCliente: "",
                idServico: 0,
            }));
            setIsHiddenItem(false);
            setIsHoraOpen(true);
            setIsDayItem(true);
            return;
        }

        const itens = mapAgendamentosToHoras(response.datas);
        setHorasAgendadas((prev) => {
            const semDiaSelecionado = prev.filter((item) => item.data !== dataSelecionada);
            return [...semDiaSelecionado, ...itens];
        });
        setIsHoraOpen(true);
        setIsDayItem(true);
    }, [colaboradorId, criarHoraAgendadaPadrao, imagem, mapAgendamentosToHoras]);

    const calendarioItem: CalendarioItem = {
        year: anoItem !== undefined && anoItem !== null ? Number(anoItem) : Number(currentYear),
        onDayClick: handleDayClick,
        agendamentos: horasAgendadas,
        isHoraOpen,
        mes: mesSelected,
        onCloseClick: handlerCloseClick,
        onUpdateClick: handlerEditar,
        onDeleteClick: handlerDeletar,
        onNewClick: handlerNovo,
        isReadOnly,
        diaISO: selectedDateParam,
    };

    const anos: SelectItens[] = Array.from(
        { length: 2100 - currentYear + 1 },
        (_, i) => currentYear + i,
    )
        .filter((ano) => ano !== currentYear)
        .map((ano) => ({ key: ano, value: ano.toString() }));

    useEffect(() => {
        agendamentoData();
    }, [isHoraOpen, colaboradorId, anoItem, isReadOnly, agendamentoData]);

    useUpdateFetch([() => usuarioData(), () => agendamentoData(), () => fetchColaboradorData()]);

    const handleButtonClickListar = useCallback(() => {
        setIsHiddenItem(true);
        setIsHoraOpen(false);
        setAgendamentoItem((prev) => ({
            ...prev,
            id: 0,
            dataInicioAgendamento: undefined,
            dataTerminoAgendamento: undefined,
            idColaborador: "0",
            ativo: true,
            nomeUsuario: "",
            nomeCliente: "",
            telefoneCliente: "",
            idServico: 0,
            urlImagem: "",
        }));

        const ano = anoItem;
        const id = colaboradorId;
        setAnoItem(ano);
        setColaboradorId(id);
        setIsReadOnly(true);
        setIsDayItem(false);
    }, [anoItem, colaboradorId]);

    const handleSaveSuccess = useCallback(() => {
        void refreshSelectedDay();
        handleButtonClickListar();
    }, [handleButtonClickListar, refreshSelectedDay]);

    return {
        agendamentoItem,
        anoItem,
        anos,
        calendarioItem,
        colaboradores,
        colaboradorId,
        currentYear,
        handleSaveSuccess,
        handleButtonClickListar,
        handleDayClick,
        handleDropdownChange,
        horasAgendadas,
        isHoraOpen,
        isLeitura,
        refreshSelectedDay,
        usuarioLogado,
    };
};
