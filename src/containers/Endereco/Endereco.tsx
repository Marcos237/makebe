import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { Grid } from '@mui/material';
import { UsuarioLogadoItens } from '../../Interfaces/Usuario/UsuarioLogadoItens';
import { UsuarioLogadoService } from '../../services/Perfil/usuarioLogadoService';
import { GrigViewItens } from "../../Interfaces/shared/gridviewItens";
import { EnderecoItens } from '../../Interfaces/Endereco/enderecoItens'
import { PersistirItens } from "../../Interfaces/shared/persistirItens";
import { PaginacaoItens } from '../../Interfaces/shared/PaginacaoItens';
import { LojaItens } from "../../Interfaces/Loja/lojaItens";
import { SelectItens } from '../../Interfaces/shared/selectItens';
import { propertyLabels, modalTexto } from '../../constants/Endereco/enderecoConstants';
import { ModalItem } from "../../Interfaces/shared/modalItem";
import { EnderecoExcluirService } from '../../services/Endereco/enderecoExcluirService';
import { LojaBuscarTodosService } from '../../services/Loja/lojaBuscarTodosService';
import { EnderecoPaginacaoService } from "../../services/Endereco/enderecoPaginacaoService";
import { EnderecoBuscarPorIdService } from "../../services/Endereco/enderecoBuscarPorIdService";
import ModalGeneric from "../../componentsGenerics/modalGeneric";
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteIcon from '@mui/icons-material/Delete';
import EnderecoPersistir from "./EnderecoPersistir";
import GridViewLista from '../../components/gridview';
import EnderecoBuscar from "./EnderecoBuscar";
import Banner from "../../components/banner";
import Footer from "../../components/footer";



import '../../assets/styles/Endereco/endereco.css'


const Endereco: React.FC = () => {
    const [enderecoItem, setEnderecoItem] = useState<EnderecoItens>();
    const [useUsuarioLogado, setUsuarioLogado] = useState<UsuarioLogadoItens>();
    const [gridViewItens, setGridView] = useState<GrigViewItens<EnderecoItens>>();
    const [resultadosBusca, setResultadosBusca] = useState<PaginacaoItens<EnderecoItens>>();
    const [modalOpen, setModalOpen] = useState<ModalItem>();
    const [persistirItens, setPersistirItems] = useState<PersistirItens<LojaItens>>();

    const fetchEnderecoData = useCallback(async (page: number = 1) => {
        const paginacao: PaginacaoItens<EnderecoItens> = {
            quantidadePagina: resultadosBusca?.quantidadePagina || 6,
            paginaAtual: page,
            totalPaginas: resultadosBusca?.totalPaginas || 1,
            total: resultadosBusca?.total || 0,
            objetoPesquisa: resultadosBusca?.objetoPesquisa || undefined,
            objetos: resultadosBusca?.objetos ?? []
        };

        if (!resultadosBusca || page !== undefined) {
            paginacao.objetos = []
            const enderecoResponse = await EnderecoPaginacaoService(paginacao);
            if (enderecoResponse) {
                setResultadosBusca(enderecoResponse);
            }
        }
    }, [resultadosBusca]);

    const handleModalDesativarEndereco = useCallback(async (id: number) => {
        const lojaRetorno = await EnderecoExcluirService(id);
        if (lojaRetorno) {

            fetchEnderecoData();
            setModalOpen(undefined);
        }
    }, [fetchEnderecoData]);

    const handleUpdateClick = useCallback(async (event: React.MouseEvent, endereco?: any) => {
        event.preventDefault();
        const enderecoId = endereco.id ?? 0;
        const retorno = await EnderecoBuscarPorIdService(enderecoId);
        setEnderecoItem(retorno ?? {});
        handleScrollToTop();
    }, []);

    const handleDeleteClick = useCallback(async (event: React.MouseEvent, endereco?: any) => {
        event.preventDefault();

        const modalprops: ModalItem =    {
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

    const fetchLojaData = useCallback(async () => {
        const lojaResponse = await LojaBuscarTodosService();
        const itensSelect: SelectItens[] = lojaResponse?.map((loja: LojaItens) => ({
            key: loja.id || '',
            value: loja.razaoSocial
        })) ?? [];
        const enderecoBuscarProps: PersistirItens<LojaItens> = {
            selectItems: itensSelect,
            onSave: fetchEnderecoData,
        };
        setPersistirItems(enderecoBuscarProps);
    }, [fetchEnderecoData]);



    const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, page: number) => {
        fetchEnderecoData(page);
    }, [fetchEnderecoData])


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
            usuarioData();
            fetchLojaData();
            fetchEnderecoData();
            hasFetchedData.current = true;
        }
    });
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
    }, [gridViewItensMemo, fetchEnderecoData]);

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
                        <EnderecoPersistir persistirProps={{ ...persistirItens, item: enderecoItem }} />
                    </div>
                    <div className="busca-endereco">
                        <EnderecoBuscar selectItens={persistirItens?.selectItems ?? []}
                            onResultadosBusca={handleResultadosBusca} />

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