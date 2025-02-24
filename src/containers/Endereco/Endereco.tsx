import React, { useState, useCallback, useMemo} from "react";
import { Grid } from '@mui/material';
import { useParams } from "react-router-dom";
import { UsuarioLoginItens } from '../../Interfaces/Usuario/UsuarioLoginItens';
import { GetAllService } from '../../services/shared/getAllService';
import { GrigViewItens } from "../../Interfaces/shared/gridviewItens";
import { EnderecoItens } from '../../Interfaces/Endereco/enderecoItens'
import { PersistirItens } from "../../Interfaces/shared/persistirItens";
import { PaginacaoItens } from '../../Interfaces/shared/PaginacaoItens';
import { LojaItens } from "../../Interfaces/Loja/lojaItens";
import { mapToSelectItens } from '../../functions/mapToSelectItens';
import { propertyLabelsLoja, propertyLabelsColaborador, modalTexto, UrlBuscarPaginado, UrlEndereco } from '../../constants/Endereco/enderecoConstants';
import { TipoUsuarioLojaId, TipoUsuarioColaboradorId } from '../../constants/Usuario/usuarioConstant';
import { ModalItem } from "../../Interfaces/shared/modalItem";
import { UrlUsuarioLogado } from "../../constants/Usuario/usuarioConstant";
import { API_BASE_URL, API_BASE_AGENDA_URL } from '../../config/apiConfig';
import { DeleteService } from '../../services/shared/deleteService';
import { UrlBuscarTodos } from "../../constants/Loja/lojaConstant";
import { GetPaginadoService } from "../../services/shared/getPaginadoService";
import { GetByIdService } from "../../services/shared/getByIdService";
import { ResponseItem } from "../../Interfaces/shared/ResponseItem";
import { ColaboradorItens } from "../../Interfaces/Colaborador/colaboradorItem";
import { UrlColaborador } from "../../constants/Colaborador/colaboradorConstant";
import { paginar } from "../../functions/paginacao";
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

import '../../assets/styles/Endereco/endereco.css'


const Endereco: React.FC = () => {
    const [enderecoItem, setEnderecoItem] = useState<EnderecoItens>();
    const [useUsuarioLogado, setUsuarioLogado] = useState<UsuarioLoginItens>();
    const [gridViewItens, setGridView] = useState<GrigViewItens<EnderecoItens>>();
    const [resultadosBusca, setResultadosBusca] = useState<PaginacaoItens<EnderecoItens>>();
    const [modalOpen, setModalOpen] = useState<ModalItem>();
    const [persistirItensList, setPersistirItensList] = useState<Array<PersistirItens<any>>>([]);
    const { urlParametro } = useParams();

    const tipoUsuarioId =
        urlParametro === "Loja" ? TipoUsuarioLojaId : urlParametro === "Colaborador" ? TipoUsuarioColaboradorId : "";

        
        const fetchEnderecoData = useCallback(async (tipoUsuarioId?: string, page: number = 1) => {
            const paginacao = paginar(resultadosBusca, page)
            if (!resultadosBusca || page !== undefined) {
                paginacao.objetoPesquisa = resultadosBusca?.objetoPesquisa || {};
                paginacao.objetoPesquisa.tipoUsuarioId = Number(tipoUsuarioId);
    
                const enderecoResponse = await GetPaginadoService(paginacao,  `${API_BASE_AGENDA_URL}${UrlBuscarPaginado}`);
    
                if (enderecoResponse) {
                    setResultadosBusca(enderecoResponse);
                }
            }
        }, [resultadosBusca]);

    const fetchLojaData = useCallback(async () => {
        const lojaResponse = await GetAllService(`${API_BASE_AGENDA_URL}${UrlBuscarTodos}`) as ResponseItem<LojaItens>;
        const itensSelect = mapToSelectItens(lojaResponse?.datas, 'id', 'razaoSocial');
        const persistirPropsLoja: PersistirItens<LojaItens> = {
            selectItems: itensSelect,
            name: 'loja',
            onSave: async (tipoUsuarioId?: string) => {
                await fetchEnderecoData(tipoUsuarioId ?? '');
            },
        };
        setPersistirItensList((prevList) => [...prevList, persistirPropsLoja]);
    }, [fetchEnderecoData]);

    const fetchColaboradorData = useCallback(async () => {
        const colaboradorResponse = await GetAllService(`${API_BASE_AGENDA_URL}${UrlColaborador}`) as ResponseItem<ColaboradorItens>;
        const itensSelect = mapToSelectItens(colaboradorResponse?.datas, 'id', 'nome');
        const persistirPropsColaborador: PersistirItens<ColaboradorItens> = {
            selectItems: itensSelect,
            name: 'colaborador',
            onSave: async (tipoUsuarioId?: string) => {
                await fetchEnderecoData(tipoUsuarioId ?? '');
            },
        };
        setPersistirItensList((prevList) => [...prevList, persistirPropsColaborador]);
    }, [fetchEnderecoData]);

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
            onClick: handleUpdateClick
        },
        {
            id: 2,
            label: 'Delete',
            icon: <DeleteIcon />,
            href: '#',
            onClick: handleDeleteClick
        }
    ]), [handleUpdateClick, handleDeleteClick]);

    const handleResultadosBusca = (resultados: PaginacaoItens<EnderecoItens>) => {
        fetchResultadoPesquisa(resultados);
    };

    const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, page: number) => {
        fetchEnderecoData(tipoUsuarioId, page);
    }, [fetchEnderecoData, tipoUsuarioId])


    const usuarioData = useCallback(async () => {
        const [sessao] = await Promise.all([
            GetAllService(`${API_BASE_URL}${UrlUsuarioLogado}`) as ResponseItem<UsuarioLoginItens>
        ]);
        setUsuarioLogado(sessao);
    }, []);

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

    useUpdateFetch([() => usuarioData(), () => fetchLojaData(), () => fetchColaboradorData(), () => fetchEnderecoData(tipoUsuarioId)],
        [tipoUsuarioId]
    );

    useUpdateGrid(gridViewItensMemo, setGridView, [persistirItensList], () => {
        let isSave = persistirItensList.find(item => item.isSave)?.isSave;
        if (isSave) {
            persistirItensList.map(item => item.isSave = false)
            fetchEnderecoData(tipoUsuarioId)
        }
    });

    useFetchTipo( urlParametro ?? "", [() => fetchEnderecoData(tipoUsuarioId)], TipoUsuarioLojaId, TipoUsuarioColaboradorId);
      
    const handleScrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <>
            <div className='banner'>
                <Banner usuarioLogado={useUsuarioLogado} />
            </div>

            <Grid container className="ContainerGrid" direction="column">
                <div className="conteudo-inLine">
                    <div className="persistir-endereco">
                        <EnderecoPersistir
                            persistirProps={{ item: enderecoItem }}
                            persistirDropProps={persistirItensList}
                            tipoUsuario={tipoUsuarioId} />
                    </div>
                    <div className="busca-endereco">
                        <EnderecoBuscar
                            selectItens={persistirItensList ?? []}
                            tipoUsuarioId={tipoUsuarioId}
                            onResultadosBusca={handleResultadosBusca}
                            page={resultadosBusca?.paginaAtual ?? 1}
                        />

                    </div>
                    <div className="lista-endereco">
                        <GridViewLista gridviewProps={gridViewItens ?? {}} />
                    </div>
                </div>
            </Grid>
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