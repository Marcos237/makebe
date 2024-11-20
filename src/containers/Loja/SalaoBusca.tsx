import React, { useState } from "react";
import { cnpjMaskConst } from '../../constants/Loja/lojaConstant';
import { SelectItens } from '../../Interfaces/shared/selectItens';
import { LojaItens } from '../../Interfaces/Loja/lojaItens';
import { PaginacaoItens } from '../../Interfaces/shared/PaginacaoItens';
import { LojaPaginadoService } from "../../services/Loja/lojaPaginadoService";
import { SelectChangeEvent } from '@mui/material/Select';
import { Grid } from '@mui/material';
import { BotaoItens } from '../../Interfaces/Botao/botao';
import CampoTexto from '../../components/textbox';
import Botao from '../../components/button';
import Dropdown from "../../components/dropdown";
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';

import '../../assets/styles/Loja/lojabusca.css';


const SalaoBusca: React.FC<{ selectItens: SelectItens[], onResultadosBusca: (resultados: PaginacaoItens<LojaItens>) => void }> = ({ selectItens, onResultadosBusca }) => {
    const [tipoLojaIdBusca, setTipoLojaBusca] = useState<number>();
    const [razaoSocialBusca, setRazaoSocialBusca] = useState<string>('');
    const [cnpjBusca, setCnpjBusca] = useState<string>('');
    const [emailBusca, setEmailBusca] = useState<string>('');
    const [telefoneBusca, setTelefoneBusca] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleButtonClick = () => {
        const fakeEvent = {
            preventDefault: () => { }
        } as React.FormEvent;
        handleSubmit(fakeEvent);
    };


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);

        const loja: LojaItens = {
            razaoSocial: razaoSocialBusca || '',
            cnpj: cnpjBusca || '',
            telefone: telefoneBusca || '',
            email: emailBusca || '',
            tipoLojaId: Number(tipoLojaIdBusca) || 0
        }
        const paginacao: PaginacaoItens<LojaItens> = {
            quantidadePagina: 6,
            paginaAtual: 1,
            totalPaginas: 1,
            total: 0,
            objetoPesquisa: loja,
            objetos: []
        };
        const lojaResponse = await LojaPaginadoService(paginacao ?? {})
        onResultadosBusca(lojaResponse ?? {});
        setIsLoading(false);
    }

    const handleButtonClickLimpar = async () => {
        setRazaoSocialBusca('');
        setCnpjBusca('');
        setTelefoneBusca('');
        setEmailBusca('');
        setTipoLojaBusca(0);

        setIsLoading(true);
        const paginacao: PaginacaoItens<LojaItens> = {
            quantidadePagina: 6,
            paginaAtual: 1,
            totalPaginas: 1,
            total: 0,
            objetoPesquisa: {},
            objetos: []
        };
        const enderecoService = await LojaPaginadoService(paginacao ?? {});
        onResultadosBusca(enderecoService ?? {});
        setIsLoading(false);
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
    const handleDropdownChange = (e: SelectChangeEvent<string>) => {
        setTipoLojaBusca(Number(e.target.value));
    };

    return (
        <>
            <div className="conteudoBusca">
                <div className="titulobusca">
                    <h4>Buscar</h4>
                </div>

                <Grid container spacing={2}>
                    <Grid item xs={8} md={4}>
                        <div className="formItens formItemMenor">
                            <CampoTexto
                                textBoxProps={{
                                    name: "Razão Social",
                                    tooltip: "digite a razão social",
                                    label: "razão social*",
                                    value: razaoSocialBusca,
                                    type: 'text',
                                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setRazaoSocialBusca(e.target.value)
                                }}
                            />
                        </div>
                    </Grid>

                    <Grid item xs={8} md={4}>
                        <div className="formItens formItemMenor">
                            <CampoTexto
                                textBoxProps={{
                                    name: "CNPJ",
                                    tooltip: "digite seu cnpj",
                                    label: "cnpj*",
                                    value: cnpjBusca,
                                    type: 'text',
                                    mask: cnpjMaskConst,
                                    readonly: false,
                                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCnpjBusca(e.target.value)
                                }}
                            />
                        </div>
                    </Grid>

                    <Grid item xs={8} md={4}>
                        <div className="formItens formItemMenor">
                            <CampoTexto
                                textBoxProps={{
                                    name: "Email",
                                    tooltip: "digite seu email",
                                    label: "email*",
                                    value: emailBusca,
                                    type: 'email',
                                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEmailBusca(e.target.value)
                                }}
                            />
                        </div>
                    </Grid>

                    <Grid item xs={8} md={4}>
                        <div className="formItens formItemMenor">
                            <CampoTexto
                                textBoxProps={{
                                    name: "Telefone",
                                    tooltip: "digite seu telefone",
                                    label: "telefone*",
                                    value: telefoneBusca,
                                    type: 'text',
                                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setTelefoneBusca(e.target.value)
                                }}
                            />
                        </div>
                    </Grid>

                    <Grid item xs={8} md={4}>
                        <div className="formItens-drop formItemMenor">
                            <Dropdown
                                dropProps={{
                                    name: "TipoLoja",
                                    itens: selectItens,
                                    label: "Tipo de Loja*",
                                    selectedId: tipoLojaIdBusca?.toString() || '',
                                    onChange: handleDropdownChange,
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
        </>
    );
};

export default SalaoBusca;
