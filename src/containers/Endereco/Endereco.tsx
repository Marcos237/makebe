import React, { useState, useCallback, useMemo } from "react";
import { Grid } from '@mui/material';
import { useParams } from "react-router-dom";
import { UsuarioLoginItens } from '../../Interfaces/Usuario/UsuarioLoginItens';
import { GrigViewItens } from "../../Interfaces/shared/gridviewItens";
import { EnderecoItens } from '../../Interfaces/Endereco/enderecoItens'
import { PersistirItens } from "../../Interfaces/shared/persistirItens";
import { PaginacaoItens } from '../../Interfaces/shared/PaginacaoItens';
import { propertyLabelsLoja, propertyLabelsColaborador, modalTexto, UrlBuscarPaginado, UrlEndereco } from '../../constants/Endereco/enderecoConstants';
import { TipoUsuarioLojaId, TipoUsuarioColaboradorId } from '../../constants/Usuario/usuarioConstant';
import { ModalItem } from "../../Interfaces/shared/modalItem";
import { API_BASE_AGENDA_URL } from '../../config/apiConfig';
import { DeleteService } from '../../services/shared/deleteService';
import { GetPaginadoService } from "../../services/shared/getPaginadoService";
import { GetByIdService } from "../../services/shared/getByIdService";
import { ResponseItem } from "../../Interfaces/shared/ResponseItem";
import { useColaboradorData } from '../../hooks/useColaboradorData';
import { useLojaData } from "../../hooks/useLojaData";
import { useUsuarioLogado } from "../../hooks/useUsuarioLogado";
import { paginar } from "../../functions/paginacao";
import { FaThList } from "react-icons/fa";
import { Tooltip } from '@mui/material';
import { useHiddenItem } from '../../hooks/useHiddenItem';
import { FaMapLocationDot } from "react-icons/fa6";
import ModalGeneric from "../../componentsGenerics/modalGeneric";
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteIcon from '@mui/icons-material/Delete';
import EnderecoPersistir from "./EnderecoPersistir";
import GridViewLista from '../../components/gridview';
import EnderecoBuscar from "./EnderecoBuscar";
import Banner from "../../components/banner";
import Footer from "../../components/footer";
import useUpdateGrid from "../../hooks/useUpdateGrid";
import useUpdateFetch from '../../hooks/useUpdateFetch';
import useFetchTipo from "../../hooks/useFetchTipo";


