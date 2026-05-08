import React, { useState } from "react";
import { SelectItens } from '../../Interfaces/shared/selectItens';
import { PaginacaoItens } from '../../Interfaces/shared/PaginacaoItens';
import { ColaboradorItens } from "../../Interfaces/Colaborador/colaboradorItem";
import { Grid } from '@mui/material';
import { cpfMaskConst } from '../../utils/mascaras';
import { SelectChangeEvent } from '@mui/material/Select';
import { SwitchButtonItem } from "../../Interfaces/shared/switchButtonItem";
import { GetPaginadoService } from "../../services/shared/getPaginadoService";
import { API_BASE_AGENDA_URL } from "../../config/apiConfig";
import { UrlBuscarPaginado } from "../../constants/Colaborador/colaboradorConstant";
import { paginar } from "../../functions/paginacao";
import { Tooltip } from '@mui/material';
import { FaSearch } from "react-icons/fa";
import SwitchButton from "../../components/switchButton";
import Dropdown from "../../components/dropdown";
import CampoTexto from '../../components/textbox';
import RefreshIcon from '@mui/icons-material/Refresh';
import { FaFilter } from "react-icons/fa";


const ColaboradorBusca: React.FC<{
    selectItens: SelectItens[], onResultadosBusca: (
        resultados: PaginacaoItens<ColaboradorItens>) => void
}> = ({ selectItens, onResultadosBusca }) => {
    const [nomeBusca, setNomeBusca] = useState<string>('');
    const [cpfBusca, setCpfBusca] = useState<string>('');
    const [emailBusca, setEmailBusca] = useState<string>('');
    const [permissaoIdBusca, setPermissaoIdBusca] = useState<string>('');
    const [statusBusca, setStatusBusca] = useState<boolean>(true);
    const [mostrarFiltros, setMostrarFiltros] = useState(false);


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
        setMostrarFiltros(false);
    };
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
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
    }
    const handleButtonClickLimpar = async () => {
        limparItens();

        const colaborador: ColaboradorItens = {
            nome: '',
            cpf: '',
            email: '',
            permissaoId: '',
            status: true
        }
        const paginacao = paginar(colaborador, 1)
        const colaboradorService = await GetPaginadoService(paginacao ?? {}, `${API_BASE_AGENDA_URL}${UrlBuscarPaginado}`);
        onResultadosBusca(colaboradorService ?? {});
    }

    const limparItens = () => {
        setNomeBusca('');
        setCpfBusca('');
        setEmailBusca('');
        setPermissaoIdBusca('');
        setStatusBusca(true);
    }


    const handleChange = () => {
        setStatusBusca(!statusBusca);
    };
    const switchButton: SwitchButtonItem = {
        label: "Status : ",
        checked: statusBusca,
        handleChange: handleChange

    }
    return (<>


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
                    </Grid>
                    {mostrarFiltros && (
                        <>
                            <div className="conteudo-colaborador-pesquisar">

                                <Grid item xs={12} md={4}>
                                    <div className="formItens">
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

                                <Grid item xs={12} md={4}>
                                    <div className="formItens">
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

                                <Grid item xs={12} md={4}>
                                    <div className="formItens">
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


                                <Grid item xs={12} md={4}>
                                    <div className="formItens">
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


                                <Grid item xs={12} md={4}>
                                    <div className="formItens switch-item">
                                        <SwitchButton switchProps={switchButton} />
                                    </div>
                                </Grid>
                            </div>
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
                </fieldset>
            </div>
        </Grid >
    </>
    )
}

export default ColaboradorBusca;
