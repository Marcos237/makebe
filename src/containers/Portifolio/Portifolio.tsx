import React, { useState, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { PortifolioItem } from "../../Interfaces/Portifolio/portifolioItem";
import { UsuarioLoginItens } from '../../Interfaces/Usuario/UsuarioLoginItens';
import { PaginacaoItens } from '../../Interfaces/shared/PaginacaoItens';
import { ModalItem } from "../../Interfaces/shared/modalItem";
import { PersistirItens } from "../../Interfaces/shared/persistirItens";
import { API_BASE_AGENDA_URL } from '../../config/apiConfig';
import { useUsuarioLogado } from "../../hooks/useUsuarioLogado";
import { GetPaginadoService } from "../../services/shared/getPaginadoService";
import { DeleteService } from "../../services/shared/deleteService";
import { GetByIdService } from "../../services/shared/getByIdService";
import {
    ModalTexto, propertyLabelsColaborador, UrlBuscarPaginado, UrlPortifolio, UrlTipoPortifolioImagem, propertyLabelsLoja
} from '../../constants/Portifolio/PortifolioConstant';
import { TipoUsuarioLojaId, TipoUsuarioColaboradorId } from '../../constants/Usuario/usuarioConstant';
import { GrigViewItens } from "../../Interfaces/shared/gridviewItens";
import { ResponseItem } from "../../Interfaces/shared/ResponseItem";
import { TipoPortifolioImagemItem } from "../../Interfaces/Portifolio/tipoPortifolioImagemItem";
import { useColaboradorData } from '../../hooks/useColaboradorData';
import { useLojaData } from "../../hooks/useLojaData";
import { useHiddenItem } from '../../hooks/useHiddenItem';
import { Tooltip } from '@mui/material';
import { Grid } from '@mui/material';
import { FaThList } from "react-icons/fa";
import { FaFolderOpen } from "react-icons/fa";
import PortifolioBusca from "../Portifolio/PortifolioBusca"
import GridViewLista from '../../components/gridview';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteIcon from '@mui/icons-material/Delete';
import ModalGeneric from "../../componentsGenerics/modalGeneric";
import PortifolioPersistir from './PortifolioPersistir';
import Banner from '../../components/banner';
import Footer from '../../components/footer';
import useUpdateGrid from "../../hooks/useUpdateGrid";
import useUpdateFetch from '../../hooks/useUpdateFetch';
import useFetchTipo from "../../hooks/useFetchTipo";

import '../../assets/styles/formularios/portifolio.css'


const Portifolio: React.FC = () => {
    const [useUsuarioLogadoItem, setUsuarioLogado] = useState<UsuarioLoginItens>();
    const [persistirItensList, setPersistirItensList] = useState<Array<PersistirItens<any>>>([]);
    const [resultadosBusca, setResultadosBusca] = useState<PaginacaoItens<PortifolioItem>>();
    const [portifolioitem, setPortifolio] = useState<PortifolioItem>();
    const [modalOpen, setModalOpen] = useState<ModalItem>();
    const [gridViewItens, setGridView] = useState<GrigViewItens<PortifolioItem> | undefined>(undefined);
    const [tipoPortifolioImagem, setTipoPortifolioImagem] = useState<Array<TipoPortifolioImagemItem>>([])
    const { urlParametro } = useParams();
    const [isHiddenItem, setIsHiddenItem] = useState(false);


    useHiddenItem("persistir", "lista", isHiddenItem);

    const tipoUsuarioId =
        urlParametro === "Loja" ? TipoUsuarioLojaId : urlParametro === "Colaborador" ? TipoUsuarioColaboradorId : "";

    const fetchPortifolioData = useCallback(async (tipoUsuarioId?: string, page: number = 1) => {

        const TipoUsuarioItem =
            urlParametro === "Loja" ? TipoUsuarioLojaId : urlParametro === "Colaborador" ? TipoUsuarioColaboradorId : "";
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
            paginacao.objetoPesquisa.tipoUsuarioId = Number(tipoUsuarioId) || Number(TipoUsuarioItem);
            const response = await GetPaginadoService(paginacao, `${API_BASE_AGENDA_URL}${UrlBuscarPaginado}`);
            if (response) {
                setResultadosBusca(response ?? {});
            }
        }
    }, [resultadosBusca, urlParametro]);

    const fetchTipoUsuariosImagens = useCallback(async () => {

        const tipoPortifolioImagensResponse = await GetByIdService(tipoUsuarioId, `${API_BASE_AGENDA_URL}${UrlTipoPortifolioImagem}`
        ) as ResponseItem<TipoPortifolioImagemItem>;
        setTipoPortifolioImagem(tipoPortifolioImagensResponse?.datas ?? []);
        await fetchPortifolioData(tipoUsuarioId ?? '');
    }, [tipoUsuarioId, fetchPortifolioData]);

    const handleScrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleModalDesativarPortifolio = useCallback(async (id: number) => {
        const lojaRetorno = await DeleteService(id, `${API_BASE_AGENDA_URL}${UrlPortifolio}`) as ResponseItem<PortifolioItem>;
        if (lojaRetorno) {
            fetchPortifolioData(tipoUsuarioId);
        }
    }, [fetchPortifolioData, tipoUsuarioId]);

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
        fetchPortifolioData(tipoUsuarioId, page);
    }, [fetchPortifolioData, tipoUsuarioId])

    const handleUpdateClick = useCallback(async (event: React.MouseEvent, portifolio?: any) => {
        event.preventDefault();
        const Id = portifolio?.id ?? 0;
        const retorno = await GetByIdService(Id, `${API_BASE_AGENDA_URL}${UrlPortifolio}`) as ResponseItem<PortifolioItem>;
        retorno.data = {
            ...retorno.data,
            tipoUsuarioId: Number(tipoUsuarioId ?? 0),
        };
        setPortifolio(retorno.data);
        handleButtonClickSalvar();
        handleScrollToTop();

    }, [tipoUsuarioId]);
    const actionButtons = useMemo(() => ([
        {
            id: 1,
            label: 'Edit',
            icon: <EditRoundedIcon />,
            href: '#',
            class: "btn-busca",
            onClick: handleUpdateClick
        },
        {
            id: 2,
            label: 'Delete',
            icon: <DeleteIcon />,
            href: '/delete',
            class: "btn-danger",
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
                propertyLabels: tipoUsuarioId === TipoUsuarioLojaId ? propertyLabelsLoja : propertyLabelsColaborador,
                onPageChange: handlePageChange,
                actionButtons: actionButtons,
            } as GrigViewItens<PortifolioItem>;;
        }
        return undefined;
    }, [resultadosBusca, actionButtons, handlePageChange, tipoUsuarioId]);

    const { fetchUsuarioLogado } = useUsuarioLogado();
    const { fetchColaboradorData } = useColaboradorData(async (id) => {
        await fetchPortifolioData(id);
    });
    const { fetchLojaData } = useLojaData(async (id) => { await fetchPortifolioData(id); });
    useUpdateFetch([
        async () => setUsuarioLogado(await fetchUsuarioLogado()),
        async () => {
            const loja = await fetchLojaData()
            setPersistirItensList(prev => [...prev, loja]);
        },
        async () => {
            const colaborador = await fetchColaboradorData();
            setPersistirItensList(prev => [...prev, colaborador]);
        },
        () => fetchPortifolioData(tipoUsuarioId),
        fetchTipoUsuariosImagens
    ], [tipoUsuarioId]);

    useFetchTipo(
        urlParametro ?? "", [() => fetchPortifolioData(tipoUsuarioId), fetchTipoUsuariosImagens],
        TipoUsuarioLojaId,
        TipoUsuarioColaboradorId
    );


    useUpdateGrid(gridViewItensMemo, setGridView, [persistirItensList], () => {
        let isSave = persistirItensList.find(item => item.isSave)?.isSave;
        if (isSave) {
            persistirItensList.map(item => item.isSave = false)
            fetchPortifolioData(tipoUsuarioId)
        }
    });

    const handleButtonClickSalvar = () => {
        setIsHiddenItem(true);
    }

    const handleButtonClickListar = () => {
        setIsHiddenItem(false);
    }

    return <>
        <div className='banner'>
            <Banner usuarioLogado={useUsuarioLogadoItem} />
        </div>

        <div className="persistir">
            <div className="nav-item">
                <button onClick={handleButtonClickListar}
                    className="btn-padrao"
                    type="button">
                    <Tooltip title="listar">
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <FaThList />
                        </span>
                    </Tooltip>
                </button>
            </div>


            <div className="persistir">
                <div className="form-persitir">
                    <PortifolioPersistir persistirProps={{ item: portifolioitem }}
                        tiposPortifolioImagem={tipoPortifolioImagem}
                        persistirDropProps={persistirItensList}
                        tipoUsuario={tipoUsuarioId}
                    />
                </div>
            </div>
        </div>

        <div className="lista">
            <div className="nav-item">
                <button onClick={handleButtonClickSalvar}
                    className="btn-padrao">
                    <Tooltip title="novo">
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <FaFolderOpen />
                        </span>
                    </Tooltip>
                </button>
            </div>
            <div className="form-persitir">
                <PortifolioBusca
                    selectItens={persistirItensList ?? []}
                    tipoUsuarioId={tipoUsuarioId}
                    onResultadosBusca={handleResultadosBusca} />
            </div>
            <div className="form-persitir">

                <Grid container spacing={2} className="ContainerGrid">
                    <div className="conteudo">

                        <fieldset className='icone-box icone-box-form'>
                            <legend>Lista</legend>
                            <Grid item xs={12} md={12}>
                                <GridViewLista gridviewProps={gridViewItens ?? {}} />
                            </Grid>
                        </fieldset>

                    </div>
                </Grid>
            </div >
        </div >
        <div className="modal">
            {modalOpen && <ModalGeneric modalProps={modalOpen} />}
        </div>
        <div>
            <Footer />
        </div >
    </>
}
export default Portifolio;