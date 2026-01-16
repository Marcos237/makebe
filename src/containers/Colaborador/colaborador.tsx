
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { UsuarioLoginItens } from '../../Interfaces/Usuario/UsuarioLoginItens';
import { GetAllService } from '../../services/shared/getAllService';
import { PersistirItens } from "../../Interfaces/shared/persistirItens";
import { PaginacaoItens } from '../../Interfaces/shared/PaginacaoItens';
import { mapToSelectItens } from '../../functions/mapToSelectItens';
import { Grid } from '@mui/material';
import { useParams } from "react-router-dom";
import { ColaboradorItens } from "../../Interfaces/Colaborador/colaboradorItem";
import { API_BASE_URL, API_BASE_AGENDA_URL } from '../../config/apiConfig';
import { UrlUsuarioLogado } from "../../constants/Usuario/usuarioConstant";
import { GrigViewItens } from "../../Interfaces/shared/gridviewItens";
import { propertyLabels, TipoCliente, UrlBuscarPaginado, UrlBuscarPermissao, UrlColaborador, TipoColaborador }
    from "../../constants/Colaborador/colaboradorConstant";
import { GetPaginadoService } from '../../services/shared/getPaginadoService';
import { GetByIdService } from "../../services/shared/getByIdService";
import { ResponseItem } from '../../Interfaces/shared/ResponseItem';
import { PermissaoItens } from "../../Interfaces/Colaborador/permissaoItens";
import { paginar } from "../../functions/paginacao";
import { useHiddenItem } from '../../hooks/useHiddenItem';
import { Tooltip } from '@mui/material';
import { FaUserPlus } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import ColaboradorBusca from "./colaboradorBusca";
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import GridViewLista from '../../components/gridview';
import ColaboradorPersistir from "./colaboradorPersistir";
import Banner from "../../components/banner";
import Footer from "../../components/footer";
import useUpdateGrid from "../../hooks/useUpdateGrid";
import useUpdateFetch from '../../hooks/useUpdateFetch';
import useFetchTipo from "../../hooks/useFetchTipo";


