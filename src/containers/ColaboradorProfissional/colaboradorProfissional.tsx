
import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { UsuarioLoginItens } from '../../Interfaces/Usuario/UsuarioLoginItens';
import { GetAllService } from '../../services/shared/getAllService';
import { PersistirItens } from "../../Interfaces/shared/persistirItens";
import { API_BASE_URL, API_BASE_AGENDA_URL } from '../../config/apiConfig';
import { UrlUsuarioLogado } from "../../constants/Usuario/usuarioConstant";
import { ResponseItem } from '../../Interfaces/shared/ResponseItem';
import { UrlColaborador } from '../../constants/Colaborador/colaboradorConstant';
import { UrlBuscarPaginado, UrlColaboradorProfissional, UrlServico, ModalTexto, propertyLabels }
 from "../../constants/ColaboradorProfissional/colaboradorProfissionalConstant";
import { UrlLoja } from "../../constants/Loja/lojaConstant";
import { PaginacaoItens } from '../../Interfaces/shared/PaginacaoItens';
import { mapToSelectItens } from '../../Interfaces/shared/mapToSelectItens';
import { Grid } from '@mui/material';
import { ColaboradorProfissionalItem } from "../../Interfaces/ColaboradorProfissional/colaboradorProfissionalItem";
import { GrigViewItens } from "../../Interfaces/shared/gridviewItens";
import { ColaboradorItens } from '../../Interfaces/Colaborador/colaboradorItem';
import { GetPaginadoService } from '../../services/shared/getPaginadoService';
import { GetByIdService } from "../../services/shared/getByIdService";
import { LojaItens } from "../../Interfaces/Loja/lojaItens";
import { ServicosItens } from "../../Interfaces/Colaborador/servicosItens";
import { ModalItem } from "../../Interfaces/shared/modalItem";
import { DeleteService } from "../../services/shared/deleteService";
import ColaboradorProfissionalBusca from '../ColaboradorProfissional/colaboradorProfissionalBusca';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import GridViewLista from '../../components/gridview';
import Banner from "../../components/banner";
import Footer from "../../components/footer";
import DeleteIcon from '@mui/icons-material/Delete';
import ColaboradorPersistir from './colaboradorProfissionalPersistir';
import ModalGeneric from "../../componentsGenerics/modalGeneric";

import "../../assets/styles/ColaboradorProfissional/colaboradorProfissional.css";



