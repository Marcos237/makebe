import React, { useState, useCallback, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import { UsuarioLoginItens } from '../../Interfaces/Usuario/UsuarioLoginItens';
import {
    UrlBuscarPaginado, TipoLoja, TipoColaborador, propertyLabelsLoja, propertyLabelsColaborador,
    UrlAgenda, ModalTexto
} from '../../constants/Agenda/agendaConstant';
import { UrlUsuarioLogado } from "../../constants/Usuario/usuarioConstant";
import { GetAllService } from '../../services/shared/getAllService';
import { API_BASE_URL, API_BASE_AGENDA_URL } from '../../config/apiConfig';
import { ResponseItem } from '../../Interfaces/shared/ResponseItem';
import { PersistirItens } from "../../Interfaces/shared/persistirItens";
import { Grid } from '@mui/material';
import { mapToSelectItens } from '../../functions/mapToSelectItens';
import { Semana } from '../../constants/shared/baseConstant';
import { PaginacaoItens } from '../../Interfaces/shared/PaginacaoItens';
import { paginar } from "../../functions/paginacao";
import { GetPaginadoService } from '../../services/shared/getPaginadoService';
import { UrlLoja } from "../../constants/Loja/lojaConstant";
import { LojaItens } from "../../Interfaces/Loja/lojaItens";
import { GrigViewItens } from "../../Interfaces/shared/gridviewItens";
import { SemanaItens } from "../../Interfaces/shared/semanaItens";
import { AgendaItens } from "../../Interfaces/Agenda/AgendaItens";
import { ModalItem } from "../../Interfaces/shared/modalItem";
import { handleModalDesativar, handleUpdateClick } from "../../functions/modalFunctions";
import { ColaboradorItens } from "../../Interfaces/Colaborador/colaboradorItem";
import { UrlColaborador } from "../../constants/Colaborador/colaboradorConstant";
import { useHiddenItem } from '../../hooks/useHiddenItem';
import { Tooltip } from '@mui/material';
import { TfiAgenda } from "react-icons/tfi";
import { TfiLayersAlt } from "react-icons/tfi";
import ModalGeneric from "../../componentsGenerics/modalGeneric";
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import useUpdateFetch from '../../hooks/useUpdateFetch';
import GridViewLista from '../../components/gridview';
import AgendaPersistir from './AgendaPersitir'
import Banner from "../../components/banner";
import Footer from "../../components/footer";
import useFetchTipo from "../../hooks/useFetchTipo";
import DeleteIcon from '@mui/icons-material/Delete';
import useUpdateGrid from "../../hooks/useUpdateGrid";
import AgendaBusca from "./AgendaBusca";

import '../../assets/styles/Agenda/agenda.css';

const AgendaLoja: React.FC = () => {
    const [agendaItem, setAgendaItem] = useState<AgendaItens>();
    const [useUsuarioLogado, setUsuarioLogado] = useState<UsuarioLoginItens>();
    const [gridViewItens, setGridView] = useState<GrigViewItens<AgendaItens>>();
    const [resultadosBusca, setResultadosBusca] = useState<PaginacaoItens<AgendaItens>>();
    const [persistirItensList, setPersistirItensList] = useState<Array<PersistirItens<any>>>([]);
    const [modalOpen, setModalOpen] = useState<ModalItem>();
    const { urlParametro } = useParams();
    const [isHiddenItem, setIsHiddenItem] = useState(false);
    const submittingRef = useRef(false);

    useHiddenItem("persistir", "lista", isHiddenItem);

    const tipoItem = urlParametro === "Loja" ? TipoLoja : urlParametro === "Colaborador" ? TipoColaborador : 0;

    const fetchAgendaData = useCallback(async (tipoAgenda?: string, page: number = 1) => {

        const agendaDefalt: AgendaItens = {
            id: 0, isTodoDia: false, bloqueado: false, agendaAbertaInicio: '',
            agendaAbertaFim: '', idAgendaSemanaInicio: 0, idAgendaSemanaFim: 0, idLoja: 0, tipo: Number(tipoItem)
        }
        const paginacao = paginar(resultadosBusca, page);
        if (!resultadosBusca || page !== undefined) {

            paginacao.objetoPesquisa = resultadosBusca?.objetoPesquisa ?? agendaDefalt;
            paginacao.objetoPesquisa.tipo = Number(tipoAgenda);
            paginacao.objetos = [];
            const agendaResponse = await GetPaginadoService(paginacao, `${API_BASE_AGENDA_URL}${UrlBuscarPaginado}`);
            if (agendaResponse) {
                setResultadosBusca(agendaResponse);
            }
        }
        submittingRef.current = false;
    }, [resultadosBusca, tipoItem]);

    const usuarioData = useCallback(async () => {
        const [sessao] = await Promise.all([
            GetAllService(`${API_BASE_URL}${UrlUsuarioLogado}`) as ResponseItem<UsuarioLoginItens>
        ]);
        setUsuarioLogado(sessao);
    }, []);

    const fetchLojaData = useCallback(async () => {
        const lojaResponse = await GetAllService(`${API_BASE_AGENDA_URL}${UrlLoja}`) as ResponseItem<LojaItens>;
        const itensSelect = mapToSelectItens(lojaResponse?.datas, 'id', 'razaoSocial');

        const persistirPropsLoja: PersistirItens<LojaItens> = {
            selectItems: itensSelect,
            name: 'loja',
            onSave: async (tipoItem?: string) => {
                await fetchAgendaData(tipoItem);
            },
        }
        setPersistirItensList((prevList) => [...prevList, persistirPropsLoja]);
    }, [fetchAgendaData]);


    const fetchColaboradorData = useCallback(async () => {

        const colaboradorResponse = await GetAllService(`${API_BASE_AGENDA_URL}${UrlColaborador}`) as ResponseItem<ColaboradorItens>;
        const itensSelect = mapToSelectItens(colaboradorResponse?.datas, 'id', 'nome');
        const persistirPropsColaborador: PersistirItens<ColaboradorItens> = {
            selectItems: itensSelect,
            name: 'colaborador',
            onSave: async (tipoItem?: string) => {
                await fetchAgendaData(tipoItem);
            },
        };
        setPersistirItensList((prevList) => [...prevList, persistirPropsColaborador]);
    }, [fetchAgendaData]);


    const semanaData = useCallback(async () => {
        const itensSelect = mapToSelectItens(Semana, 'id', 'dia');

        const persistirProps: PersistirItens<SemanaItens> = {
            selectItems: itensSelect,
            name: 'semana',
            onSave: async (tipoItem?: string) => {
                await fetchAgendaData(tipoItem);
            },
        };
        setPersistirItensList((prevList) => [...prevList, persistirProps]);
    }, [fetchAgendaData]);

    const handleScrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleModalDesativarItem = useCallback(async (id: number) => {
        if (submittingRef.current) return;
        submittingRef.current = true;
        handleModalDesativar(id, `${API_BASE_AGENDA_URL}${UrlAgenda}`);
        fetchAgendaData(tipoItem.toString());
        setModalOpen(undefined);
    }, [fetchAgendaData, tipoItem]);

    const handleUpdateClickItem = useCallback(async (event: React.MouseEvent, agenda?: any) => {
        event.preventDefault();
        const resultado = await handleUpdateClick(agenda, `${API_BASE_AGENDA_URL}${UrlAgenda}`, Number(tipoItem));
        setAgendaItem(resultado.data);
        setIsHiddenItem(true);
        handleScrollToTop();
    }, [tipoItem]);

    const handleDeleteClick = useCallback(async (event: React.MouseEvent, colaborador?: any) => {
        event.preventDefault();
        const modalItens: ModalItem = {
            open: true,
            title: colaborador.nomeColaborador,
            texto: ModalTexto,
            onClose: () => handleModalDesativarItem(colaborador.id)
        }
        setModalOpen(modalItens)
    }, [handleModalDesativarItem]);


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

    const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, page: number) => {
        fetchAgendaData(tipoItem.toString(), page);
    }, [fetchAgendaData, tipoItem])

    const gridViewItensMemo = useMemo(() => {
        if (resultadosBusca) {
            return {
                paginacao: resultadosBusca,
                propertyLabels: tipoItem === TipoLoja ? propertyLabelsLoja : propertyLabelsColaborador,
                actionButtons: actionButtons,
                onPageChange: handlePageChange
            } as GrigViewItens<AgendaItens>;
        }
        return undefined;
    }, [resultadosBusca, actionButtons, handlePageChange, tipoItem]);

    const handleResultadosBusca = (resultados: PaginacaoItens<AgendaItens>) => {
        fetchResultadoPesquisa(resultados);
    };

    const fetchResultadoPesquisa = useCallback((resultados: PaginacaoItens<AgendaItens>) => {
        setResultadosBusca(resultados);
    }, []);

    useUpdateGrid(gridViewItensMemo, setGridView, [persistirItensList], () => {
        let isSave = persistirItensList.find(item => item.isSave)?.isSave;
        if (isSave) {
            persistirItensList.map(item => item.isSave = false)
            fetchAgendaData(tipoItem.toString())
        }
    });

    useUpdateFetch([() => usuarioData(), () => fetchLojaData(), () => fetchColaboradorData(), () => semanaData(), () => fetchAgendaData(tipoItem.toString())],
        [tipoItem]
    );

    useFetchTipo(urlParametro ?? "", [() => fetchAgendaData(tipoItem.toString())], TipoLoja, TipoColaborador);

    const handleButtonClickSalvar = () => {
        setIsHiddenItem(true);
    }

    const handleButtonClickListar = () => {
        setIsHiddenItem(false);
    }

    return (<>

        <div className='banner'>
            <Banner usuarioLogado={useUsuarioLogado} />
        </div>


        <div className="persistir">
            <div className="nav-item">
                <button onClick={handleButtonClickListar}
                    className="btn-padrao"
                    type="button">
                    <Tooltip title="listar">
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <TfiLayersAlt />
                        </span>
                    </Tooltip>
                </button>
            </div>
            <div className="form-persitir">
                <AgendaPersistir
                    persistirProps={{
                        item: agendaItem,
                    }}
                    persistirDropProps={persistirItensList ?? []}
                    tipoItem={Number(tipoItem)}
                />
            </div>
        </div>


        <div className="lista">
            <div className="nav-item">
                <button
                    onClick={handleButtonClickSalvar}
                    className="btn-padrao"
                    type="button">
                    <Tooltip title="novo">
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <TfiAgenda />
                        </span>
                    </Tooltip>
                </button>
            </div>
            <div className="form-persitir">
                <AgendaBusca
                    selectItens={persistirItensList ?? []}
                    tipoItem={Number(tipoItem)}
                    onResultadosBusca={handleResultadosBusca}
                    page={resultadosBusca?.paginaAtual ?? 1}
                />
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
    </>)

}
export default AgendaLoja;