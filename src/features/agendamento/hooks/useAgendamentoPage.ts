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
    const currentYear = dayjs().year();

    useHiddenItem("lista", "persistir", isHiddenItem);

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
        const itens: HoraAgendadaItem[] = response.datas.map((a) => {
            const ini = dayjs(a.dataInicioAgendamento as any);
            const fim = dayjs(a.dataTerminoAgendamento as any);

            return {
                id: a.id,
                name: a.nomeUsuario ?? "",
                data: ini.isValid() ? ini.format("DD/MM/YYYY") : "",
                dataInicio: ini.isValid() ? [ini.format("HH:mm")] : [],
                dataFim: fim.isValid() ? [fim.format("HH:mm")] : [],
                idColaborador: a.idColaborador ?? "",
            };
        });

        setHorasAgendadas(itens);
        setIsDayItem(true);
    }, [anoItem, colaboradorId, currentYear, isDayItem]);

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

    const handlerCloseClick = async () => {
        agendamentoData();
        setIsHoraOpen(false);
        setIsDayItem(true);
    };

    const handlerEditar = useCallback(async (id?: number) => {
        if (!id) return;

        const response = await buscarAgendamentoPorId(id);
        if (!response.data) {
            setHorasAgendadas([]);
            setIsHiddenItem(false);
            setIsHoraOpen(true);
            return;
        }

        const ini = dayjs(response?.data?.dataInicioAgendamento as any);
        const fim = dayjs(response?.data?.dataTerminoAgendamento as any);
        setAgendamentoItem((prev) => ({
            ...prev,
            id: response?.data?.id ?? 0,
            dataInicioAgendamento: ini,
            dataTerminoAgendamento: fim,
            idColaborador: String(response?.data?.idColaborador) ?? "0",
            nomeUsuario: response.data?.nomeUsuario,
            idServico: response?.data?.idServico,
            nomeColaborador: response?.data?.nomeColaborador,
            ativo: true,
            urlImagem: imagem,
            idUsuario: response?.data?.idUsuario,
        }));
        setIsHiddenItem(false);
    }, [imagem]);

    const handlerNovo = useCallback(async (data?: string, id?: number) => {
        if (!data) return;

        const dataFormat = formatarData(data);
        const idColaborador = id?.toString() ?? "0";

        setAgendamentoItem((prev) => ({
            ...prev,
            id: 0,
            dataInicioAgendamento: dataFormat ?? undefined,
            idColaborador: String(idColaborador),
            ativo: true,
        }));

        setHorasAgendadas([]);
        setIsHiddenItem(false);
        setIsHoraOpen(true);
    }, []);

    const handlerDeletar = useCallback(async (id?: number) => {
        if (!id) return;

        const response = await removerAgendamento(id);
        if (!response) {
            setHorasAgendadas([]);
            setIsHoraOpen(true);
            return;
        }

        agendamentoData();
        setIsHoraOpen(false);
    }, [agendamentoData]);

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
        const idColaborador = Number(colaboradorId ?? 0) ?? 0;
        const response = await buscarAgendamentosPorData(dataParam, idColaborador);

        if (!response.datas) {
            setHorasAgendadas([]);
            setAgendamentoItem((prev) => ({
                ...prev,
                id: 0,
                dataInicioAgendamento: date,
                dataTerminoAgendamento: undefined,
                idColaborador: String(colaboradorId) ?? id,
                ativo: true,
                urlImagem: imagem,
                nomeUsuario: "",
                idServico: 0,
            }));
            setIsHiddenItem(false);
            setIsDayItem(true);
            return;
        }

        const itens: HoraAgendadaItem[] = response.datas.map((a) => {
            const ini = dayjs(a.dataInicioAgendamento as any);
            const fim = dayjs(a.dataTerminoAgendamento as any);

            return {
                id: a.id ?? 0,
                name: a.nomeUsuario ?? "",
                data: ini.isValid() ? ini.format("DD/MM/YYYY") : "",
                dataInicio: ini.isValid() ? [ini.format("HH:mm")] : [],
                dataFim: fim.isValid() ? [fim.format("HH:mm")] : [],
                tooltipItem: "editar",
                idColaborador: a.idColaborador ?? "",
            };
        });

        setIsHoraOpen(true);
        setHorasAgendadas(itens);
        setIsDayItem(true);
    }, [colaboradorId, imagem]);

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
        handleButtonClickListar();
    }, [handleButtonClickListar]);

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
        usuarioLogado,
    };
};
