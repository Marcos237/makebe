import React, { useCallback, useMemo, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { ModalTexto, propertyLabels } from "../../../constants/ColaboradorProfissional/colaboradorProfissionalConstant";
import { mapToSelectItens } from "../../../functions/mapToSelectItens";
import { paginar } from "../../../functions/paginacao";
import { useHiddenItem } from "../../../hooks/useHiddenItem";
import useUpdateFetch from "../../../hooks/useUpdateFetch";
import useUpdateGrid from "../../../hooks/useUpdateGrid";
import { ColaboradorItens } from "../../../Interfaces/Colaborador/colaboradorItem";
import { ColaboradorProfissionalItem } from "../../../Interfaces/ColaboradorProfissional/colaboradorProfissionalItem";
import { LojaItens } from "../../../Interfaces/Loja/lojaItens";
import { ServicosItens } from "../../../Interfaces/Produto/servicosItens";
import { GrigViewItens } from "../../../Interfaces/shared/gridviewItens";
import { ModalItem } from "../../../Interfaces/shared/modalItem";
import { PaginacaoItens } from "../../../Interfaces/shared/PaginacaoItens";
import { PersistirItens } from "../../../Interfaces/shared/persistirItens";
import { UsuarioLoginItens } from "../../../Interfaces/Usuario/UsuarioLoginItens";
import {
    buscarColaboradorProfissionalPorId,
    buscarColaboradoresParaProfissional,
    buscarColaboradoresProfissionaisPaginado,
    buscarLojasParaProfissional,
    buscarServicosParaProfissional,
    buscarUsuarioLogadoColaboradorProfissional,
    removerColaboradorProfissional,
} from "../services/colaboradorProfissionalService";

export const useColaboradorProfissionalPage = () => {
    const [colaboradorProfissionalItem, setColaboradorProfissional] = useState<ColaboradorProfissionalItem>();
    const [usuarioLogado, setUsuarioLogado] = useState<UsuarioLoginItens>();
    const [resultadosBusca, setResultadosBusca] = useState<PaginacaoItens<ColaboradorProfissionalItem>>();
    const [gridViewItens, setGridView] = useState<GrigViewItens<ColaboradorProfissionalItem>>();
    const [persistirItensList, setPersistirItensList] = useState<Array<PersistirItens<any>>>([]);
    const [modalOpen, setModalOpen] = useState<ModalItem>();
    const [isHiddenItem, setIsHiddenItem] = useState(false);

    useHiddenItem("persistir", "lista", isHiddenItem);

    const fetchColaboradorProfissionalData = useCallback(async (page: number = 1) => {
        const paginacao = paginar(resultadosBusca, page);
        if (!resultadosBusca || page !== undefined) {
            paginacao.objetos = [];
            const colaboradorReponse = await buscarColaboradoresProfissionaisPaginado(paginacao);

            if (colaboradorReponse) {
                setResultadosBusca(colaboradorReponse);
            }
        }
    }, [resultadosBusca]);

    const usuarioData = useCallback(async () => {
        const sessao = await buscarUsuarioLogadoColaboradorProfissional();
        setUsuarioLogado(sessao);
    }, []);

    const fetchColaboradorData = useCallback(async () => {
        const colaboradorResponse = await buscarColaboradoresParaProfissional();
        const itensSelect = mapToSelectItens(colaboradorResponse?.datas, "id", "nome");
        const persistirPropsColaborador: PersistirItens<ColaboradorItens> = {
            selectItems: itensSelect,
            name: "colaborador",
            onSave: fetchColaboradorProfissionalData,
        };
        setPersistirItensList((prevList) => [...prevList, persistirPropsColaborador]);
    }, [fetchColaboradorProfissionalData]);

    const fetchLojaData = useCallback(async () => {
        const lojaResponse = await buscarLojasParaProfissional();
        const itensSelect = mapToSelectItens(lojaResponse?.datas, "id", "razaoSocial");
        const persistirPropsLoja: PersistirItens<LojaItens> = {
            selectItems: itensSelect,
            name: "loja",
            onSave: fetchColaboradorProfissionalData,
        };
        setPersistirItensList((prevList) => [...prevList, persistirPropsLoja]);
    }, [fetchColaboradorProfissionalData]);

    const fetchServicoData = useCallback(async () => {
        const servicoResponse = await buscarServicosParaProfissional();
        const itensSelect = mapToSelectItens(servicoResponse?.datas, "id", "descricao");
        const persistirPropsServico: PersistirItens<ServicosItens> = {
            selectItems: itensSelect,
            name: "servico",
            onSave: fetchColaboradorProfissionalData,
        };
        setPersistirItensList((prevList) => [...prevList, persistirPropsServico]);
    }, [fetchColaboradorProfissionalData]);

    const handleScrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleButtonClickSalvar = () => {
        setIsHiddenItem(true);
    };

    const handleButtonClickListar = () => {
        setIsHiddenItem(false);
    };

    const handleSaveSuccess = useCallback(() => {
        setIsHiddenItem(false);
    }, []);

    const handleUpdateClick = useCallback(async (event: React.MouseEvent, colaborador?: ColaboradorProfissionalItem) => {
        event.preventDefault();
        const colaboradorProfissonalId = colaborador?.id ?? 0;
        const retorno = await buscarColaboradorProfissionalPorId(colaboradorProfissonalId);
        setColaboradorProfissional(retorno?.data ?? undefined);
        handleButtonClickSalvar();
        handleScrollToTop();
    }, []);

    const handleModalDesativar = useCallback(async (id: number) => {
        const responseColaborador = await removerColaboradorProfissional(id);
        if (responseColaborador) {
            fetchColaboradorProfissionalData();
            setModalOpen(undefined);
        }
    }, [fetchColaboradorProfissionalData]);

    const handleDeleteClick = useCallback(async (event: React.MouseEvent, colaborador?: ColaboradorProfissionalItem) => {
        event.preventDefault();
        const modalItens: ModalItem = {
            open: true,
            title: colaborador?.nomeColaborador,
            texto: ModalTexto,
            onClose: () => handleModalDesativar(colaborador?.id ?? 0),
        };
        setModalOpen(modalItens);
    }, [handleModalDesativar]);

    const actionButtons = useMemo(() => ([
        {
            id: 1,
            label: "Edit",
            icon: React.createElement(EditRoundedIcon),
            href: "#",
            class: "btn-busca",
            onClick: handleUpdateClick,
        },
        {
            id: 2,
            label: "Delete",
            icon: React.createElement(DeleteIcon),
            href: "/delete",
            class: "btn-danger",
            onClick: handleDeleteClick,
        },
    ]), [handleUpdateClick, handleDeleteClick]);

    const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, page: number) => {
        fetchColaboradorProfissionalData(page);
    }, [fetchColaboradorProfissionalData]);

    useUpdateFetch([usuarioData, fetchLojaData, fetchColaboradorData, fetchServicoData, fetchColaboradorProfissionalData], [
        usuarioData,
        fetchLojaData,
        fetchColaboradorData,
        fetchServicoData,
        fetchColaboradorProfissionalData,
    ]);

    const gridViewItensMemo = useMemo(() => {
        if (resultadosBusca) {
            return {
                paginacao: resultadosBusca,
                propertyLabels,
                actionButtons,
                onPageChange: handlePageChange,
            } as GrigViewItens<ColaboradorProfissionalItem>;
        }
        return undefined;
    }, [resultadosBusca, actionButtons, handlePageChange]);

    useUpdateGrid(gridViewItensMemo, setGridView, [persistirItensList], () => {
        const isSave = persistirItensList.find((item) => item.isSave)?.isSave;
        if (isSave) {
            persistirItensList.forEach((item) => {
                item.isSave = false;
            });
            fetchColaboradorProfissionalData();
        }
    });

    const handleResultadosBusca = (resultados: PaginacaoItens<ColaboradorProfissionalItem>) => {
        setResultadosBusca(resultados);
    };

    return {
        colaboradorProfissionalItem,
        gridViewItens,
        handleButtonClickListar,
        handleButtonClickSalvar,
        handleSaveSuccess,
        handleResultadosBusca,
        modalOpen,
        persistirItensList,
        usuarioLogado,
    };
};
