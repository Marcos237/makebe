import React, { useState } from "react";
import { PaginacaoItens } from '../../Interfaces/shared/PaginacaoItens';
import { ColaboradorProfissionalItem } from "../../Interfaces/ColaboradorProfissional/colaboradorProfissionalItem";
import { Grid } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { GetPaginadoService } from "../../services/shared/getPaginadoService";
import { API_BASE_AGENDA_URL } from "../../config/apiConfig";
import { UrlBuscarPaginado } from "../../constants/ColaboradorProfissional/colaboradorProfissionalConstant";
import { PersistirItens } from "../../Interfaces/shared/persistirItens";
import { paginar } from "../../functions/paginacao";
import { Tooltip } from '@mui/material';
import { FaSearch } from "react-icons/fa";
import Dropdown from "../../components/dropdown";
import CampoTexto from '../../components/textbox';
import RefreshIcon from '@mui/icons-material/Refresh';


const ColaboradorProfissionalBusca: React.FC<{
    selectItens: Array<PersistirItens<ColaboradorProfissionalItem>>, onResultadosBusca: (
        resultados: PaginacaoItens<ColaboradorProfissionalItem>) => void
}> = ({ selectItens, onResultadosBusca }) => {
    const [idcolaboradorBusca, setIdcolaboradorBusca] = useState<number>(0);
    const [idLojaBusca, setIdLojaBusca] = useState<number>(0);
    const [idServicoBusca, setServicoBusca] = useState<number>(0);
    const [colaborador, setColaborador] = useState<string>('');
    const [loja, setLoja] = useState<string>('');
    const [servico, setServico] = useState<string>('');
    const [descricaoBusca, setDescricaoBusca] = useState<string>('');
    const colaboradorProps = selectItens.find((item) => item.name === "colaborador")?.selectItems ?? [];
    const lojaProps = selectItens.find((item) => item.name === "loja")?.selectItems ?? [];
    const servicoProps = selectItens.find((item) => item.name === "servico")?.selectItems ?? [];


    const handleDropdownChange = (e: SelectChangeEvent<string>, tipo: string) => {
        const selectedKey = e.target.value;
        const selectedItem = getSelectedItemByTipo(tipo, selectedKey);
        const selectedValue = selectedItem?.value || '';

        switch (tipo) {
            case "colaborador":
                setIdcolaboradorBusca(Number(selectedKey));
                setColaborador(selectedValue);
                break;
            case "loja":
                setIdLojaBusca(Number(selectedKey));
                setLoja(selectedValue);
                break;
            case "servico":
                setServicoBusca(Number(selectedKey));
                setServico(selectedValue);
                break;
            default:
                return null;
        }
    };
    const getSelectedItemByTipo = (tipo: string, selectedKey: string) => {
        switch (tipo) {
            case "colaborador":
                return colaboradorProps.find(item => item.key === selectedKey);
            case "loja":
                return lojaProps.find(item => item.key === selectedKey);
            case "servico":
                return servicoProps.find(item => item.key === selectedKey);
            default:
                return null;
        }
    };


    const handleButtonClick = () => {
        const fakeEvent = {
            preventDefault: () => { }
        } as React.FormEvent;
        handleSubmit(fakeEvent);
    };
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const colaboradorProfissional: ColaboradorProfissionalItem = {
            nomeColaborador: colaborador ?? "",
            razaoSocial: loja ?? "",
            descricaoServico: servico ?? "",
            descricao: descricaoBusca ?? ""
        }
        const paginacao = paginar(colaboradorProfissional, 1);
        const colaboradorProfissionalResponse = await GetPaginadoService(paginacao, `${API_BASE_AGENDA_URL}${UrlBuscarPaginado}`);
        onResultadosBusca(colaboradorProfissionalResponse ?? {});
    }
    const handleButtonClickLimpar = async () => {
        limparItens();
        const colaboradorProfissional: ColaboradorProfissionalItem = {}
        const paginacao = paginar(colaboradorProfissional, 1)
        const colaboradorService = await GetPaginadoService(paginacao ?? {}, `${API_BASE_AGENDA_URL}${UrlBuscarPaginado}`);
        onResultadosBusca(colaboradorService ?? {});
    }

    const limparItens = () => {
        setIdcolaboradorBusca(0);
        setIdLojaBusca(0);
        setServicoBusca(0);
        setDescricaoBusca("");
    }
    return (<>

        <Grid container spacing={2} className="ContainerGrid">
            <div className="conteudo">
                <fieldset className='icone-box icone-box-form'>
                    <legend>Pesquisar</legend>
                    <div className="conteudoPesquisa">
                        <Grid container spacing={2}>
                            <Grid item xs={10} md={4}>
                                <div className="formItens-drop">
                                    <Dropdown
                                        dropProps={{
                                            name: "Colaborador",
                                            label: "Colaborador*",
                                            itens: colaboradorProps,
                                            selectedId: idcolaboradorBusca || '0',
                                            onChange: (e: SelectChangeEvent<string>) => handleDropdownChange(e, "colaborador"),
                                        }}
                                    />
                                </div>
                            </Grid>
                            <Grid item xs={10} md={4}>
                                <div className="formItens-drop">
                                    <Dropdown
                                        dropProps={{
                                            name: "Loja",
                                            label: "Loja*",
                                            itens: lojaProps,
                                            selectedId: idLojaBusca || '0',
                                            onChange: (e: SelectChangeEvent<string>) => handleDropdownChange(e, "loja"),
                                        }}
                                    />
                                </div>
                            </Grid>
                            <Grid item xs={10} md={4}>
                                <div className="formItens-drop">
                                    <Dropdown
                                        dropProps={{
                                            name: "Servico",
                                            label: "Serviço*",
                                            itens: servicoProps,
                                            selectedId: idServicoBusca || '0',
                                            onChange: (e: SelectChangeEvent<string>) => handleDropdownChange(e, "servico"),
                                        }}
                                    />
                                </div>
                            </Grid>

                            <Grid item xs={10} md={4}>
                                <div className='formItens'>
                                    <CampoTexto
                                        textBoxProps={{
                                            name: "Descricao",
                                            tooltip: "Descrição",
                                            label: "Descrição",
                                            value: descricaoBusca,
                                            type: 'text',
                                            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setDescricaoBusca(e.target.value)

                                        }}
                                    />
                                </div>
                            </Grid>

                            <Grid container item xs={11} justifyContent="flex-end" spacing={2}>
                                <Grid item>
                                    <div className='botaoBuscar'>
                                        <div className="link-busca">
                                            <button onClick={handleButtonClick} className="botao-link">
                                                <Tooltip title="buscar">
                                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                                        <FaSearch />
                                                    </span>
                                                </Tooltip>
                                            </button>
                                            <button onClick={handleButtonClickLimpar} className="botao-link">
                                                <Tooltip title="limpar">
                                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                                        <RefreshIcon />
                                                    </span>
                                                </Tooltip>
                                            </button>
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                    </div>
                </fieldset>
            </div >
        </Grid >
    </>)
}

export default ColaboradorProfissionalBusca;
