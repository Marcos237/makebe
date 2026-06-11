import React, { useCallback, useMemo, useRef, useState } from "react";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import { useParams } from "react-router-dom";
import {
    ModalTexto,
    propertyLabelsColaborador,
    propertyLabelsLoja,
    TipoColaborador,
    TipoLoja,
} from "../../../constants/Agenda/agendaConstant";
import { Semana } from "../../../constants/shared/baseConstant";
import { mapToSelectItens } from "../../../functions/mapToSelectItens";
import { paginar } from "../../../functions/paginacao";
import { AgendaItens } from "../../../Interfaces/Agenda/AgendaItens";
import { ColaboradorItens } from "../../../Interfaces/Colaborador/colaboradorItem";
import { LojaItens } from "../../../Interfaces/Loja/lojaItens";
import { GrigViewItens } from "../../../Interfaces/shared/gridviewItens";
import { ModalItem } from "../../../Interfaces/shared/modalItem";
import { PaginacaoItens } from "../../../Interfaces/shared/PaginacaoItens";
import { PersistirItens } from "../../../Interfaces/shared/persistirItens";
import { SemanaItens } from "../../../Interfaces/shared/semanaItens";
import { UsuarioLoginItens } from "../../../Interfaces/Usuario/UsuarioLoginItens";
import useFetchTipo from "../../../hooks/useFetchTipo";
import { useHiddenItem } from "../../../hooks/useHiddenItem";
import useUpdateFetch from "../../../hooks/useUpdateFetch";
import useUpdateGrid from "../../../hooks/useUpdateGrid";
import {
    buscarAgendaPaginada,
    buscarAgendaPorId,
    buscarColaboradoresAgenda,
    buscarLojasAgenda,
    buscarUsuarioLogado,
    removerAgenda,
} from "../services/agendaService";

