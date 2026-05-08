import React, { useCallback, useMemo, useRef, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { modalTexto, propertyLabels } from "../../../constants/Loja/lojaConstant";
import { paginar } from "../../../functions/paginacao";
import { useHiddenItem } from "../../../hooks/useHiddenItem";
import { useUsuarioLogado } from "../../../hooks/useUsuarioLogado";
import useUpdateFetch from "../../../hooks/useUpdateFetch";
import useUpdateGrid from "../../../hooks/useUpdateGrid";
import { LojaItens } from "../../../Interfaces/Loja/lojaItens";
import { TipoLojaItens } from "../../../Interfaces/Loja/tipoLojaItens";
import { GrigViewItens } from "../../../Interfaces/shared/gridviewItens";
import { ModalItem } from "../../../Interfaces/shared/modalItem";
import { PaginacaoItens } from "../../../Interfaces/shared/PaginacaoItens";
import { PersistirItens } from "../../../Interfaces/shared/persistirItens";
import { SelectItens } from "../../../Interfaces/shared/selectItens";
import { UsuarioLoginItens } from "../../../Interfaces/Usuario/UsuarioLoginItens";
import { buscarLojaPorId, buscarLojasPaginado, buscarTiposLoja, removerLoja } from "../services/lojaService";

export const useLojaPage = () => {
    const [usuarioLogadoItem, setUsuarioLogado] = useState<UsuarioLoginItens>();
    const [persistirItens, setPersistirItems] = useState<PersistirItens<LojaItens>>();
    const [gridViewItens, setGridView] = useState<GrigViewItens<LojaItens>>();
    const [lojaItem, setLojaItem] = useState<LojaItens>();
    const [resultadosBusca, setResultadosBusca] = useState<PaginacaoItens<LojaItens>>();
    const [modalOpen, setModalOpen] = useState<ModalItem>();
    const [isHiddenItem, setIsHiddenItem] = useState(false);
    const submittingRef = useRef(false);

    useHiddenItem("persistir", "lista", isHiddenItem);

    const fetchLojaData = useCallback(async (page: number = 1) => {
        const paginacao = paginar(resultadosBusca, page);
        if (!resultadosBusca || page !== undefined) {
            paginacao.objetos = [];
            const lojaResponse = await buscarLojasPaginado(paginacao);
            if (lojaResponse) {
                setResultadosBusca(lojaResponse);
            }
        }
    }, [resultadosBusca]);

    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleButtonClickSalvar = () => setIsHiddenItem(true);
    const handleButtonClickListar = () => setIsHiddenItem(false);

    const handleSaveSuccess = useCallback(() => {
        setPersistirItems((prev) => ({ ...prev, isSave: true }));
        setIsHiddenItem(false);
    }, []);

    const handleUpdateClick = useCallback(async (event: React.MouseEvent, loja?: LojaItens) => {
        event.preventDefault();
        const retorno = await buscarLojaPorId(loja?.id ?? 0);
        setLojaItem(retorno.data ?? {});
        handleButtonClickSalvar();
        handleScrollToTop();
    }, []);

    const handleModalDesativarLoja = useCallback(async (id: number) => {
        const lojaRetorno = await removerLoja(id);
        if (lojaRetorno) {
            fetchLojaData();
            setModalOpen(undefined);
            submittingRef.current = false;
        }
    }, [fetchLojaData]);

    const handleDeleteClick = useCallback(async (event: React.MouseEvent, loja?: LojaItens) => {
        event.preventDefault();
        if (submittingRef.current) return;
        submittingRef.current = true;
        const modalItens: ModalItem = {
            open: true,
            title: loja?.razaoSocial,
            texto: modalTexto,
            onClose: () => handleModalDesativarLoja(loja?.id ?? 0),
        };
        setModalOpen(modalItens);
    }, [handleModalDesativarLoja]);

    const actionButtons = useMemo(() => ([
        { id: 1, label: "Edit", icon: React.createElement(EditRoundedIcon), href: "#", class: "btn-busca", onClick: handleUpdateClick },
        { id: 2, label: "Delete", icon: React.createElement(DeleteIcon), href: "/delete", class: "btn-danger", onClick: handleDeleteClick },
    ]), [handleUpdateClick, handleDeleteClick]);

    const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, page: number) => {
        fetchLojaData(page);
    }, [fetchLojaData]);

    const fetchTipoLojaData = useCallback(async () => {
        const tipoLojaResponse = await buscarTiposLoja();
        const itensSelect: SelectItens[] = tipoLojaResponse?.datas?.map((tipo: TipoLojaItens) => ({
            key: tipo.id || "",
            value: tipo.descricao,
        })) ?? [];
        setPersistirItems((prev) => ({ ...prev, selectItems: itensSelect, onSave: handleSaveSuccess }));
    }, [handleSaveSuccess]);

    const { fetchUsuarioLogado } = useUsuarioLogado();
    useUpdateFetch([async () => setUsuarioLogado(await fetchUsuarioLogado()), () => fetchLojaData(), () => fetchTipoLojaData()], []);

    const gridViewItensMemo = useMemo(() => {
        if (resultadosBusca) {
            return { paginacao: resultadosBusca, propertyLabels, actionButtons, onPageChange: handlePageChange } as GrigViewItens<LojaItens>;
        }
        return undefined;
    }, [resultadosBusca, actionButtons, handlePageChange]);

    useUpdateGrid(gridViewItensMemo, setGridView, [persistirItens], () => {
        if (persistirItens?.isSave) {
            setPersistirItems((prev) => ({ ...prev, isSave: false }));
            fetchLojaData();
        }
    });

    return {
        gridViewItens,
        handleButtonClickListar,
        handleButtonClickSalvar,
        handleResultadosBusca: setResultadosBusca,
        lojaItem,
        modalOpen,
        persistirItens,
        usuarioLogadoItem,
    };
};
