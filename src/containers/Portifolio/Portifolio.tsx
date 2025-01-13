import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import { PortifolioItem } from "../../Interfaces/Portifolio/portifolioItem";
import { Grid } from '@mui/material';
import { UsuarioLoginItens } from '../../Interfaces/Usuario/UsuarioLoginItens';
import { GetAllService } from '../../services/shared/getAllService';
import { PaginacaoItens } from '../../Interfaces/shared/PaginacaoItens';
import { ModalItem } from "../../Interfaces/shared/modalItem";
import { PersistirItens } from "../../Interfaces/shared/persistirItens";
import { LojaItens } from "../../Interfaces/Loja/lojaItens";
import { API_BASE_URL, API_BASE_AGENDA_URL } from '../../config/apiConfig';
import { UrlUsuarioLogado } from "../../constants/Usuario/usuarioConstant";
import { GetPaginadoService } from "../../services/shared/getPaginadoService";
import { DeleteService } from "../../services/shared/deleteService";
import { GetByIdService } from "../../services/shared/getByIdService";
import {
    ModalTexto, propertyLabelsColaborador, UrlBuscarPaginado, UrlPortifolio, TipoUsuarioPortifolioColaboradorId,
    TipoUsuarioPortifolioLojaId, UrlTipoPortifolioImagem,
    propertyLabelsLoja
} from '../../constants/Portifolio/PortifolioConstant';
import { GrigViewItens } from "../../Interfaces/shared/gridviewItens";
import { UrlBuscarTodos } from "../../constants/Loja/lojaConstant";
import { ResponseItem } from "../../Interfaces/shared/ResponseItem";
import { TipoPortifolioImagemItem } from "../../Interfaces/Portifolio/tipoPortifolioImagemItem";
import { UrlColaborador } from "../../constants/Colaborador/colaboradorConstant";
import { mapToSelectItens } from '../../Interfaces/shared/mapToSelectItens';
import { ColaboradorItens } from "../../Interfaces/Colaborador/colaboradorItem";
import GridViewLista from "../../components/gridview";
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteIcon from '@mui/icons-material/Delete';
import ModalGeneric from "../../componentsGenerics/modalGeneric";
import PortifolioPersistir from './PortifolioPersistir';
import Banner from '../../components/banner';
import Footer from '../../components/footer';
import PortifolioBusca from "./PortifolioBusca";


import '../../assets/styles/Portifolio/Portifolio.css'

