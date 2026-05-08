import React, { useState, useCallback, useMemo } from "react";
import { UsuarioLoginItens } from "../../../Interfaces/Usuario/UsuarioLoginItens";
import { GetAllService } from "../../../services/shared/getAllService";
import { PersistirItens } from "../../../Interfaces/shared/persistirItens";
import { PaginacaoItens } from "../../../Interfaces/shared/PaginacaoItens";
import { GetPaginadoService } from "../../../services/shared/getPaginadoService";
import { API_BASE_URL, API_BASE_AGENDA_URL } from "../../../config/apiConfig";
import { UrlUsuarioLogado } from "../../../constants/Usuario/usuarioConstant";
import { propertyLabels, UrlBuscarPaginado, UrlServico, ModalTexto } from "../../../constants/Servicos/servicoConstant";
import { ServicosItens } from "../../../Interfaces/Produto/servicosItens";
import { paginar } from "../../../functions/paginacao";
import { ResponseItem } from "../../../Interfaces/shared/ResponseItem";
import { GetByIdService } from "../../../services/shared/getByIdService";
import { GrigViewItens } from "../../../Interfaces/shared/gridviewItens";
import { ModalItem } from "../../../Interfaces/shared/modalItem";
import { DeleteService } from "../../../services/shared/deleteService";
import { useHiddenItem } from "../../../hooks/useHiddenItem";
import { FaCog, FaCogs } from "react-icons/fa";
import { Tooltip } from "@mui/material";
import ModalGeneric from "../../../componentsGenerics/modalGeneric";
import DeleteIcon from "@mui/icons-material/Delete";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import Banner from "../../../components/banner";
import Footer from "../../../components/footer";
import useUpdateGrid from "../../../hooks/useUpdateGrid";
import useUpdateFetch from "../../../hooks/useUpdateFetch";
import ServicoPersistir from "./ProdutosForm";
import ServicoBusca from "./ProdutosSearch";
import GridViewLista from "../../../components/gridview";
import styles from "./Produtos.module.css";

