import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { LojaPortifolioItem } from "../../Interfaces/LojaPortifolio/lojaportifolioItem";
import { Grid } from '@mui/material';
import { UsuarioLoginItens } from '../../Interfaces/Usuario/UsuarioLoginItens';
import { GetAllService } from '../../services/shared/getAllService';
import { PaginacaoItens } from '../../Interfaces/shared/PaginacaoItens';
import { ModalItem } from "../../Interfaces/shared/modalItem";
import { PersistirItens } from "../../Interfaces/shared/persistirItens";
import { SelectItens } from '../../Interfaces/shared/selectItens';
import { LojaItens } from "../../Interfaces/Loja/lojaItens";
import { API_BASE_URL, API_BASE_AGENDA_URL } from '../../config/apiConfig';
import { UrlUsuarioLogado } from "../../constants/Usuario/usuarioConstant";
import { GetPaginadoService } from "../../services/shared/getPaginadoService";
import { DeleteService } from "../../services/shared/deleteService";
import { GetByIdService } from "../../services/shared/getByIdService";
import { ModalTexto, propertyLabels, UrlBuscarPaginado, UrlPortifolio } from '../../constants/LojaPortifolio/LojaPortifolioConstant';
import { GrigViewItens } from "../../Interfaces/shared/gridviewItens";
import GridViewLista from "../../components/gridview";
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteIcon from '@mui/icons-material/Delete';
import ModalGeneric from "../../componentsGenerics/modalGeneric";
import LojaPortifolioPersistir from './LojaPortifolioPersistir';
import Banner from '../../components/banner';
import Footer from '../../components/footer';
import LojaPortifolioBusca from "./lojaPortifolioBusca";
import { UrlBuscarTodos } from "../../constants/Loja/lojaConstant";
import { ResponseItem } from "../../Interfaces/shared/ResponseItem";

import '../../assets/styles/Loja/lojaPortifolio.css'

