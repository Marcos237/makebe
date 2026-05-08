import React, { useCallback, useMemo, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { useParams } from "react-router-dom";
import {
    modalTexto,
    propertyLabelsColaborador,
    propertyLabelsLoja,
} from "../../../constants/Endereco/enderecoConstants";
import { TipoUsuarioColaboradorId, TipoUsuarioLojaId } from "../../../constants/Usuario/usuarioConstant";
import { paginar } from "../../../functions/paginacao";
import { useColaboradorData } from "../../../hooks/useColaboradorData";
import useFetchTipo from "../../../hooks/useFetchTipo";
import { useHiddenItem } from "../../../hooks/useHiddenItem";
import { useLojaData } from "../../../hooks/useLojaData";
import useUpdateFetch from "../../../hooks/useUpdateFetch";
import useUpdateGrid from "../../../hooks/useUpdateGrid";
import { useUsuarioLogado } from "../../../hooks/useUsuarioLogado";
import { EnderecoItens } from "../../../Interfaces/Endereco/enderecoItens";
import { GrigViewItens } from "../../../Interfaces/shared/gridviewItens";
import { ModalItem } from "../../../Interfaces/shared/modalItem";
import { PaginacaoItens } from "../../../Interfaces/shared/PaginacaoItens";
import { PersistirItens } from "../../../Interfaces/shared/persistirItens";
import { UsuarioLoginItens } from "../../../Interfaces/Usuario/UsuarioLoginItens";
import { buscarEnderecoPorId, buscarEnderecosPaginado, removerEndereco } from "../services/enderecoService";

export const useEnderecoPage = () => {
    const [enderecoItem, setEnderecoItem] = useState<EnderecoItens>();
    const [usuarioLogadoItem, setUsuarioLogado] = useState<UsuarioLoginItens>();
    const [gridViewItens, setGridView] = useState<GrigViewItens<EnderecoItens>>();
    const [resultadosBusca, setResultadosBusca] = useState<PaginacaoItens<EnderecoItens>>();
    const [modalOpen, setModalOpen] = useState<ModalItem>();
    const [persistirItensList, setPersistirItensList] = useState<Array<PersistirItens<any>>>([]);
    const [isHiddenItem, setIsHiddenItem] = useState(false);
    const { urlParametro } = useParams();

    useHiddenItem("persistir", "lista", isHiddenItem);

    const tipoUsuarioId = urlParametro === "Loja" ? TipoUsuarioLojaId : urlParametro === "Colaborador" ? TipoUsuarioColaboradorId : "";

    const fetchEnderecoData = useCallback(async (tipoUsuario?: string, page: number = 1) => {
        const paginacao = paginar(resultadosBusca, page);
        if (!resultadosBusca || page !== undefined) {
            paginacao.objetoPesquisa = resultadosBusca?.objetoPesquisa || {};
            paginacao.objetoPesquisa.tipoUsuarioId = Number(tipoUsuario);

            const enderecoResponse = await buscarEnderecosPaginado(paginacao);
            if (enderecoResponse) {
                setResultadosBusca(enderecoResponse);
            }
        }
    }, [resultadosBusca]);

    const handleModalDesativarEndereco = useCallback(async (id: number) => {
        const lojaRetorno = await removerEndereco(id);
        if (lojaRetorno) {
            fetchEnderecoData(tipoUsuarioId);
            setModalOpen(undefined);
        }
    }, [fetchEnderecoData, tipoUsuarioId]);

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

    const handleUpdateClick = useCallback(async (event: React.MouseEvent, endereco?: EnderecoItens) => {
        event.preventDefault();
        const enderecoId = endereco?.id ?? 0;
        const retorno = await buscarEnderecoPorId(enderecoId);
        setEnderecoItem(retorno.data ?? {});
        handleButtonClickSalvar();
        handleScrollToTop();
    }, []);

    const handleDeleteClick = useCallback(async (event: React.MouseEvent, endereco?: EnderecoItens) => {
        event.preventDefault();
        const modalprops: ModalItem = {
            open: true,
            onClose: () => handleModalDesativarEndereco(endereco?.id ?? 0),
            title: `${endereco?.logradouro} - ${endereco?.numero}`,
            texto: modalTexto,
        };
        setModalOpen(modalprops);
    }, [handleModalDesativarEndereco]);

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

    const handleResultadosBusca = (resultados: PaginacaoItens<EnderecoItens>) => {
        setResultadosBusca(resultados);
    };

    const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, page: number) => {
        fetchEnderecoData(tipoUsuarioId, page);
    }, [fetchEnderecoData, tipoUsuarioId]);

    const gridViewItensMemo = useMemo(() => {
        if (resultadosBusca) {
            return {
                paginacao: resultadosBusca,
                propertyLabels: tipoUsuarioId === TipoUsuarioLojaId ? propertyLabelsLoja : propertyLabelsColaborador,
                actionButtons,
                onPageChange: handlePageChange,
            } as GrigViewItens<EnderecoItens>;
        }
        return undefined;
    }, [resultadosBusca, actionButtons, handlePageChange, tipoUsuarioId]);

    const { fetchUsuarioLogado } = useUsuarioLogado();
    const { fetchColaboradorData } = useColaboradorData(async (id) => {
        await fetchEnderecoData(id);
    });
    const { fetchLojaData } = useLojaData(async (id) => {
        await fetchEnderecoData(id);
    });

    useUpdateFetch([
        async () => {
            const usuario = await fetchUsuarioLogado();
            setUsuarioLogado(usuario);
        },
        async () => {
            const loja = await fetchLojaData();
            setPersistirItensList((prev) => [...prev, loja]);
        },
        async () => {
            const colaborador = await fetchColaboradorData();
            setPersistirItensList((prev) => [...prev, colaborador]);
        },
        async () => {
            await fetchEnderecoData(tipoUsuarioId);
        },
    ], [tipoUsuarioId]);

    useUpdateGrid(gridViewItensMemo, setGridView, [persistirItensList], () => {
        const isSave = persistirItensList.find((item) => item.isSave)?.isSave;
        if (isSave) {
            persistirItensList.forEach((item) => {
                item.isSave = false;
            });
            fetchEnderecoData(tipoUsuarioId);
        }
    });

    useFetchTipo(urlParametro ?? "", [() => fetchEnderecoData(tipoUsuarioId)], TipoUsuarioLojaId, TipoUsuarioColaboradorId);

    return {
        enderecoItem,
        gridViewItens,
        handleButtonClickListar,
        handleButtonClickSalvar,
        handleSaveSuccess,
        handleResultadosBusca,
        modalOpen,
        persistirItensList,
        resultadosBusca,
        tipoUsuarioId,
        usuarioLogadoItem,
    };
};
