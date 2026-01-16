import React, { useState, useCallback, useMemo } from "react";
import { UsuarioLoginItens } from '../../Interfaces/Usuario/UsuarioLoginItens';
import { GetAllService } from '../../services/shared/getAllService';
import { PersistirItens } from "../../Interfaces/shared/persistirItens";
import { PaginacaoItens } from '../../Interfaces/shared/PaginacaoItens';
import { GetPaginadoService } from '../../services/shared/getPaginadoService';
import { API_BASE_URL, API_BASE_AGENDA_URL } from '../../config/apiConfig';
import { UrlUsuarioLogado } from "../../constants/Usuario/usuarioConstant";
import { propertyLabels, UrlBuscarPaginado, UrlServico, ModalTexto } from "../../constants/Servicos/servicoConstant";
import { Grid } from '@mui/material';
import { ServicosItens } from "../../Interfaces/Produto/servicosItens";
import { paginar } from "../../functions/paginacao";
import { ResponseItem } from '../../Interfaces/shared/ResponseItem';
import { GetByIdService } from "../../services/shared/getByIdService";
import { GrigViewItens } from "../../Interfaces/shared/gridviewItens";
import { ModalItem } from "../../Interfaces/shared/modalItem";
import { DeleteService } from "../../services/shared/deleteService";
import { useHiddenItem } from '../../hooks/useHiddenItem';
import { FaCog, FaCogs } from "react-icons/fa";
import { Tooltip } from '@mui/material';
import ModalGeneric from "../../componentsGenerics/modalGeneric";
import DeleteIcon from '@mui/icons-material/Delete';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import Banner from "../../components/banner";
import Footer from "../../components/footer";
import useUpdateGrid from "../../hooks/useUpdateGrid";
import useUpdateFetch from '../../hooks/useUpdateFetch';
import ServicoPersistir from "./servicoPersistir";
import ServicoBusca from "./servicoBusca";
import GridViewLista from '../../components/gridview';

import '../../assets/styles/formularios/servico.css'

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
        const paginacao = paginar(resultadosBusca, page)
        if (!resultadosBusca || page !== undefined) {
            paginacao.objetos = []
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

    const fetchPersistirData = useCallback(async () => {
        const persistirProps: PersistirItens<ServicosItens> = {
            onSave: fetchServicoData,
        };
        stePersistirItens(persistirProps);
    }, [fetchServicoData]);

    const handleUpdateClick = useCallback(async (event: React.MouseEvent, servico?: any) => {

        event.preventDefault();
        const servicoId = servico.id ?? '';
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
        }
        setModalOpen(modalItens)
    }, [handleModalDesativar]);

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

    useCallback(() => {
        setModalOpen(undefined);
    }, []);

    const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, page: number) => {
        fetchServicoData(page);
    }, [fetchServicoData])

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


    return <>
        <div className='banner'>
            <Banner usuarioLogado={useUsuarioLogado} />
        </div>

        <div className="persistir">
            <div className="links-item">
                <button onClick={handleButtonClickListar} className="botao-link">
                    <Tooltip title="listar">
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <FaCogs />
                        </span>
                    </Tooltip>
                </button>
            </div>
            <ServicoPersistir
                persistirProps={{
                    ...persistirItens,
                    item: servicoItem,
                }}
            />
        </div>


        <div className="lista">
            <div className="links-item">
                <button onClick={handleButtonClickSalvar} className="botao-link">
                    <Tooltip title="novo">
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <FaCog />
                        </span>
                    </Tooltip>
                </button>
            </div>
            <div className="form-persitir">
                <ServicoBusca
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
}

export default Servico;