const LojaPortifolio: React.FC = () => {
    const [useUsuarioLogado, setUsuarioLogado] = useState<UsuarioLoginItens>();
    const [persistirItens, setPersistirItems] = useState<PersistirItens<LojaPortifolioItem>>();
    const [resultadosBusca, setResultadosBusca] = useState<PaginacaoItens<LojaPortifolioItem>>();
    const [lojaPortifolio, setLojaPortifolio] = useState<LojaPortifolioItem>();
    const [modalOpen, setModalOpen] = useState<ModalItem>();
    const [gridViewItens, setGridView] = useState<GrigViewItens<LojaPortifolioItem>>();

    const usuarioData = useCallback(async () => {
        const [sessao] = await Promise.all([
            GetAllService(`${API_BASE_URL}${UrlUsuarioLogado}`) as ResponseItem<UsuarioLoginItens>
        ]);
        setUsuarioLogado(sessao);
    }, []);

    const fetchLojaPortifolioData = useCallback(async (page: number = 1) => {
        const paginacao: PaginacaoItens<LojaPortifolioItem> = {
            quantidadePagina: resultadosBusca?.quantidadePagina || 6,
            paginaAtual: page,
            totalPaginas: resultadosBusca?.totalPaginas || 1,
            total: resultadosBusca?.total || 0,
            objetoPesquisa: resultadosBusca?.objetoPesquisa || undefined,
            objetos: resultadosBusca?.objetos ?? []
        };

        if (!resultadosBusca || page !== undefined) {
            paginacao.objetos = []
            const lojaResponse = await GetPaginadoService(paginacao, `${API_BASE_AGENDA_URL}${UrlBuscarPaginado}`);
            if (lojaResponse) {
                setResultadosBusca(lojaResponse);
            }
        }
    }, [resultadosBusca]);

    const fetchLojaData = useCallback(async () => {
        const lojaResponse = await GetAllService(`${API_BASE_AGENDA_URL}${UrlBuscarTodos}`) as ResponseItem<LojaItens>;
        const itensSelect: SelectItens[] = lojaResponse?.datas?.map((loja: LojaItens) => ({
            key: loja.id || '',
            value: loja.razaoSocial
        })) ?? [];
        const lojaPortifolioBuscarProps: PersistirItens<LojaItens> = {
            selectItems: itensSelect,
            onSave: fetchLojaPortifolioData,
        };
        setPersistirItems(lojaPortifolioBuscarProps);
    }, [fetchLojaPortifolioData]);


    const handleScrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleModalDesativarLojaPortifolio = useCallback(async (id: number) => {
        const lojaRetorno = await DeleteService(id, `${API_BASE_AGENDA_URL}${UrlPortifolio}`) as ResponseItem<LojaPortifolioItem>;
        if (lojaRetorno) {
            fetchLojaPortifolioData();
        }
    }, [fetchLojaPortifolioData]);

    const handleDeleteClick = useCallback(
        async (event: React.MouseEvent, portifolio?: any) => {
            event.preventDefault();
            const modalprops: ModalItem = {
                open: true,
                onClose: () => handleModalDesativarLojaPortifolio(portifolio?.id),
                title: portifolio?.titulo ?? "",
                texto: ModalTexto,
            };
            setModalOpen(modalprops);
        },
        [handleModalDesativarLojaPortifolio]
    );

    const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, page: number) => {
        fetchLojaPortifolioData(page);
    }, [fetchLojaPortifolioData])

    const handleUpdateClick = useCallback(async (event: React.MouseEvent, portifolio?: any) => {
        event.preventDefault();
        handleScrollToTop();
        const Id = portifolio?.id ?? 0;
        const retorno = await GetByIdService(Id, `${API_BASE_AGENDA_URL}${UrlPortifolio}`) as ResponseItem<LojaPortifolioItem>;

        setLojaPortifolio(retorno.data ?? {});
    }, []);

    const actionButtons = useMemo(() => ([
        {
            id: 1,
            label: 'Edit',
            icon: <EditRoundedIcon />,
            href: '#',
            onClick: handleUpdateClick
        },
        {
            id: 2,
            label: 'Delete',
            icon: <DeleteIcon />,
            href: '/delete',
            onClick: handleDeleteClick
        }
    ]), [handleUpdateClick, handleDeleteClick]);

    const fetchResultadoPesquisa = useCallback((resultados: PaginacaoItens<LojaPortifolioItem>) => {
        setResultadosBusca(resultados);
    }, []);

    const handleResultadosBusca = (resultados: PaginacaoItens<LojaItens>) => {
        fetchResultadoPesquisa(resultados);
    };
    const gridViewItensMemo = useMemo(() => {
        if (resultadosBusca) {
            return {
                paginacao: resultadosBusca,
                propertyLabels: propertyLabels,
                onPageChange: handlePageChange,
                actionButtons: actionButtons,
            } as GrigViewItens<LojaPortifolioItem>;
        }
        return undefined;

    }, [resultadosBusca, handlePageChange, actionButtons]);

    useEffect(() => {
        if (gridViewItensMemo) {
            setGridView(gridViewItensMemo);
        }
    }, [gridViewItensMemo, fetchLojaPortifolioData]);

    const hasFetchedData = useRef(false);
    useEffect(() => {
        if (!hasFetchedData.current) {
            usuarioData();
            fetchLojaData();
            fetchLojaPortifolioData();
            hasFetchedData.current = true;
        }
    });

    return <>
        <div className='banner'>
            <Banner usuarioLogado={useUsuarioLogado} />
        </div>
        <Grid container className="ContainerGrid" direction="column">
            <div className="conteudo-inLine">
                <div className="persistir-lojaPortifolio">
                    <LojaPortifolioPersistir persistirProps={{ ...persistirItens, item: lojaPortifolio }} />
                </div>
                <div className="busca-lojaPortifolio">
                    <LojaPortifolioBusca
                        selectItens={persistirItens?.selectItems ?? []}
                        onResultadosBusca={handleResultadosBusca} />
                </div>
            </div>
            <div className="lista-lojaPortifolio">
                <GridViewLista gridviewProps={gridViewItens ?? {}} />
            </div>
        </Grid>

        <div className="modal">
            {modalOpen && <ModalGeneric modalProps={modalOpen} />}
        </div>
        <div>
            <Footer />
        </div >
    </>
}
export default LojaPortifolio;