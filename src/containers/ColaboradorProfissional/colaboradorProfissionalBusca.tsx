import React, { useState } from "react";
import { PaginacaoItens } from '../../Interfaces/shared/PaginacaoItens';
import { ColaboradorProfissionalItem } from "../../Interfaces/ColaboradorProfissional/colaboradorProfissionalItem";
import { Grid } from '@mui/material';
import { BotaoItens } from '../../Interfaces/Botao/botao';
import { SelectChangeEvent } from '@mui/material/Select';
import { GetPaginadoService } from "../../services/shared/getPaginadoService";
import { API_BASE_AGENDA_URL } from "../../config/apiConfig";
import { UrlBuscarPaginado } from "../../constants/ColaboradorProfissional/colaboradorProfissionalConstant";
import { PersistirItens } from "../../Interfaces/shared/persistirItens";
import { paginar } from "../../functions/paginacao";
import Dropdown from "../../components/dropdown";
import CampoTexto from '../../components/textbox';
import Botao from '../../components/button';
import SearchIcon from '@mui/icons-material/Search';
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
    const [isLoading, setIsLoading] = useState<boolean>(false);
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
        setIsLoading(true);
        const colaboradorProfissional: ColaboradorProfissionalItem = {
            nomeColaborador: colaborador ?? "",
            razaoSocial: loja ?? "",
            descricaoServico: servico ?? "",
            descricao: descricaoBusca ?? ""
        }
        const paginacao = paginar(colaboradorProfissional, 1);
        const colaboradorProfissionalResponse = await GetPaginadoService(paginacao, `${API_BASE_AGENDA_URL}${UrlBuscarPaginado}`);
        onResultadosBusca(colaboradorProfissionalResponse ?? {});
        setIsLoading(false);
    }
    const handleButtonClickLimpar = async () => {
        limparItens();
        const colaboradorProfissional: ColaboradorProfissionalItem = {}
        const paginacao = paginar(colaboradorProfissional, 1)
        const colaboradorService = await GetPaginadoService(paginacao ?? {}, `${API_BASE_AGENDA_URL}${UrlBuscarPaginado}`);
        onResultadosBusca(colaboradorService ?? {});
        setIsLoading(false);
    }

    const limparItens = () => {
        setIsLoading(false);
        setIdcolaboradorBusca(0);
        setIdLojaBusca(0);
        setServicoBusca(0);
        setDescricaoBusca("");
    }
    const botaoProps: BotaoItens = {
        tooltip: 'buscar',
        width: '20px',
        onIconClick: handleButtonClick,
        color: 'success',
        isLoading: isLoading,
        icon: SearchIcon
    };

    const botaoLimparProps: BotaoItens = {
        tooltip: 'limpar',
        width: '20px',
        onIconClick: handleButtonClickLimpar,
        color: 'info',
        icon: RefreshIcon
    };

    return (<>
        <div className="conteudocolaboradorProfissional">
            <div className="titulobusca">
                <h4>Buscar</h4>
            </div>
            <Grid container spacing={2}>
                <Grid item xs={9} md={4}>
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
                <Grid item xs={9} md={4}>
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
                <Grid item xs={9} md={4}>
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

                <Grid item xs={9} md={4}>
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
                            <Botao botaoProps={botaoProps} />
                        </div>
                    </Grid>
                    <Grid item>
                        <div className='botaoLimpar'>
                            <Botao botaoProps={botaoLimparProps} />
                        </div>
                    </Grid>
                </Grid>

            </Grid>
        </div>
    </>)
}

export default ColaboradorProfissionalBusca;
