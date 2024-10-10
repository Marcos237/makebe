import React, { useEffect, useState, useCallback, useMemo, useRef  } from "react";
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteIcon from '@mui/icons-material/Delete';
import Footer from '../../components/footer';
import Banner from '../../components/banner';
import Tabs from '../../components/tabs';
import SalaoPersistir from '../Loja/SalaoPersitir';
import GridViewLista from '../../components/gridview';
import SalaoBusca from "./SalaoBusca";
import { PaginacaoItens } from '../../Interfaces/shared/PaginacaoItens';
import { UsuarioLogadoService } from '../../services/Perfil/usuarioLogadoService';
import { UsuarioLogadoItens } from '../../Interfaces/Usuario/UsuarioLogadoItens';
import { TabsItens } from "../../Interfaces/Tabs/tabsItem";
import { Grid } from '@mui/material';
import { LojaItens } from "../../Interfaces/Loja/lojaItens";
import { TipoLojaService } from "../../services/Loja/tipoLojaService";
import { TipoLojaItens } from "../../Interfaces/Loja/tipoLojaItens";
import { SelectItens } from '../../Interfaces/shared/selectItens';
import { LojaService } from "../../services/Loja/lojaService";
import { LojaBuscaPorIdService } from "../../services/Loja/lojaBuscaPorIdService";
import { propertyLabels } from '../../constants/Loja/lojaConstant';
import { GrigViewItens } from "../../Interfaces/shared/gridviewItens";
import { PersistirItens } from "../../Interfaces/shared/persistirItens";

import '../../assets/styles/Loja/loja.css';

const Salao: React.FC = () => {
    const [useUsuarioLogado, setUsuarioLogado] = useState<UsuarioLogadoItens>();
    const [persistirItens, setPersistirItems] = useState<PersistirItens<LojaItens>>();
    const [gridViewItens, setGridView] = useState<GrigViewItens<LojaItens>>();
    const [lojaItem, setLojaItem] = useState<LojaItens>();
    const [resultadosBusca, setResultadosBusca] = useState<PaginacaoItens<LojaItens>>();

    const handleIconClick = useCallback(async (event: React.MouseEvent, loja?: any) => {
        event.preventDefault();
        const lojaId = loja.id ?? 0;
        const retorno = await LojaBuscaPorIdService(lojaId);
        setLojaItem(retorno ?? {});
    }, []);

    const actionButtons = useMemo(() => ([ 
        {
            id: 1,
            label: 'Edit',
            icon: <EditRoundedIcon />,
            href: '#',
            onClick: handleIconClick
        },
        {
            id: 2,
            label: 'Delete',
            icon: <DeleteIcon />,
            href: '/delete'
        }
    ]), [handleIconClick]); 


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
            const lojaResponse = await LojaService(paginacao);
            if (lojaResponse) {
                setResultadosBusca(lojaResponse);
            }
        }
    }, [resultadosBusca]);

    const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, page: number) => {
        fetchLojaData(page);
    }, [fetchLojaData])

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
    }, [fetchLojaData]);

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
    }, [fetchTipoLojaData, usuarioData, fetchLojaData]);

    useEffect(() => {
        if (resultadosBusca) {
            const gridview: GrigViewItens<LojaItens> = {
                paginacao: resultadosBusca,
                propertyLabels: propertyLabels,
                actionButtons: actionButtons,
                onPageChange: handlePageChange
            };
            setGridView(gridview);
        }
    }, [resultadosBusca, actionButtons, handlePageChange]);

    const tabsData: TabsItens[] = [
        {
            label: 'Loja',
            content: (
                <SalaoPersistir persistirProps={{ ...persistirItens, item: lojaItem }} />
            ),
        },
        {
            label: 'Endereço',
            content: <div>Informações sobre o endereço</div>,
        }
    ];

    const handleResultadosBusca = (resultados: PaginacaoItens<LojaItens>) => {
        fetchResultadoPesquisa(resultados);
    };

    return (
        <>
            <div className='banner'>
                <Banner usuarioLogado={useUsuarioLogado} />
            </div>

            <div className="paginaLoja">
                <Grid container spacing={2} className="gridContainerLoja">
                    <div className="conteudoLoja">
                        <Tabs tabsProps={tabsData}></Tabs>
                    </div>

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
            <div>
                <Footer />
            </div >
        </>
    )
}

export default Salao;
