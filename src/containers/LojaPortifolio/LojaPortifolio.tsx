import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { LojaPortifolioItem } from "../../Interfaces/LojaPortifolio/lojaportifolioItem";
import { Grid } from '@mui/material';
import { UsuarioLogadoItens } from '../../Interfaces/Usuario/UsuarioLogadoItens';
import { UsuarioLogadoService } from '../../services/Perfil/usuarioLogadoService';
import { PaginacaoItens } from '../../Interfaces/shared/PaginacaoItens';
import { ModalItem } from "../../Interfaces/shared/modalItem";
import { PersistirItens } from "../../Interfaces/shared/persistirItens";
import { SelectItens } from '../../Interfaces/shared/selectItens';
import { LojaItens } from "../../Interfaces/Loja/lojaItens";
import { LojaBuscarTodosService } from '../../services/Loja/lojaBuscarTodosService';
import { LojaPortifolioPaginadoService } from "../../services/LojaPortifolio/LojaPortifolioPaginadoService";
import { LojaPortifolioExcluirService } from "../../services/LojaPortifolio/LojaPortifolioExcluirService";
import { LojaPortifolioBuscaPorIdService } from "../../services/LojaPortifolio/LojaPortifolioBuscarPorIdService";
import { ModalTexto, propertyLabels } from '../../constants/LojaPortifolio/LojaPortifolioConstant';
import { GrigViewItens } from "../../Interfaces/shared/gridviewItens";
import GridViewLista from "../../components/gridview";
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteIcon from '@mui/icons-material/Delete';
import ModalGeneric from "../../componentsGenerics/modalGeneric";
import LojaPortifolioPersistir from './LojaPortifolioPersistir';
import Banner from '../../components/banner';
import Footer from '../../components/footer';
import LojaPortifolioBusca from "./lojaPortifolioBusca";

import '../../assets/styles/Loja/lojaPortifolio.css'

const LojaPortifolio: React.FC = () => {
    const [useUsuarioLogado, setUsuarioLogado] = useState<UsuarioLogadoItens>();
    const [persistirItens, setPersistirItems] = useState<PersistirItens<LojaPortifolioItem>>();
    const [resultadosBusca, setResultadosBusca] = useState<PaginacaoItens<LojaPortifolioItem>>();
    const [lojaPortifolio, setLojaPortifolio] = useState<LojaPortifolioItem>();
    const [modalOpen, setModalOpen] = useState<ModalItem>();
    const [gridViewItens, setGridView] = useState<GrigViewItens<LojaPortifolioItem>>();

    const usuarioData = useCallback(async () => {
        const [sessao] = await Promise.all([UsuarioLogadoService()]);
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
            const lojaResponse = await LojaPortifolioPaginadoService(paginacao);
            if (lojaResponse) {
                setResultadosBusca(lojaResponse);
            }
        }
    }, [resultadosBusca]);

    const fetchLojaData = useCallback(async () => {
        const lojaResponse = await LojaBuscarTodosService();
        const itensSelect: SelectItens[] = lojaResponse?.map((loja: LojaItens) => ({
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
        const lojaRetorno = await LojaPortifolioExcluirService(id);
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
        const retorno = await LojaPortifolioBuscaPorIdService(Id);

        setLojaPortifolio(retorno ?? {});
    },[]);

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