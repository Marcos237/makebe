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
import { FaFilter } from "react-icons/fa";


const SalaoBusca: React.FC<{ selectItens: SelectItens[], onResultadosBusca: (resultados: PaginacaoItens<LojaItens>) => void }> = ({ selectItens, onResultadosBusca }) => {
    const [tipoLojaIdBusca, setTipoLojaBusca] = useState<number>(0);
    const [razaoSocialBusca, setRazaoSocialBusca] = useState<string>('');
    const [cnpjBusca, setCnpjBusca] = useState<string>('');
    const [emailBusca, setEmailBusca] = useState<string>('');
    const [telefoneBusca, setTelefoneBusca] = useState<string>('');
    const [mostrarFiltros, setMostrarFiltros] = useState(false);

    const handleButtonClick = () => {

        const fakeEvent = {
            preventDefault: () => { }
        } as React.FormEvent;
        descerTela(820);
        handleSubmit(fakeEvent);
        setMostrarFiltros(false)
    };

    const descerTela = (valor: number) => {
        window.scrollTo({
            top: valor,
            behavior: "smooth",
        });
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
        descerTela(120);

    }

    const handleDropdownChange = (e: SelectChangeEvent<string>) => {
        setTipoLojaBusca(Number(e.target.value));
    };

    return (
        <>
            <Grid container spacing={2} className="ContainerGrid">
                <div className="conteudo">
                    <fieldset
                        className={`icone-box icone-box-form ${mostrarFiltros ? 'expandido' : 'fechado'
                            }`}
                    >
                        <legend>Pesquisar</legend>
                        <Grid container spacing={2}>
                            <Grid item xs={12} className="filtro-toggle">

                                <button
                                    type="button"
                                    className="btn-filtros"
                                    onClick={() => setMostrarFiltros(prev => !prev)}
                                >
                                    <Tooltip title="Filtros">
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                            Filtros
                                            <FaFilter />
                                        </span>
                                    </Tooltip>
                                </button>
                            </Grid>
                            {mostrarFiltros && (
                                <>

                                    <Grid item xs={12} md={4}>
                                        <div className="formItens">
                                            <CampoTexto
                                                textBoxProps={{
                                                    name: "Razão Social",
                                                    tooltip: "digite a razão social",
                                                    label: "razão social*",
                                                    value: razaoSocialBusca,
                                                    type: "text",
                                                    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                                                        setRazaoSocialBusca(e.target.value)
                                                }}
                                            />
                                        </div>
                                    </Grid>

                                    <Grid item xs={12} md={4}>
                                        <div className="formItens">
                                            <CampoTexto
                                                textBoxProps={{
                                                    name: "CNPJ",
                                                    tooltip: "digite seu cnpj",
                                                    label: "cnpj*",
                                                    value: cnpjBusca,
                                                    type: "text",
                                                    mask: cnpjMaskConst,
                                                    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                                                        setCnpjBusca(e.target.value)
                                                }}
                                            />
                                        </div>
                                    </Grid>

                                    <Grid item xs={12} md={4}>
                                        <div className="formItens">
                                            <CampoTexto
                                                textBoxProps={{
                                                    name: "Email",
                                                    tooltip: "digite seu email",
                                                    label: "email*",
                                                    value: emailBusca,
                                                    type: "email",
                                                    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                                                        setEmailBusca(e.target.value)
                                                }}
                                            />
                                        </div>
                                    </Grid>

                                    <Grid item xs={12} md={4}>
                                        <div className="formItens">
                                            <CampoTexto
                                                textBoxProps={{
                                                    name: "Telefone",
                                                    tooltip: "digite seu telefone",
                                                    label: "telefone*",
                                                    value: telefoneBusca,
                                                    type: "text",
                                                    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                                                        setTelefoneBusca(e.target.value)
                                                }}
                                            />
                                        </div>
                                    </Grid>

                                    <Grid item xs={12} md={4}>
                                        <div className="formItens-drop">
                                            <Dropdown
                                                dropProps={{
                                                    name: "TipoLoja",
                                                    itens: selectItens,
                                                    label: "Tipo de Loja*",
                                                    selectedId: tipoLojaIdBusca?.toString() || "",
                                                    onChange: handleDropdownChange
                                                }}
                                            />
                                        </div>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <div className='botaoBuscar'>
                                            <div className="link-busca">
                                                <button onClick={handleButtonClick} className="btn-busca">
                                                    <Tooltip title="buscar">
                                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                                            <FaSearch />
                                                        </span>
                                                    </Tooltip>
                                                </button>
                                                <button onClick={handleButtonClickLimpar} className="btn-limpar">
                                                    <Tooltip title="limpar">
                                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                                            <RefreshIcon />
                                                        </span>
                                                    </Tooltip>
                                                </button>
                                            </div>
                                        </div>
                                    </Grid>

                                </>
                            )}

                        </Grid>
                    </fieldset>

                </div>
            </Grid>
        </>
    );
}

export default SalaoBusca;