const ColaboradorProfissional: React.FC = () => {
    const [colaboradorProfissionalItem, setColaboradorProfissional] = useState<ColaboradorProfissionalItem>();
    const [useUsuarioLogado, setUsuarioLogado] = useState<UsuarioLoginItens>();
    const [resultadosBusca, setResultadosBusca] = useState<PaginacaoItens<ColaboradorProfissionalItem>>();
    const [gridViewItens, setGridView] = useState<GrigViewItens<ColaboradorProfissionalItem>>();
    const [persistirItensList, setPersistirItensList] = useState<Array<PersistirItens<any>>>([]);
    const [modalOpen, setModalOpen] = useState<ModalItem>();

    const fetchColaboradorProfissionalData = useCallback(async (page: number = 1) => {
        const paginacao: PaginacaoItens<ColaboradorProfissionalItem> = {
            quantidadePagina: resultadosBusca?.quantidadePagina || 6,
            paginaAtual: page,
            totalPaginas: resultadosBusca?.totalPaginas || 1,
            total: resultadosBusca?.total || 0,
            objetoPesquisa: resultadosBusca?.objetoPesquisa || undefined,
            objetos: resultadosBusca?.objetos ?? []
        };
        if (!resultadosBusca || page !== undefined) {
            paginacao.objetos = []
            const colaboradorReponse = await GetPaginadoService(paginacao, `${API_BASE_AGENDA_URL}${UrlBuscarPaginado}`);
            if (colaboradorReponse) {
                setResultadosBusca(colaboradorReponse);
            }
        }

    }, [resultadosBusca]);

    const usuarioData = useCallback(async () => {
        const [sessao] = await Promise.all([
            GetAllService(`${API_BASE_URL}${UrlUsuarioLogado}`) as ResponseItem<UsuarioLoginItens>

        ]);
        setUsuarioLogado(sessao);
    }, []);

    const fetchColaboradorData = useCallback(async () => {
        const colaboradorResponse = await GetAllService(`${API_BASE_AGENDA_URL}${UrlColaborador}`) as ResponseItem<ColaboradorItens>;
        const itensSelect = mapToSelectItens(colaboradorResponse?.datas, 'id', 'nome');
        const persistirPropsColaborador: PersistirItens<ColaboradorItens> = {
            selectItems: itensSelect,
            name: 'colaborador',
            onSave: fetchColaboradorProfissionalData,
        };
        setPersistirItensList((prevList) => [...prevList, persistirPropsColaborador]);
    }, [fetchColaboradorProfissionalData]);

    const fetchLojaData = useCallback(async () => {
        const lojaResponse = await GetAllService(`${API_BASE_AGENDA_URL}${UrlLoja}`) as ResponseItem<LojaItens>;
        const itensSelect = mapToSelectItens(lojaResponse?.datas, 'id', 'razaoSocial');

        const persistirPropsLoja: PersistirItens<LojaItens> = {
            selectItems: itensSelect,
            name: 'loja',
            onSave: fetchColaboradorProfissionalData,
        };

        setPersistirItensList((prevList) => [...prevList, persistirPropsLoja]);
    }, [fetchColaboradorProfissionalData]);

    const fetchServicoData = useCallback(async () => {
        const servicoResponse = await GetAllService(`${API_BASE_AGENDA_URL}${UrlServico}`) as ResponseItem<ServicosItens>;
        const itensSelect = mapToSelectItens(servicoResponse?.datas, 'id', 'descricao');

        const persistirPropsServico: PersistirItens<ServicosItens> = {
            selectItems: itensSelect,
            name: 'servico',
            onSave: fetchColaboradorProfissionalData,
        };
        setPersistirItensList((prevList) => [...prevList, persistirPropsServico]);
    }, [fetchColaboradorProfissionalData]);

    const handleUpdateClick = useCallback(async (event: React.MouseEvent, colaborador?: any) => {
        event.preventDefault();
        const colaboradorProfissonalId = colaborador.id ?? 0;
        const retorno = await GetByIdService(colaboradorProfissonalId, `${API_BASE_AGENDA_URL}${UrlColaboradorProfissional}`) as ResponseItem<ColaboradorProfissionalItem>
        setColaboradorProfissional(retorno?.data ?? undefined);
        handleScrollToTop();
    }, []);

    const handleModalDesativar = useCallback(async (id: number) => {
        const responseColaborador = await DeleteService(id, `${API_BASE_AGENDA_URL}${UrlColaboradorProfissional}`);
        if (responseColaborador) {
            fetchColaboradorProfissionalData();
            setModalOpen(undefined);
        }
    }, [fetchColaboradorProfissionalData]);

    const handleDeleteClick = useCallback(async (event: React.MouseEvent, colaborador?: any) => {
        event.preventDefault();
        const modalItens: ModalItem = {
            open: true,
            title: colaborador.nomeColaborador,
            texto: ModalTexto,
            onClose: () => handleModalDesativar(colaborador.id)
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

    const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, page: number) => {
        fetchColaboradorProfissionalData(page);
    }, [fetchColaboradorProfissionalData])

    useCallback(() => {
        setModalOpen(undefined);
    }, []);

    const hasFetchedData = useRef(false);
    useEffect(() => {
        if (!hasFetchedData.current) {
            usuarioData();
            fetchLojaData();
            fetchColaboradorData();
            fetchServicoData();
            fetchColaboradorProfissionalData();
            hasFetchedData.current = true;
        }
    }, [
        usuarioData,
        fetchLojaData,
        fetchColaboradorData,
        fetchServicoData,
        fetchColaboradorProfissionalData
    ]);
    const gridViewItensMemo = useMemo(() => {
        if (resultadosBusca) {
            return {
                paginacao: resultadosBusca,
                propertyLabels: propertyLabels,
                actionButtons: actionButtons,
                onPageChange: handlePageChange
            } as GrigViewItens<ColaboradorProfissionalItem>;
        }
        return undefined;
    }, [resultadosBusca, actionButtons, handlePageChange]);


    useEffect(() => {
        if (gridViewItensMemo) {
            setGridView(gridViewItensMemo)
        }
    }, [gridViewItensMemo, fetchColaboradorProfissionalData]);

    const handleResultadosBusca = (resultados: PaginacaoItens<ColaboradorProfissionalItem>) => {
        fetchResultadoPesquisa(resultados);
    };

    const fetchResultadoPesquisa = useCallback((resultados: PaginacaoItens<ColaboradorProfissionalItem>) => {
        setResultadosBusca(resultados);
    }, []);

    const handleScrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return <>
        <div className='banner'>
            <Banner usuarioLogado={useUsuarioLogado} />
        </div>
        <Grid container className="ContainerGrid" direction="column">
            <div className="conteudo-inLine">
                <div className="persistir-colaboradorProfissional">
                    <ColaboradorPersistir
                        persistirProps={{
                            item: colaboradorProfissionalItem,
                        }}
                        persistirDropProps={persistirItensList ?? []}
                    />
                </div>

                <div className="busca-colaboradorProfissional">
                    <ColaboradorProfissionalBusca
                        selectItens={persistirItensList ?? []}
                        onResultadosBusca={handleResultadosBusca}
                    />
                </div>

                <Grid container className="ContainerGrid" direction="column">
                    <div className="conteudo-inLine">
                        <div className="lista-colaboradorProfissional">
                            <GridViewLista gridviewProps={gridViewItens ?? {}} />
                        </div>
                    </div>
                </Grid>
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

export default ColaboradorProfissional;