const Portifolio: React.FC = () => {
    const [useUsuarioLogado, setUsuarioLogado] = useState<UsuarioLoginItens>();
    const [persistirItensList, setPersistirItensList] = useState<Array<PersistirItens<any>>>([]);
    const [resultadosBusca, setResultadosBusca] = useState<PaginacaoItens<PortifolioItem>>();
    const [portifolioitem, setPortifolio] = useState<PortifolioItem>();
    const [modalOpen, setModalOpen] = useState<ModalItem>();
    const [gridViewItens, setGridView] = useState<GrigViewItens<PortifolioItem> | undefined>(undefined);
    const [tipoPortifolioImagem, setTipoPortifolioImagem] = useState<Array<TipoPortifolioImagemItem>>([])
    const { urlParametro } = useParams();

    const tipoUsuarioPortifolioId =
        urlParametro === "Loja" ? TipoUsuarioPortifolioLojaId : urlParametro === "Colaborador" ? TipoUsuarioPortifolioColaboradorId : "";
    const usuarioData = useCallback(async () => {
        const [sessao] = await Promise.all([
            GetAllService(`${API_BASE_URL}${UrlUsuarioLogado}`) as ResponseItem<UsuarioLoginItens>
        ]);
        setUsuarioLogado(sessao);
    }, []);


    const fetchPortifolioData = useCallback(async (tipoUsuarioPortifolioId?: string, page: number = 1) => {

        const tipoUsuarioPortifolioItem =
        urlParametro === "Loja" ? TipoUsuarioPortifolioLojaId : urlParametro === "Colaborador" ? TipoUsuarioPortifolioColaboradorId : "";


        const paginacao: PaginacaoItens<PortifolioItem> = {
            quantidadePagina: resultadosBusca?.quantidadePagina || 6,
            paginaAtual: page,
            totalPaginas: resultadosBusca?.totalPaginas || 1,
            total: resultadosBusca?.total || 0,
            objetoPesquisa: {},
            objetos: resultadosBusca?.objetos ?? []
        };

        if (!resultadosBusca || page !== undefined) {
            paginacao.objetos = [];

            paginacao.objetoPesquisa = resultadosBusca?.objetoPesquisa || {};
            paginacao.objetoPesquisa.tipoUsuarioPortifolioId = Number(tipoUsuarioPortifolioId) || Number(tipoUsuarioPortifolioItem);
            const response = await GetPaginadoService(paginacao, `${API_BASE_AGENDA_URL}${UrlBuscarPaginado}`);
            if (response) {
                setResultadosBusca(response ?? {});
            }
        }
    }, [resultadosBusca, urlParametro]);

    const fetchLojaData = useCallback(async () => {
        const lojaResponse = await GetAllService(`${API_BASE_AGENDA_URL}${UrlBuscarTodos}`) as ResponseItem<LojaItens>;
        const itensSelect = mapToSelectItens(lojaResponse?.datas, 'id', 'razaoSocial');
        const persistirPropsLoja: PersistirItens<LojaItens> = {
            selectItems: itensSelect,
            name: 'loja',
            onSave: async (tipoUsuarioPortifolioId?: string) => {
                await fetchPortifolioData(tipoUsuarioPortifolioId ?? '');
            },
        };
        setPersistirItensList((prevList) => [...prevList, persistirPropsLoja]);
    }, [fetchPortifolioData]);

    const fetchTipoUsuariosImagens = useCallback(async () => {
        const tipoPortifolioImagensResponse = await GetByIdService(
            tipoUsuarioPortifolioId,
            `${API_BASE_AGENDA_URL}${UrlTipoPortifolioImagem}`
        ) as ResponseItem<TipoPortifolioImagemItem>;

        setTipoPortifolioImagem(tipoPortifolioImagensResponse?.datas ?? []);
        await fetchPortifolioData(tipoUsuarioPortifolioId ?? '');
    }, [tipoUsuarioPortifolioId, fetchPortifolioData]);

    const handleScrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const fetchColaboradorData = useCallback(async () => {
        const colaboradorResponse = await GetAllService(`${API_BASE_AGENDA_URL}${UrlColaborador}`) as ResponseItem<ColaboradorItens>;
        const itensSelect = mapToSelectItens(colaboradorResponse?.datas, 'id', 'nome');
        const persistirPropsColaborador: PersistirItens<ColaboradorItens> = {
            selectItems: itensSelect,
            name: 'colaborador',
            onSave: async (tipoUsuarioPortifolioId?: string) => {
                await fetchPortifolioData(tipoUsuarioPortifolioId ?? '');
            },
        };
        setPersistirItensList((prevList) => [...prevList, persistirPropsColaborador]);
    }, [fetchPortifolioData]);

    const handleModalDesativarPortifolio = useCallback(async (id: number) => {
        const lojaRetorno = await DeleteService(id, `${API_BASE_AGENDA_URL}${UrlPortifolio}`) as ResponseItem<PortifolioItem>;
        if (lojaRetorno) {
            fetchPortifolioData(tipoUsuarioPortifolioId);
        }
    }, [fetchPortifolioData, tipoUsuarioPortifolioId]);

    const handleDeleteClick = useCallback(
        async (event: React.MouseEvent, portifolio?: any) => {
            event.preventDefault();
            const modalprops: ModalItem = {
                open: true,
                onClose: () => handleModalDesativarPortifolio(portifolio?.id),
                title: portifolio?.titulo ?? "",
                texto: ModalTexto,
            };
            setModalOpen(modalprops);
        },
        [handleModalDesativarPortifolio]
    );

    const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, page: number) => {
        fetchPortifolioData(tipoUsuarioPortifolioId, page);
    }, [fetchPortifolioData, tipoUsuarioPortifolioId])

    const handleUpdateClick = useCallback(async (event: React.MouseEvent, portifolio?: any) => {
        event.preventDefault();
        const Id = portifolio?.id ?? 0;
        const retorno = await GetByIdService(Id, `${API_BASE_AGENDA_URL}${UrlPortifolio}`) as ResponseItem<PortifolioItem>;
        retorno.data = {
            ...retorno.data,
            tipoUsuarioPortifolioId: Number(tipoUsuarioPortifolioId ?? 0),
        };
        setPortifolio(retorno.data);

        handleScrollToTop();

    }, [tipoUsuarioPortifolioId]);
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

    const fetchResultadoPesquisa = useCallback((resultados: PaginacaoItens<PortifolioItem>) => {
        setResultadosBusca(resultados);
    }, []);

    const handleResultadosBusca = (resultados: PaginacaoItens<PortifolioItem>) => {
        fetchResultadoPesquisa(resultados);
    };
    const gridViewItensMemo = useMemo(() => {
        if (resultadosBusca) {     
            return {
                paginacao: resultadosBusca,
                propertyLabels: tipoUsuarioPortifolioId === TipoUsuarioPortifolioLojaId ? propertyLabelsLoja : propertyLabelsColaborador,
                onPageChange: handlePageChange,
                actionButtons: actionButtons,
            } as GrigViewItens<PortifolioItem>;;
        }
        return undefined;
    }, [resultadosBusca, actionButtons, handlePageChange, tipoUsuarioPortifolioId]);
    const hasFetchedData = useRef(false);
    useEffect(() => {
        if (!hasFetchedData.current) {
            usuarioData();
            fetchLojaData();
            fetchPortifolioData(tipoUsuarioPortifolioId);
            fetchColaboradorData();
            fetchTipoUsuariosImagens();
            hasFetchedData.current = true;
        }
    }, [
        usuarioData,
        fetchLojaData,
        fetchPortifolioData,
        fetchTipoUsuariosImagens,
        fetchColaboradorData,
        tipoUsuarioPortifolioId
    ]);

    useEffect(() => {
        if (gridViewItensMemo) {
            setGridView(gridViewItensMemo);    
        }
    }, [gridViewItensMemo, fetchPortifolioData]);

    useEffect(() => {
        if (urlParametro) {
            fetchPortifolioData(tipoUsuarioPortifolioId);
            fetchTipoUsuariosImagens()
        }
    }, [urlParametro, tipoUsuarioPortifolioId, fetchPortifolioData, fetchTipoUsuariosImagens]);
    return <>
        <div className='banner'>
            <Banner usuarioLogado={useUsuarioLogado} />
        </div>
        <Grid container className="ContainerGrid" direction="column">
            <div className="conteudo-inLine">
                <div className="persistir-Portifolio">
                    <PortifolioPersistir
                        persistirProps={{ item: portifolioitem }}
                        tiposPortifolioImagem={tipoPortifolioImagem}
                        persistirDropProps={persistirItensList}
                        tipoUsuarioPortifolio={tipoUsuarioPortifolioId}
                    />
                </div>
                <div className="busca-Portifolio">
                    <PortifolioBusca
                        selectItens={persistirItensList ?? []}
                        tipoUsuarioPortifolioId={tipoUsuarioPortifolioId}
                        onResultadosBusca={handleResultadosBusca} />
                </div>
            </div>
            <div className="lista-Portifolio">
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
export default Portifolio;