const Servico: React.FC = () => {
    const [servicoItem, setServicoItem] = useState<ServicosItens>();
    const [resultadosBusca, setResultadosBusca] = useState<PaginacaoItens<ServicosItens>>();
    const [useUsuarioLogado, setUsuarioLogado] = useState<UsuarioLoginItens>();
    const [persistirItens, stePersistirItens] = useState<PersistirItens<ServicosItens>>();
    const [gridViewItens, setGridView] = useState<GrigViewItens<ServicosItens>>();
    const [modalOpen, setModalOpen] = useState<ModalItem>();
    const [isHiddenItem, setIsHiddenItem] = useState(false);

    useHiddenItem("persistir", "lista", isHiddenItem);

    const fetchServicoData = useCallback(async (page: number = 1) => {
        const paginacao = paginar(resultadosBusca, page);
        if (!resultadosBusca || page !== undefined) {
            paginacao.objetos = [];
            const servicoResponse = await GetPaginadoService(paginacao, `${API_BASE_AGENDA_URL}${UrlBuscarPaginado}`);
            if (servicoResponse) {
                setResultadosBusca(servicoResponse);
            }
        }
    }, [resultadosBusca]);

    const usuarioData = useCallback(async () => {
        const [sessao] = await Promise.all([
            GetAllService(`${API_BASE_URL}${UrlUsuarioLogado}`) as ResponseItem<UsuarioLoginItens>
        ]);
        setUsuarioLogado(sessao);
    }, []);

    const handleSaveSuccess = useCallback(() => {
        stePersistirItens((prev) => ({
            ...prev,
            isSave: true,
        }));
        setIsHiddenItem(false);
    }, []);

    const fetchPersistirData = useCallback(async () => {
        const persistirProps: PersistirItens<ServicosItens> = {
            onSave: handleSaveSuccess,
        };
        stePersistirItens(persistirProps);
    }, [handleSaveSuccess]);

    const handleScrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const handleButtonClickSalvar = () => {
        setIsHiddenItem(true);
    };

    const handleButtonClickListar = () => {
        setIsHiddenItem(false);
    };

    const handleUpdateClick = useCallback(async (event: React.MouseEvent, servico?: any) => {
        event.preventDefault();
        const servicoId = servico.id ?? "";
        const retorno = await GetByIdService(servicoId, `${API_BASE_AGENDA_URL}${UrlServico}`) as ResponseItem<ServicosItens>;
        setServicoItem(retorno?.data ?? undefined);
        handleButtonClickSalvar();
        handleScrollToTop();
    }, []);

    const handleModalDesativar = useCallback(async (id: number) => {
        const responseColaborador = await DeleteService(id, `${API_BASE_AGENDA_URL}${UrlServico}`);
        if (responseColaborador) {
            fetchServicoData();
            setModalOpen(undefined);
        }
    }, [fetchServicoData]);

    const handleDeleteClick = useCallback(async (event: React.MouseEvent, servico?: any) => {
        event.preventDefault();
        const modalItens: ModalItem = {
            open: true,
            title: servico.descricao,
            texto: ModalTexto,
            onClose: () => handleModalDesativar(servico.id)
        };
        setModalOpen(modalItens);
    }, [handleModalDesativar]);

    const actionButtons = useMemo(() => ([
        {
            id: 1,
            label: "Edit",
            icon: <EditRoundedIcon />,
            href: "#",
            class: "btn-busca",
            onClick: handleUpdateClick
        },
        {
            id: 2,
            label: "Delete",
            icon: <DeleteIcon />,
            href: "/delete",
            class: "btn-danger",
            onClick: handleDeleteClick
        }
    ]), [handleUpdateClick, handleDeleteClick]);

    const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, page: number) => {
        fetchServicoData(page);
    }, [fetchServicoData]);

    const gridViewItensMemo = useMemo(() => {
        if (resultadosBusca) {
            return {
                paginacao: resultadosBusca,
                propertyLabels: propertyLabels,
                actionButtons: actionButtons,
                onPageChange: handlePageChange
            } as GrigViewItens<ServicosItens>;
        }
        return undefined;
    }, [resultadosBusca, actionButtons, handlePageChange]);

    useUpdateFetch([usuarioData, fetchPersistirData, fetchServicoData],
        [usuarioData, fetchPersistirData, fetchServicoData]
    );

    const handleResultadosBusca = (resultados: PaginacaoItens<ServicosItens>) => {
        setResultadosBusca(resultados);
    };

    useUpdateGrid(gridViewItensMemo, setGridView, [persistirItens], () => {
        if (persistirItens?.isSave) {
            stePersistirItens(prev => ({
                ...prev,
                isSave: false,
            }));
            fetchServicoData();
        }
    });

    return (
        <div className={styles.root}>
            <div className={styles.banner}>
                <Banner usuarioLogado={useUsuarioLogado} />
            </div>

            <div className={styles.pageContent}>
                <div className={`persistir ${styles.section}`}>
                    <div className={styles.actionBar}>
                        <button onClick={handleButtonClickListar} className={styles.actionButton} type="button">
                            <Tooltip title="listar">
                                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                    <FaCogs />
                                </span>
                            </Tooltip>
                        </button>
                    </div>

                    <div className={styles.sectionBody}>
                        <ServicoPersistir
                            persistirProps={{
                                ...persistirItens,
                                item: servicoItem,
                            }}
                        />
                    </div>
                </div>

                <div className={`lista ${styles.section}`}>
                    <div className={styles.actionBar}>
                        <button onClick={handleButtonClickSalvar} className={styles.openButton} type="button">
                            <Tooltip title="novo">
                                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                    <FaCog />
                                </span>
                            </Tooltip>
                        </button>
                    </div>

                    <div className={styles.sectionBody}>
                        <ServicoBusca onResultadosBusca={handleResultadosBusca} />
                    </div>

                    <div className={styles.sectionBody}>
                        <div className={styles.listHeader}>
                            <h2>Lista</h2>
                            <p>Visualize e gerencie os produtos cadastrados</p>
                        </div>
                        <div className={styles.gridWrapper}>
                            <GridViewLista gridviewProps={gridViewItens ?? {}} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal">
                {modalOpen && <ModalGeneric modalProps={modalOpen} />}
            </div>

            <div className={styles.footer}>
                <Footer />
            </div>
        </div>
    );
};

export default Servico;