const Endereco: React.FC = () => {
    const [enderecoItem, setEnderecoItem] = useState<EnderecoItens>();
    const [useUsuarioLogadoItem, setUsuarioLogado] = useState<UsuarioLoginItens>();
    const [gridViewItens, setGridView] = useState<GrigViewItens<EnderecoItens>>();
    const [resultadosBusca, setResultadosBusca] = useState<PaginacaoItens<EnderecoItens>>();
    const [modalOpen, setModalOpen] = useState<ModalItem>();
    const [persistirItensList, setPersistirItensList] = useState<Array<PersistirItens<any>>>([]);
    const [isHiddenItem, setIsHiddenItem] = useState(false);
    const { urlParametro } = useParams();

    useHiddenItem("persistir", "lista", isHiddenItem);
    const tipoUsuarioId =
        urlParametro === "Loja" ? TipoUsuarioLojaId : urlParametro === "Colaborador" ? TipoUsuarioColaboradorId : "";


    const fetchEnderecoData = useCallback(async (tipoUsuarioId?: string, page: number = 1) => {

        const paginacao = paginar(resultadosBusca, page)
        if (!resultadosBusca || page !== undefined) {
            paginacao.objetoPesquisa = resultadosBusca?.objetoPesquisa || {};
            paginacao.objetoPesquisa.tipoUsuarioId = Number(tipoUsuarioId);

            const enderecoResponse = await GetPaginadoService(paginacao, `${API_BASE_AGENDA_URL}${UrlBuscarPaginado}`);

            if (enderecoResponse) {
                setResultadosBusca(enderecoResponse);
            }
        }
    }, [resultadosBusca]);



    const handleModalDesativarEndereco = useCallback(async (id: number) => {
        const lojaRetorno = await DeleteService(id, `${API_BASE_AGENDA_URL}${UrlEndereco}`);
        if (lojaRetorno) {

            fetchEnderecoData(tipoUsuarioId);
            setModalOpen(undefined);
        }
    }, [fetchEnderecoData, tipoUsuarioId]);

    const handleUpdateClick = useCallback(async (event: React.MouseEvent, endereco?: any) => {
        event.preventDefault();
        const enderecoId = endereco.id ?? 0;
        const retorno = await GetByIdService(enderecoId, `${API_BASE_AGENDA_URL}${UrlEndereco}`) as ResponseItem<EnderecoItens>;
        setEnderecoItem(retorno.data ?? {});
        handleButtonClickSalvar();
        handleScrollToTop();
    }, []);

    const handleDeleteClick = useCallback(async (event: React.MouseEvent, endereco?: any) => {
        event.preventDefault();

        const modalprops: ModalItem = {
            open: true,
            onClose: () => handleModalDesativarEndereco(endereco.id),
            title: `${endereco.logradouro} - ${endereco?.numero}`,
            texto: modalTexto,
        };
        setModalOpen(modalprops)

    }, [handleModalDesativarEndereco]);

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

    const handleResultadosBusca = (resultados: PaginacaoItens<EnderecoItens>) => {
        fetchResultadoPesquisa(resultados);
    };

    const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, page: number) => {
        fetchEnderecoData(tipoUsuarioId, page);
    }, [fetchEnderecoData, tipoUsuarioId])

    const fetchResultadoPesquisa = useCallback((resultados: PaginacaoItens<EnderecoItens>) => {
        setResultadosBusca(resultados);
    }, []);

    const gridViewItensMemo = useMemo(() => {
        if (resultadosBusca) {

            return {
                paginacao: resultadosBusca,
                propertyLabels: tipoUsuarioId === TipoUsuarioLojaId ? propertyLabelsLoja : propertyLabelsColaborador,
                actionButtons: actionButtons,
                onPageChange: handlePageChange
            } as GrigViewItens<EnderecoItens>;
        }
        return undefined;
    }, [resultadosBusca, actionButtons, handlePageChange, tipoUsuarioId]);

    const { fetchUsuarioLogado } = useUsuarioLogado();
    const { fetchColaboradorData } = useColaboradorData(async (id) => {
        await fetchEnderecoData(id);
    });
    const { fetchLojaData } = useLojaData(async (id) => {
        await fetchEnderecoData(id);
    });

    useUpdateFetch([
        async () => {
            const usuario = await fetchUsuarioLogado();
            setUsuarioLogado(usuario);
        },
        async () => {
            const loja = await fetchLojaData()
            setPersistirItensList(prev => [...prev, loja]);
        },
        async () => {
            const colaborador = await fetchColaboradorData();
            setPersistirItensList(prev => [...prev, colaborador]);
        },
        async () => {
            await fetchEnderecoData(tipoUsuarioId);
        }
    ], [tipoUsuarioId]);


    useUpdateGrid(gridViewItensMemo, setGridView, [persistirItensList], () => {
        let isSave = persistirItensList.find(item => item.isSave)?.isSave;
        if (isSave) {
            persistirItensList.map(item => item.isSave = false)
            fetchEnderecoData(tipoUsuarioId)
        }
    });

    useFetchTipo(urlParametro ?? "", [() => fetchEnderecoData(tipoUsuarioId)], TipoUsuarioLojaId, TipoUsuarioColaboradorId);

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
                <div className="form-persitir">
                    <EnderecoPersistir persistirProps={{ item: enderecoItem }} persistirDropProps={persistirItensList} tipoUsuario={tipoUsuarioId} />
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
                                <FaMapLocationDot />
                            </span>
                        </Tooltip>
                    </button>
                </div>
                <div className="form-persitir">
                    <EnderecoBuscar
                        selectItens={persistirItensList ?? []}
                        tipoUsuarioId={tipoUsuarioId}
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
        </>
    )
}
export default Endereco;