import React, { useState } from "react";
import { SelectItens } from '../../Interfaces/shared/selectItens';
import { PaginacaoItens } from '../../Interfaces/shared/PaginacaoItens';
import { ColaboradorItens } from "../../Interfaces/Colaborador/colaboradorItem";
import { Grid } from '@mui/material';
import { cpfMaskConst } from '../../utils/mascaras';
import { BotaoItens } from '../../Interfaces/Botao/botao';
import { SelectChangeEvent } from '@mui/material/Select';
import { SwitchButtonItem } from "../../Interfaces/shared/switchButtonItem";
import { GetPaginadoService } from "../../services/shared/getPaginadoService";
import { API_BASE_AGENDA_URL } from "../../config/apiConfig";
import { UrlBuscarPaginado } from "../../constants/Colaborador/colaboradorConstant";
import { paginar } from "../../functions/paginacao";
import SwitchButton from "../../components/switchButton";
import Dropdown from "../../components/dropdown";
import CampoTexto from '../../components/textbox';
import Botao from '../../components/button';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';


const ColaboradorBusca: React.FC<{
    selectItens: SelectItens[], onResultadosBusca: (
        resultados: PaginacaoItens<ColaboradorItens>) => void
}> = ({ selectItens, onResultadosBusca }) => {
    const [nomeBusca, setNomeBusca] = useState<string>('');
    const [cpfBusca, setCpfBusca] = useState<string>('');
    const [emailBusca, setEmailBusca] = useState<string>('');
    const [permissaoIdBusca, setPermissaoIdBusca] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [statusBusca, setStatusBusca] = useState<boolean>(true);


    const handleDropdownChange = (e: SelectChangeEvent<string>, tipo: string) => {
        if (tipo === "permissao") {
            setPermissaoIdBusca(e.target.value)
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
        const colaborador: ColaboradorItens = {
            nome: nomeBusca || '',
            cpf: cpfBusca || '',
            email: emailBusca || '',
            permissaoId: permissaoIdBusca || '',
            status: statusBusca || false
        }
        const paginacao = paginar(colaborador, 1);
        const colaboradorResponse = await GetPaginadoService(paginacao, `${API_BASE_AGENDA_URL}${UrlBuscarPaginado}`);
        onResultadosBusca(colaboradorResponse ?? {});
        setIsLoading(false);
    }
    const handleButtonClickLimpar = async () => {
        limparItens();

        const colaborador: ColaboradorItens = {
            nome: '',
            cpf: '',
            email: '',
            permissaoId:'',
            status: true
        }
        const paginacao = paginar(colaborador, 1)
        const colaboradorService = await GetPaginadoService(paginacao ?? {}, `${API_BASE_AGENDA_URL}${UrlBuscarPaginado}`);
        onResultadosBusca(colaboradorService ?? {});
    }

    const limparItens = () => {
        setIsLoading(false);
        setNomeBusca('');
        setCpfBusca('');
        setEmailBusca('');
        setPermissaoIdBusca('');
        setStatusBusca(true);
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
    const handleChange = () => {
        setStatusBusca(!statusBusca);
    };
    const switchButton: SwitchButtonItem = {
        label: "Status : ",
        checked: statusBusca,
        handleChange: handleChange

    }
    return (<>
        <div className="conteudoColaborador">
            <div className="titulobusca">
                <h4>Buscar</h4>
            </div>
            <Grid container spacing={2}>
                <Grid item xs={8} md={4}>
                    <div className="formItens formItemMenor">
                        <CampoTexto
                            textBoxProps={{
                                name: "Nome",
                                tooltip: "digite o nome",
                                label: "nome*",
                                value: nomeBusca,
                                type: 'text',
                                onChange: (e: React.ChangeEvent<HTMLInputElement>) => setNomeBusca(e.target.value)
                            }}
                        />
                    </div>
                </Grid>

                <Grid item xs={8} md={4}>
                    <div className="formItens formItemMenor">
                        <CampoTexto
                            textBoxProps={{
                                name: "CPF",
                                tooltip: "digite o CPF",
                                label: "CPF*",
                                value: cpfBusca,
                                type: 'text',
                                mask: cpfMaskConst,
                                onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCpfBusca(e.target.value)

                            }}
                        />
                    </div>
                </Grid>


                <Grid item xs={8} md={4}>
                    <div className="formItens formItemMenor">
                        <CampoTexto
                            textBoxProps={{
                                name: "Email",
                                tooltip: "digite o Email",
                                label: "Email*",
                                value: emailBusca,
                                type: 'text',
                                onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEmailBusca(e.target.value)
                            }}
                        />
                    </div>
                </Grid>

                <Grid item xs={8} md={4}>
                    <div className="formItens formItemMenor">
                        <Dropdown
                            dropProps={{
                                name: "Permissao",
                                label: "Permissão*",
                                itens: selectItens ?? [],
                                selectedId: permissaoIdBusca || '',
                                onChange: (e: SelectChangeEvent<string>) => handleDropdownChange(e, "permissao"),
                            }}
                        />
                    </div>
                </Grid>

                <Grid item xs={8} md={4}>
                    <div className="formItens-drop formItemMenor switch-item">
                        <SwitchButton switchProps={switchButton} />
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

export default ColaboradorBusca;
