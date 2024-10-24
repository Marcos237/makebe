import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteIcon from '@mui/icons-material/Delete';
import Footer from '../../components/footer';
import Banner from '../../components/banner';
import SalaoPersistir from '../Loja/SalaoPersitir';
import GridViewLista from '../../components/gridview';
import ModalCuston from "../../components/modal";
import Botao from "../../components/button";
import SalaoBusca from "./SalaoBusca";
import { ModalItem } from "../../Interfaces/shared/modalItem";
import {  modalTexto } from "../../constants/Loja/lojaConstant";
import { PaginacaoItens } from '../../Interfaces/shared/PaginacaoItens';
import { UsuarioLogadoService } from '../../services/Perfil/usuarioLogadoService';
import { UsuarioLogadoItens } from '../../Interfaces/Usuario/UsuarioLogadoItens';
import { Grid } from '@mui/material';
import { LojaItens } from "../../Interfaces/Loja/lojaItens";
import { TipoLojaService } from "../../services/Loja/tipoLojaService";
import { TipoLojaItens } from "../../Interfaces/Loja/tipoLojaItens";
import { SelectItens } from '../../Interfaces/shared/selectItens';
import { LojaPaginadoService } from "../../services/Loja/lojaPaginadoService";
import { LojaBuscaPorIdService } from "../../services/Loja/lojaBuscaPorIdService";
import { propertyLabels } from '../../constants/Loja/lojaConstant';
import { GrigViewItens } from "../../Interfaces/shared/gridviewItens";
import { PersistirItens } from "../../Interfaces/shared/persistirItens";
import { BotaoItens } from "../../Interfaces/Botao/botao";
import { LojaExcluirService } from '../../services/Loja/lojaExcluirService';

import '../../assets/styles/Loja/loja.css';

const Salao: React.FC = () => {
    const [useUsuarioLogado, setUsuarioLogado] = useState<UsuarioLogadoItens>();
    const [persistirItens, setPersistirItems] = useState<PersistirItens<LojaItens>>();
    const [gridViewItens, setGridView] = useState<GrigViewItens<LojaItens>>();
    const [lojaItem, setLojaItem] = useState<LojaItens>();
    const [resultadosBusca, setResultadosBusca] = useState<PaginacaoItens<LojaItens>>();
    const [modalOpen, setModalOpen] = useState<ModalItem>();


    const handleUpdateClick = useCallback(async (event: React.MouseEvent, loja?: any) => {
        event.preventDefault();
        const lojaId = loja.id ?? 0;
        const retorno = await LojaBuscaPorIdService(lojaId);
        setLojaItem(retorno ?? {});
    }, []);

    const handleModalClose = () => {
        setModalOpen(undefined);
    }

    const handleModalDesativarLoja = async (id: number) => {
        const lojaRetorno = await LojaExcluirService(id);
        if (lojaRetorno) {
            
            fetchLojaData();
            setModalOpen(undefined);
        }
    }
    const handleDeleteClick = useCallback(async (event: React.MouseEvent, loja?: any) => {
        event.preventDefault();


        const modalButtonConfirmar: BotaoItens = {
            name: 'Confirmar',
            tooltip: 'Confirmar',
            label: 'Confirmar',
            width: '140px',
            color: 'primary',
            isLoading: false,
            onIconClick: () => handleModalDesativarLoja(loja.id)
        }

        const modalButtonCancelar: BotaoItens = {
            name: 'Cancelar',
            tooltip: 'Cancelar',
            label: 'Cancelar',
            width: '140px',
            color: 'error',
            isLoading: false,
            onIconClick: handleModalClose
        }

        const modalActions = [
            <div className='botao'>
                <Botao botaoProps={modalButtonConfirmar} />
            </div>,
            <div className='botao'>
                <Botao botaoProps={modalButtonCancelar} />
            </div>,
        ];

        const modalItens: ModalItem = {
            open: true,
            title: loja.razaoSocial,
            texto: modalTexto,
            style: {
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'black',
                color: "white",
                boxShadow: 24,
                pt: 2,
                px: 4,
                pb: 3,
            },
            actions: modalActions,
        }
        setModalOpen(modalItens)
    }, [handleModalDesativarLoja, handleModalClose]);

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


    const fetchLojaData = useCallback(async (page: number = 1) => {
        const paginacao: PaginacaoItens<LojaItens> = {
            quantidadePagina: resultadosBusca?.quantidadePagina || 6,
            paginaAtual: page,
            totalPaginas: resultadosBusca?.totalPaginas || 1,
            total: resultadosBusca?.total || 0,
            objetoPesquisa: resultadosBusca?.objetoPesquisa || undefined,
            objetos: resultadosBusca?.objetos ?? []
        };

        if (!resultadosBusca || page !== undefined) {
            paginacao.objetos = []
            const lojaResponse = await LojaPaginadoService(paginacao);
            if (lojaResponse) {
                setResultadosBusca(lojaResponse);
            }
        }
    }, [resultadosBusca]);

    const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, page: number) => {
        fetchLojaData(page);
    }, [])

    const fetchTipoLojaData = useCallback(async () => {
        const tipoLojaResponse = await TipoLojaService();
        const itensSelect: SelectItens[] = tipoLojaResponse?.map((tipo: TipoLojaItens) => ({
            key: tipo.id,
            value: tipo.descricao
        })) ?? [];

        const persistirProps: PersistirItens<LojaItens> = {
            selectItems: itensSelect,
            onSave: fetchLojaData,
        };

        setPersistirItems(persistirProps);
    }, []);

    const usuarioData = useCallback(async () => {
        const [sessao] = await Promise.all([UsuarioLogadoService()]);
        setUsuarioLogado(sessao);
    }, []);

    const fetchResultadoPesquisa = useCallback((resultados: PaginacaoItens<LojaItens>) => {
        setResultadosBusca(resultados);
    }, []);

    const hasFetchedData = useRef(false);

    useEffect(() => {
        if (!hasFetchedData.current) {
            fetchTipoLojaData();
            usuarioData();
            fetchLojaData();
            hasFetchedData.current = true;
        }
    }, []);
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
    
    useEffect(() => {
        if (gridViewItensMemo) {
            setGridView(gridViewItensMemo);
        }
    }, [gridViewItensMemo, fetchLojaData]);

    const handleResultadosBusca = (resultados: PaginacaoItens<LojaItens>) => {
        fetchResultadoPesquisa(resultados);
    };



    return (
        <>
            <div className='banner'>
                <Banner usuarioLogado={useUsuarioLogado} />
            </div>

            <SalaoPersistir persistirProps={{ ...persistirItens, item: lojaItem }} />
            <div className="paginaLoja">
                <Grid container spacing={2} className="gridContainerLoja">

                    <div className="busca-loja">
                        <SalaoBusca selectItens={persistirItens?.selectItems ?? []}
                            onResultadosBusca={handleResultadosBusca} />
                    </div>

                    <div className="gridListaLoja">
                        <Grid container spacing={2}>
                            <div className="lista-loja">
                                <div className="formItens">
                                    <GridViewLista gridviewProps={gridViewItens ?? {}} />
                                </div>
                            </div>
                        </Grid>
                    </div>
                </Grid>
            </div >
            <div className="modal">
                {modalOpen && <ModalCuston modalProps={modalOpen} />}
            </div>
            <div>
                <Footer />
            </div >
        </>
    )
}

export default Salao;