const Colaborador: React.FC = () => {
    const [colaboradorItem, setColaborador] = useState<ColaboradorItens>();
    const [useUsuarioLogado, setUsuarioLogado] = useState<UsuarioLoginItens>();
    const [persistirItens, stePersistirItens] = useState<PersistirItens<ColaboradorItens>>();
    const [resultadosBusca, setResultadosBusca] = useState<PaginacaoItens<ColaboradorItens>>();
    const [gridViewItens, setGridView] = useState<GrigViewItens<ColaboradorItens>>();
    const [readOnly, setReadOnly] = useState<boolean>(false);
    const { urlParametro } = useParams();
    const [isHiddenItem, setIsHiddenItem] = useState(false);


    const tipoItem = urlParametro === "CadastroCliente" ? TipoCliente : urlParametro === "CadastroColaborador" ? TipoColaborador : 0;

    useEffect(() => {
        if (tipoItem === "3") {
            setIsHiddenItem(true);
        } 
    }, [tipoItem]);

    useHiddenItem("persistir", "lista", isHiddenItem);

    const fetchColaboradorData = useCallback(async (tipoUsuario?: string, page: number = 1) => {
        const colaboradorDefault: ColaboradorItens = {
            id: '',
            usuarioId: '',
            nome: '',
            cpf: '',
            email: '',
            telefone: '',
            permissaoId: '',
            descricaoPermissao: '',
            nomeImagem: '',
            urlImagem: '',
            status: true,
            instagram: '',
            descricaoStatus: '',
            tipo: Number(tipoUsuario)
        }
        const paginacao = paginar(resultadosBusca, page)
        if (!resultadosBusca || page !== undefined) {

            paginacao.objetoPesquisa = resultadosBusca?.objetoPesquisa ?? colaboradorDefault;
            paginacao.objetos = []
            paginacao.objetoPesquisa.tipo = Number(tipoUsuario);
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

    const fetchPermissaoData = useCallback(async () => {
        const permissaoResponse = await GetAllService(`${API_BASE_URL}${UrlBuscarPermissao}`) as ResponseItem<PermissaoItens>;
        const itensSelect = mapToSelectItens(permissaoResponse?.datas, 'id', 'descricao');

        const persistirProps: PersistirItens<ColaboradorItens> = {
            selectItems: itensSelect,
            onSave: async (tipoItem?: string) => {
                await fetchColaboradorData(tipoItem?.toString());
            },
        }

        stePersistirItens(persistirProps);
    }, [fetchColaboradorData]);

    const handleUpdateClick = useCallback(async (event: React.MouseEvent, colaborador?: any) => {
        event.preventDefault();
        const colaboradorId = colaborador.usuarioId ?? '';
        const retorno = await GetByIdService(colaboradorId, `${API_BASE_AGENDA_URL}${UrlColaborador}`) as ResponseItem<ColaboradorItens>;
        setColaborador(retorno?.data ?? undefined);
        handleScrollToTop();
        handleButtonClickSalvar();
        setReadOnly(true);
    }, []);

    const actionButtons = useMemo(() => ([
        {
            id: 1,
            label: 'Edit',
            icon: <EditRoundedIcon />,
            href: '#',
            onClick: handleUpdateClick
        }
    ]), [handleUpdateClick]);

    const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, page: number) => {
        fetchColaboradorData(tipoItem.toString(), page);
    }, [fetchColaboradorData, tipoItem])

    const gridViewItensMemo = useMemo(() => {
        if (resultadosBusca) {
            return {
                paginacao: resultadosBusca,
                propertyLabels: propertyLabels,
                actionButtons: actionButtons,
                onPageChange: handlePageChange
            } as GrigViewItens<ColaboradorItens>;
        }
        return undefined;
    }, [resultadosBusca, actionButtons, handlePageChange]);

    useUpdateFetch([() => usuarioData(), () => fetchPermissaoData(), () => fetchColaboradorData(tipoItem.toString())],
        [tipoItem]
    );

    useFetchTipo(urlParametro ?? "", [() => fetchColaboradorData(tipoItem.toString())], TipoCliente, TipoColaborador);

    useUpdateGrid(gridViewItensMemo, setGridView, [persistirItens], () => {
        if (persistirItens?.isSave) {
            stePersistirItens(prev => ({
                ...prev,
                isSave: false,
            }));
            fetchColaboradorData(tipoItem.toString())
        }
    });

    const handleResultadosBusca = (resultados: PaginacaoItens<ColaboradorItens>) => {
        fetchResultadoPesquisa(resultados);
    };

    const fetchResultadoPesquisa = useCallback((resultados: PaginacaoItens<ColaboradorItens>) => {
        setResultadosBusca(resultados);
    }, []);

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
            {tipoItem !== "3" && (
                <div className="links-item">
                    <button onClick={handleButtonClickListar} className="botao-link">
                        <Tooltip title="listar">
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                <FaUsers />
                            </span>
                        </Tooltip>
                    </button>
                </div>
            )}
            <div className="form-persitir">
                <ColaboradorPersistir
                    persistirProps={{
                        ...persistirItens,
                        item: colaboradorItem,
                    }}
                    readOnly={readOnly}
                    tipoItem={Number(tipoItem)}
                />
            </div>
        </div>


        <div className="lista">
            <div className="links-item">
                <button onClick={handleButtonClickSalvar} className="botao-link">
                    <Tooltip title="novo">
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <FaUserPlus />
                        </span>
                    </Tooltip>
                </button>
            </div>
            <div className="form-persitir">
                <ColaboradorBusca
                    selectItens={persistirItens?.selectItems || []}
                    onResultadosBusca={handleResultadosBusca}
                />

            </div>

            <div className="grid">
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
            </div>
        </div>
        <div>
            <Footer />
        </div >
    </>
}

export default Colaborador;