import React, { useState, useCallback, useMemo, useRef } from "react";
import { ModalItem } from "../../Interfaces/shared/modalItem";
import { modalTexto, UrlTipoLoja, UrlPaginado, UrlLoja } from "../../constants/Loja/lojaConstant";
import { PaginacaoItens } from '../../Interfaces/shared/PaginacaoItens';
import { LojaItens } from "../../Interfaces/Loja/lojaItens";
import { TipoLojaItens } from "../../Interfaces/Loja/tipoLojaItens";
import { SelectItens } from '../../Interfaces/shared/selectItens';
import { GetPaginadoService } from "../../services/shared/getPaginadoService";
import { GetByIdService } from "../../services/shared/getByIdService";
import { propertyLabels } from '../../constants/Loja/lojaConstant';
import { GrigViewItens } from "../../Interfaces/shared/gridviewItens";
import { PersistirItens } from "../../Interfaces/shared/persistirItens";
import { ResponseItem } from "../../Interfaces/shared/ResponseItem";
import { DeleteService } from '../../services/shared/deleteService';
import { API_BASE_AGENDA_URL } from '../../config/apiConfig';
import { UsuarioLoginItens } from '../../Interfaces/Usuario/UsuarioLoginItens';
import { GetAllService } from "../../services/shared/getAllService";
import { paginar } from "../../functions/paginacao";
import { useHiddenItem } from '../../hooks/useHiddenItem';
import { FaShop } from "react-icons/fa6";
import { FaThList } from "react-icons/fa";
import { Tooltip } from '@mui/material';
import { Grid } from '@mui/material';
import { useUsuarioLogado } from "../../hooks/useUsuarioLogado";
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteIcon from '@mui/icons-material/Delete';
import Footer from '../../components/footer';
import Banner from '../../components/banner';
import SalaoPersistir from '../Loja/SalaoPersitir';
import GridViewLista from '../../components/gridview';
import SalaoBusca from "./SalaoBusca";
import ModalGeneric from "../../componentsGenerics/modalGeneric";
import useUpdateGrid from "../../hooks/useUpdateGrid";
import useUpdateFetch from '../../hooks/useUpdateFetch';


const Salao: React.FC = () => {
    const [useUsuarioLogadoItem, setUsuarioLogado] = useState<UsuarioLoginItens>();
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
            paginacao.objetos = []
            const lojaResponse = await GetPaginadoService(paginacao, `${API_BASE_AGENDA_URL}${UrlPaginado}`);
            if (lojaResponse) {
                setResultadosBusca(lojaResponse);
            }
        }
    }, [resultadosBusca]);

    const handleUpdateClick = useCallback(async (event: React.MouseEvent, loja?: any) => {
        event.preventDefault();
        const lojaId = loja.id ?? 0;
        const retorno = await GetByIdService(lojaId, `${API_BASE_AGENDA_URL}${UrlLoja}`) as ResponseItem<LojaItens>;
        setLojaItem(retorno.data ?? {});
        handleButtonClickSalvar();
        handleScrollToTop();
    }, []);

    useCallback(() => {
        setModalOpen(undefined);
    }, []);

    const handleModalDesativarLoja = useCallback(async (id: number) => {
        const lojaRetorno = await DeleteService(id, `${API_BASE_AGENDA_URL}${UrlLoja}`);
        if (lojaRetorno) {
            fetchLojaData();
            setModalOpen(undefined);
        }
    }, [fetchLojaData]);

    const handleDeleteClick = useCallback(async (event: React.MouseEvent, loja?: any) => {
        event.preventDefault();
        if (submittingRef.current) return;
        submittingRef.current = true;
        const modalItens: ModalItem = {
            open: true,
            title: loja.razaoSocial,
            texto: modalTexto,
            onClose: () => handleModalDesativarLoja(loja.id)
        }
        setModalOpen(modalItens)
    }, [handleModalDesativarLoja]);

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

    const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, page: number) => {
        fetchLojaData(page);
    }, [fetchLojaData])

    const fetchTipoLojaData = useCallback(async () => {
        const tipoLojaResponse = await GetAllService(`${API_BASE_AGENDA_URL}${UrlTipoLoja}`) as ResponseItem<TipoLojaItens>;
        const itensSelect: SelectItens[] = tipoLojaResponse?.datas?.map((tipo: TipoLojaItens) => ({
            key: tipo.id || '',
            value: tipo.descricao
        })) ?? [];

        const persistirProps: PersistirItens<LojaItens> = {
            selectItems: itensSelect,
            onSave: fetchLojaData,
        };

        setPersistirItems(persistirProps);
    }, [fetchLojaData]);


    const fetchResultadoPesquisa = useCallback((resultados: PaginacaoItens<LojaItens>) => {
        setResultadosBusca(resultados);
    }, []);

    const { fetchUsuarioLogado } = useUsuarioLogado();
    useUpdateFetch([
        async () => setUsuarioLogado(await fetchUsuarioLogado()),
        () => fetchLojaData(), () => fetchTipoLojaData()],
        []
    );

    const gridViewItensMemo = useMemo(() => {
        if (resultadosBusca) {
            return {
                paginacao: resultadosBusca,
                propertyLabels: propertyLabels,
                actionButtons: actionButtons,
                onPageChange: handlePageChange
            } as GrigViewItens<LojaItens>;
        }
        return undefined;
    }, [resultadosBusca, actionButtons, handlePageChange]);


    useUpdateGrid(gridViewItensMemo, setGridView, [persistirItens], () => {
        if (persistirItens?.isSave) {
            setPersistirItems(prev => ({
                ...prev,
                isSave: false,
            }));
            fetchLojaData();
        }
    });


    const handleResultadosBusca = (resultados: PaginacaoItens<LojaItens>) => {
        fetchResultadoPesquisa(resultados);
    };

    const handleScrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleButtonClickSalvar = () => {
        setIsHiddenItem(true);
    }

    const handleButtonClickListar = () => {
        setIsHiddenItem(false);
    }

    return (
        <>
            <div className='banner'>
                <Banner usuarioLogado={useUsuarioLogadoItem} />
            </div>

            <div className="persistir">
                <div className="links-item">
                    <button onClick={handleButtonClickListar} className="botao-link">
                        <Tooltip title="listar">
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                <FaThList />
                            </span>
                        </Tooltip>
                    </button>
                </div>
                <div className="form-persitir">
                    <SalaoPersistir persistirProps={{ ...persistirItens, item: lojaItem }} />
                </div>
            </div>
            <div className="lista">
                <div className="links-item">
                    <button onClick={handleButtonClickSalvar} className="botao-link">
                        <Tooltip title="novo">
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                <FaShop />
                            </span>
                        </Tooltip>
                    </button>
                </div>
                <div className="form-persitir">
                    <SalaoBusca
                        selectItens={persistirItens?.selectItems ?? []}
                        onResultadosBusca={handleResultadosBusca}
                    />
                </div>
                <div className="grid">
                    <div className="conteudo">
                        <Grid container spacing={2} className="ContainerGrid">

                            <fieldset className='icone-box icone-box-form'>
                                <legend>Lista</legend>
                                <Grid item xs={12} md={12}>
                                    <GridViewLista gridviewProps={gridViewItens ?? {}} />
                                </Grid>
                            </fieldset>
                        </Grid>
                    </div>
                </div>
            </div>

            <div className="modal">
                {modalOpen && <ModalGeneric modalProps={modalOpen} />}
            </div>
            <div>
                <Footer />
            </div >
        </>
    )
}

export default Salao;
