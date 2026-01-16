import React, { useState } from "react";
import { cnpjMaskConst } from '../../utils/mascaras';
import { SelectItens } from '../../Interfaces/shared/selectItens';
import { LojaItens } from '../../Interfaces/Loja/lojaItens';
import { PaginacaoItens } from '../../Interfaces/shared/PaginacaoItens';
import { GetPaginadoService } from "../../services/shared/getPaginadoService";
import { SelectChangeEvent } from '@mui/material/Select';
import { Grid } from '@mui/material';
import { API_BASE_AGENDA_URL } from "../../config/apiConfig";
import { UrlPaginado } from "../../constants/Loja/lojaConstant";
import { paginar } from "../../functions/paginacao";
import { Tooltip } from '@mui/material';
import CampoTexto from '../../components/textbox';
import { FaSearch } from "react-icons/fa";
import Dropdown from "../../components/dropdown";
import RefreshIcon from '@mui/icons-material/Refresh';


const SalaoBusca: React.FC<{ selectItens: SelectItens[], onResultadosBusca: (resultados: PaginacaoItens<LojaItens>) => void }> = ({ selectItens, onResultadosBusca }) => {
    const [tipoLojaIdBusca, setTipoLojaBusca] = useState<number>();
    const [razaoSocialBusca, setRazaoSocialBusca] = useState<string>('');
    const [cnpjBusca, setCnpjBusca] = useState<string>('');
    const [emailBusca, setEmailBusca] = useState<string>('');
    const [telefoneBusca, setTelefoneBusca] = useState<string>('');

    const handleButtonClick = () => {
        const fakeEvent = {
            preventDefault: () => { }
        } as React.FormEvent;
        handleSubmit(fakeEvent);
    };


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();


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
        const lojaResponse = await GetPaginadoService(paginacao ?? {}, `${API_BASE_AGENDA_URL}${UrlPaginado}`)
        onResultadosBusca(lojaResponse ?? {});
    }

    const handleButtonClickLimpar = async () => {
        setRazaoSocialBusca('');
        setCnpjBusca('');
        setTelefoneBusca('');
        setEmailBusca('');
        setTipoLojaBusca(0);

        const loja: LojaItens = {};
        const paginacao = paginar(loja, 1);
        const lojaResponseItem = await GetPaginadoService(paginacao ?? {}, `${API_BASE_AGENDA_URL}${UrlPaginado}`)
        onResultadosBusca(lojaResponseItem ?? {});

    }

    const handleDropdownChange = (e: SelectChangeEvent<string>) => {
        setTipoLojaBusca(Number(e.target.value));
    };

    return (
        <>
            <Grid container spacing={2} className="ContainerGrid">
                <div className="conteudo">
                    <fieldset className='icone-box icone-box-form'>
                        <legend>Pesquisar</legend>
                        <div className="conteudoPesquisa">
                            <Grid container spacing={2}>
                                <Grid item xs={10} md={4}>
                                    <div className="formItens ">
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

                                <Grid item xs={10} md={4}>
                                    <div className="formItens ">
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

                                <Grid item xs={10} md={4}>
                                    <div className="formItens ">
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

                                <Grid item xs={10} md={4}>
                                    <div className="formItens ">
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

                                <Grid item xs={10} md={4}>
                                    <div className="formItens-drop ">
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
                </div>
            </Grid>
        </>
    );
};

export default SalaoBusca;
