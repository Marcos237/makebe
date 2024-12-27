
import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { UsuarioLoginItens } from '../../Interfaces/Usuario/UsuarioLoginItens';
import { GetAllService } from '../../services/shared/getAllService';
import { PersistirItens } from "../../Interfaces/shared/persistirItens";
import { PaginacaoItens } from '../../Interfaces/shared/PaginacaoItens';
import { mapToSelectItens } from '../../Interfaces/shared/mapToSelectItens';
import { Grid } from '@mui/material';
import { ColaboradorItens } from "../../Interfaces/Colaborador/colaboradorItem";
import { API_BASE_URL, API_BASE_AGENDA_URL } from '../../config/apiConfig';
import { UrlUsuarioLogado } from "../../constants/Usuario/usuarioConstant";
import { GrigViewItens } from "../../Interfaces/shared/gridviewItens";
import { propertyLabels, UrlBuscarPaginado, UrlBuscarPermissao, UrlColaborador } from "../../constants/Colaborador/colaboradorConstant";
import { GetPaginadoService } from '../../services/shared/getPaginadoService';
import { GetByIdService } from "../../services/shared/getByIdService";
import { ResponseItem } from '../../Interfaces/shared/ResponseItem';
import ColaboradorBusca from "./colaboradorBusca";
import { PermissaoItens } from "../../Interfaces/Colaborador/permissaoItens";
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import GridViewLista from '../../components/gridview';
import ColaboradorPersistir from "./colaboradorPersistir";
import Banner from "../../components/banner";
import Footer from "../../components/footer";
import "../../assets/styles/Colaborador/colaborador.css";



const Colaborador: React.FC = () => {
    const [colaboradorItem, setColaborador] = useState<ColaboradorItens>();
    const [useUsuarioLogado, setUsuarioLogado] = useState<UsuarioLoginItens>();
    const [persistirItens, stePersistirItens] = useState<PersistirItens<ColaboradorItens>>();
    const [resultadosBusca, setResultadosBusca] = useState<PaginacaoItens<ColaboradorItens>>();
    const [gridViewItens, setGridView] = useState<GrigViewItens<ColaboradorItens>>();
    const [readOnly,  setReadOnly] = useState<boolean>(false);

    const fetchColaboradorData = useCallback(async (page: number = 1) => {
        const paginacao: PaginacaoItens<ColaboradorItens> = {
            quantidadePagina: resultadosBusca?.quantidadePagina || 6,
            paginaAtual: page,
            totalPaginas: resultadosBusca?.totalPaginas || 1,
            total: resultadosBusca?.total || 0,
            objetoPesquisa: resultadosBusca?.objetoPesquisa || undefined,
            objetos: resultadosBusca?.objetos ?? []
        };
        if (!resultadosBusca || page !== undefined) {
            paginacao.objetos = []
            const colaboradorReponse = await GetPaginadoService(paginacao, `${API_BASE_AGENDA_URL}${UrlBuscarPaginado}` );
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
            onSave: fetchColaboradorData,
        };

        stePersistirItens(persistirProps);
    }, [fetchColaboradorData]);

    const handleUpdateClick = useCallback(async (event: React.MouseEvent, colaborador?: any) => {
        event.preventDefault();
        const colaboradorId = colaborador.usuarioId ?? '';
        const retorno = await GetByIdService(colaboradorId, `${API_BASE_AGENDA_URL}${UrlColaborador}`) as ResponseItem<ColaboradorItens>;
        setColaborador(retorno?.data ?? undefined);
        handleScrollToTop();
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
        fetchColaboradorData(page);
    }, [fetchColaboradorData])

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

    const hasFetchedData = useRef(false);
    useEffect(() => {
        if (!hasFetchedData.current) {
            usuarioData();
            fetchPermissaoData();
            fetchColaboradorData();
            hasFetchedData.current = true;
        }
    }, [fetchColaboradorData, fetchPermissaoData, usuarioData]);


    useEffect(() => {
        if (gridViewItensMemo) {
            setGridView(gridViewItensMemo)
        }
    }, [gridViewItensMemo, fetchColaboradorData]);

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

    return <>
        <div className='banner'>
            <Banner usuarioLogado={useUsuarioLogado} />
        </div>

        <Grid container className="ContainerGrid" direction="column">
            <div className="conteudo-inLine">
                <div className="persistir-colaborador">
                    <ColaboradorPersistir
                        persistirProps={{...persistirItens,
                            item: colaboradorItem,
                        }}
                        readOnly={readOnly}
                    />
                </div>
                <div className="busca-colaborador">
                    <ColaboradorBusca
                        selectItens={persistirItens?.selectItems || []}
                        onResultadosBusca={handleResultadosBusca}
                    />
                </div>
                <div className="lista-colaborador">
                    <GridViewLista gridviewProps={gridViewItens ?? {}} />
                </div>
            </div>
        </Grid>

        <div>
            <Footer />
        </div >
    </>
}

export default Colaborador;