export const useAgendaPage = () => {
    const [agendaItem, setAgendaItem] = useState<AgendaItens>();
    const [usuarioLogado, setUsuarioLogado] = useState<UsuarioLoginItens>();
    const [gridViewItens, setGridView] = useState<GrigViewItens<AgendaItens>>();
    const [resultadosBusca, setResultadosBusca] = useState<PaginacaoItens<AgendaItens>>();
    const [persistirItensList, setPersistirItensList] = useState<Array<PersistirItens<any>>>([]);
    const [modalOpen, setModalOpen] = useState<ModalItem>();
    const [isHiddenItem, setIsHiddenItem] = useState(false);
    const submittingRef = useRef(false);
    const { urlParametro } = useParams();

    useHiddenItem("persistir", "lista", isHiddenItem);

    const tipoItem = urlParametro === "Loja" ? TipoLoja : urlParametro === "Colaborador" ? TipoColaborador : 0;

    const fetchAgendaData = useCallback(async (tipoAgenda?: string, page: number = 1) => {
        const agendaDefault: AgendaItens = {
            id: 0,
            isTodoDia: false,
            IsBloqueadoHoje: false,
            agendaAbertaInicio: "",
            agendaAbertaFim: "",
            idAgendaSemanaInicio: 0,
            idAgendaSemanaFim: 0,
            idLoja: 0,
            tipo: Number(tipoItem),
        };
        const paginacao = paginar(resultadosBusca, page);

        if (!resultadosBusca || page !== undefined) {
            paginacao.objetoPesquisa = resultadosBusca?.objetoPesquisa ?? agendaDefault;
            paginacao.objetoPesquisa.tipo = Number(tipoAgenda);
            paginacao.objetos = [];

            const agendaResponse = await buscarAgendaPaginada(paginacao);
            if (agendaResponse) {
                setResultadosBusca(agendaResponse);
            }
        }

        submittingRef.current = false;
    }, [resultadosBusca, tipoItem]);

    const usuarioData = useCallback(async () => {
        const sessao = await buscarUsuarioLogado();
        setUsuarioLogado(sessao);
    }, []);

    const fetchLojaData = useCallback(async () => {
        const lojaResponse = await buscarLojasAgenda();
        const itensSelect = mapToSelectItens(lojaResponse?.datas, "id", "razaoSocial");

        const persistirPropsLoja: PersistirItens<LojaItens> = {
            selectItems: itensSelect,
            name: "loja",
            onSave: async () => {
                await fetchAgendaData();
            },
        };

        setPersistirItensList((prevList) => [...prevList, persistirPropsLoja]);
    }, [fetchAgendaData]);

    const fetchColaboradorData = useCallback(async () => {
        const colaboradorResponse = await buscarColaboradoresAgenda();
        const itensSelect = mapToSelectItens(colaboradorResponse?.datas, "id", "nome");

        const persistirPropsColaborador: PersistirItens<ColaboradorItens> = {
            selectItems: itensSelect,
            name: "colaborador",
            onSave: async () => {
                await fetchAgendaData();
            },
        };

        setPersistirItensList((prevList) => [...prevList, persistirPropsColaborador]);
    }, [fetchAgendaData]);

    const semanaData = useCallback(async () => {
        const itensSelect = mapToSelectItens(Semana, "id", "dia");

        const persistirProps: PersistirItens<SemanaItens> = {
            selectItems: itensSelect,
            name: "semana",
            onSave: async () => {
                await fetchAgendaData();
            },
        };

        setPersistirItensList((prevList) => [...prevList, persistirProps]);
    }, [fetchAgendaData]);

    const handleScrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleModalDesativarItem = useCallback(async (id: number) => {
        if (submittingRef.current) return;

        submittingRef.current = true;
        await removerAgenda(id);
        await fetchAgendaData(tipoItem.toString());
        setModalOpen(undefined);
    }, [fetchAgendaData, tipoItem]);

    const handleUpdateClickItem = useCallback(async (event: React.MouseEvent, agenda?: AgendaItens) => {
        event.preventDefault();

        const resultado = await buscarAgendaPorId(agenda?.id ?? 0, Number(tipoItem));
        setAgendaItem(resultado.data);
        setIsHiddenItem(true);
        handleScrollToTop();
    }, [tipoItem]);

    const handleDeleteClick = useCallback(async (event: React.MouseEvent, agenda?: AgendaItens) => {
        event.preventDefault();

        const modalItens: ModalItem = {
            open: true,
            title: (agenda as any)?.nomeColaborador,
            texto: ModalTexto,
            onClose: () => handleModalDesativarItem(agenda?.id ?? 0),
        };

        setModalOpen(modalItens);
    }, [handleModalDesativarItem]);

    const actionButtons = useMemo(() => ([
        {
            id: 1,
            label: "Edit",
            icon: React.createElement(EditRoundedIcon),
            href: "#",
            class: "btn-busca",
            onClick: handleUpdateClickItem,
        },
        {
            id: 2,
            label: "Delete",
            icon: React.createElement(DeleteIcon),
            href: "/delete",
            class: "btn-danger",
            onClick: handleDeleteClick,
        },
    ]), [handleUpdateClickItem, handleDeleteClick]);

    const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, page: number) => {
        fetchAgendaData(tipoItem.toString(), page);
    }, [fetchAgendaData, tipoItem]);

    const gridViewItensMemo = useMemo(() => {
        if (resultadosBusca) {
            return {
                paginacao: resultadosBusca,
                propertyLabels: tipoItem === TipoLoja ? propertyLabelsLoja : propertyLabelsColaborador,
                actionButtons,
                onPageChange: handlePageChange,
            } as GrigViewItens<AgendaItens>;
        }

        return undefined;
    }, [resultadosBusca, actionButtons, handlePageChange, tipoItem]);

    const handleResultadosBusca = (resultados: PaginacaoItens<AgendaItens>) => {
        setResultadosBusca(resultados);
    };

    const handleSaveSuccess = useCallback(() => {
        setIsHiddenItem(false);
    }, []);

    useUpdateGrid(gridViewItensMemo, setGridView, [persistirItensList], () => {
        const isSave = persistirItensList.find((item) => item.isSave)?.isSave;
        if (isSave) {
            persistirItensList.forEach((item) => {
                item.isSave = false;
            });
            fetchAgendaData(tipoItem.toString());
        }
    });

    useUpdateFetch([
        () => usuarioData(),
        () => fetchLojaData(),
        () => fetchColaboradorData(),
        () => semanaData(),
        () => fetchAgendaData(tipoItem.toString()),
    ], [tipoItem]);

    useFetchTipo(urlParametro ?? "", [() => fetchAgendaData(tipoItem.toString())], TipoLoja, TipoColaborador);

    return {
        agendaItem,
        gridViewItens,
        handleSaveSuccess,
        handleButtonClickListar: () => setIsHiddenItem(false),
        handleButtonClickSalvar: () => setIsHiddenItem(true),
        handleResultadosBusca,
        modalOpen,
        persistirItensList,
        resultadosBusca,
        tipoItem,
        usuarioLogado,
    };
};
