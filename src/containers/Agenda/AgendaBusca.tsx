import React, { useState } from "react";
import { PersistirItens } from "../../Interfaces/shared/persistirItens";
import { PaginacaoItens } from '../../Interfaces/shared/PaginacaoItens';
import { AgendaItens } from "../../Interfaces/Agenda/AgendaItens";
import { Grid } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { getSelectedItemByTipo } from '../../functions/tipoSelectedFunction';
import {
    DataLabelAgendaAberta, DataLabelAgendaFechada,
    DataLabelBloqueioAberto, DataLabelBloqueioFechado, UrlBuscarPaginado,
    TipoColaborador, TipoLoja
} from "../../constants/Agenda/agendaConstant";
import { TipoUsuarioLojaId, TipoUsuarioColaboradorId } from '../../constants/Usuario/usuarioConstant';
import { paginar } from "../../functions/paginacao";
import { GetPaginadoService } from '../../services/shared/getPaginadoService';
import { API_BASE_AGENDA_URL } from "../../config/apiConfig";
import { formatarHoraComData } from '../../functions/formatDataHora';
import { FaTrash } from 'react-icons/fa';
import { Tooltip } from '@mui/material';
import { FaSearch } from "react-icons/fa";
import { FaFilter } from "react-icons/fa";
import Icone from '../../components/icone';
import Dropdown from "../../components/dropdown";
import dayjs from 'dayjs';
import DateTimerPicker from '../../components/dateTimerPicker';

import RefreshIcon from '@mui/icons-material/Refresh';
import { ClassNames } from "@emotion/react";

const AgendaBusca: React.FC<{
    selectItens: Array<PersistirItens<AgendaItens>>,
    tipoItem: number,
    page: number,
    onResultadosBusca: (resultados: PaginacaoItens<AgendaItens>) => void
}> = ({ selectItens, tipoItem, onResultadosBusca, page }) => {

    const [idLoja, setLojaId] = useState<number>();
    const [idColaborador, setColaboradorId] = useState<number>();
    const [colaborador, setColaborador] = useState<string>('');
    const [idAgendaSemanaInicio, setAgendaSemanaInicio] = useState<number>(0);
    const [idAgendaSemanaFim, setAgendaSemanaFim] = useState<number>(0);
    const [agendaAbertaInicio, setAgendaAbertaInicio] = useState<string>('');
    const [agendaAbertaFim, setAgendaAbertaFim] = useState<string>('');
    const [agendaBloqueadaInicio, setAgendaBloqueadaInicio] = useState<string>('');
    const [agendaBloqueadaFim, setAgendaBloqueadaFim] = useState<string>('');
    const [loja, setLoja] = useState<string>('');
    const lojaProps = selectItens.find((item) => item.name === "loja")?.selectItems ?? [];
    const semanaProps = selectItens.find((item) => item.name === "semana")?.selectItems ?? [];
    const colaboradorProps = selectItens.find((item) => item.name === "colaborador")?.selectItems ?? [];
    const [mostrarFiltros, setMostrarFiltros] = useState(false);

    const handleButtonClick = () => {
        const fakeEvent = { preventDefault: () => { } } as React.FormEvent;
        handleSearch(fakeEvent);
        setMostrarFiltros(false);
    };
    const handleSearch = async (event: React.FormEvent) => {
        event.preventDefault();

        const agenda: AgendaItens = {
            idLoja: idLoja ?? 0,
            idColaborador: idColaborador ?? 0,
            idAgendaSemanaInicio: idAgendaSemanaInicio ?? 0,
            idAgendaSemanaFim: idAgendaSemanaFim ?? 0,
            agendaAbertaInicio: formatarHoraComData(agendaAbertaInicio ?? ''),
            agendaAbertaFim: formatarHoraComData(agendaAbertaFim ?? ''),
            agendaBloqueadaInicio: formatarHoraComData(agendaBloqueadaInicio ?? ''),
            agendaBloqueadaFim: formatarHoraComData(agendaBloqueadaFim ?? ''),
            nome: tipoItem?.toString() === TipoUsuarioColaboradorId ? colaborador ?? "" : "",
            razaoSocial: tipoItem?.toString() === TipoUsuarioLojaId ? loja ?? "" : "",
            tipo: Number(tipoItem) ?? 0
        };

        const paginacao = paginar(agenda, page);
        paginacao.paginaAtual = 1
        const enderecoService = await GetPaginadoService(paginacao ?? {}, `${API_BASE_AGENDA_URL}${UrlBuscarPaginado}`);
        onResultadosBusca(enderecoService ?? {});
    };

    const handleDropdownChange = (e: SelectChangeEvent<string>, tipo: string) => {

        const selectedKey = e.target.value;
        const selectedItem = getSelectedItemByTipo(tipo, selectedKey, colaboradorProps, lojaProps);
        const selectedValue = selectedItem?.value || '';

        switch (tipo) {
            case "colaborador":
                setLojaId(Number(0));
                setLoja('');
                setColaboradorId(Number(selectedKey));
                setColaborador(selectedValue);

                break;
            case "loja":
                setColaboradorId(Number(0));
                setColaborador('');
                setLojaId(Number(selectedKey));
                setLoja(selectedValue);
                break;
            default:
                return null;
        }
    };

    const limparItens = () => {
        setAgendaSemanaInicio(0);
        setAgendaSemanaFim(0);
        setAgendaAbertaInicio('');
        setAgendaAbertaFim('');
        setAgendaBloqueadaInicio('');
        setAgendaBloqueadaFim('');
        setColaborador('');
        setColaboradorId(0);
        setLoja('');
        setLojaId(0);

    }

    const handleButtonClickLimpar = async () => {
        limparItens();
        const agenda: AgendaItens = {
            id: 0,
            razaoSocial: '',
            nome: '',
            descricao: '',
            agendaAbertaInicio: '',
            agendaAbertaFim: '',
            bloqueado: false,
            isTodoDia: false,
            idAgendaSemanaInicio: 0,
            idAgendaSemanaFim: 0,
            agendaBloqueadaInicio: '',
            agendaBloqueadaFim: '',
            diaInicioSemana: '',
            diaSemanaFim: '',
            idLoja: 0,
            idColaborador: 0,
            tipo: Number(tipoItem) ?? 0
        }

        const paginacao = paginar(agenda, 1)
        const agendaService = await GetPaginadoService(paginacao ?? {}, `${API_BASE_AGENDA_URL}${UrlBuscarPaginado}`);
        onResultadosBusca(agendaService ?? {});
        setMostrarFiltros(false);
    }

    const handleIconClick = (tipo: string) => {
        if (tipo === 'agendaAberta') {
            setAgendaAbertaInicio('');
        }
        if (tipo === 'agendaFechada') {
            setAgendaAbertaFim('')
        }
        if (tipo === 'bloquadaInicio') {
            setAgendaBloqueadaInicio('')
        }
        if (tipo === 'bloquadaFim') {
            setAgendaBloqueadaFim('')
        }
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
                        {mostrarFiltros && (
                            <>
                                <Grid item md={4} xs={12} className="dropcuston">

                                    {tipoItem?.toString() === TipoLoja && (
                                        <div className="formItens">
                                            <Dropdown
                                                dropProps={{
                                                    name: "Loja",
                                                    label: "Loja*",
                                                    itens: lojaProps ?? [],
                                                    selectedId: idLoja?.toString() || '',
                                                    onChange: (e: SelectChangeEvent<string>) => handleDropdownChange(e, "loja")
                                                }}
                                            />
                                        </div>
                                    )}
                                    {tipoItem?.toString() === TipoColaborador && (
                                        <div className="formItens-drop">
                                            <Dropdown
                                                dropProps={{
                                                    name: "Colaborador",
                                                    label: "Colaborador*",
                                                    itens: colaboradorProps,
                                                    selectedId: idColaborador || '0',
                                                    onChange: (e: SelectChangeEvent<string>) => handleDropdownChange(e, "colaborador"),
                                                }}
                                            />
                                        </div>
                                    )}
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <div className="formItens">
                                        <Dropdown
                                            dropProps={{
                                                name: "Dia",
                                                label: "Dia da semana Início",
                                                itens: semanaProps,
                                                selectedId: idAgendaSemanaInicio || '0',
                                                onChange: (e: SelectChangeEvent<string>) => handleDropdownChange(e, 'semanaInicio'),
                                            }}
                                        />
                                    </div>
                                </Grid>

                                <Grid item md={4} xs={12}>

                                    <div className="formItens">
                                        <Dropdown
                                            dropProps={{
                                                name: "Dia",
                                                label: "Dia da semana Fim",
                                                itens: semanaProps,
                                                selectedId: idAgendaSemanaFim || '0',
                                                onChange: (e: SelectChangeEvent<string>) => handleDropdownChange(e, 'semanaFim'),
                                            }}
                                        />
                                    </div>
                                </Grid>

                                <div className="item-agenda-pesquisar">
                                    <Grid item md={4} xs={12}>

                                        <div className="formItens">
                                            <DateTimerPicker

                                                label={DataLabelAgendaAberta}
                                                value={agendaAbertaInicio ? dayjs(agendaAbertaInicio) : null}
                                                onChange={setAgendaAbertaInicio}
                                                tipo={"data"}
                                            />
                                            <span className="date-time-itens" onClick={() => handleIconClick("agendaAberta")}>
                                                <Icone iconeProps={{ icone: <FaTrash />, dialogo: "limpar", classItem: "icone" }} />
                                            </span >
                                        </div>
                                    </Grid>

                                    <Grid item md={4} xs={12}>
                                        <div className="formItens">
                                            <DateTimerPicker
                                                label={DataLabelAgendaFechada}
                                                value={agendaAbertaFim ? dayjs(agendaAbertaFim) : null}
                                                onChange={setAgendaAbertaFim}
                                                tipo={"data"}
                                            />
                                            <span className="date-time-itens" onClick={() => handleIconClick("agendaFechada")}>
                                                <Icone iconeProps={{ icone: <FaTrash />, dialogo: "limpar", classItem: "icone" }} />
                                            </span >
                                        </div>
                                    </Grid>
                                    <Grid item md={4} xs={12}>
                                        <div className="formItens">
                                            <DateTimerPicker
                                                label={DataLabelBloqueioAberto}
                                                value={agendaBloqueadaInicio ? dayjs(agendaBloqueadaInicio) : null}
                                                onChange={setAgendaBloqueadaInicio}
                                                tipo={"hora"}
                                            />
                                            <span className="date-time-itens" onClick={() => handleIconClick("bloquadaInicio")}>
                                                <Icone iconeProps={{ icone: <FaTrash />, dialogo: "limpar", classItem: "icone" }} />
                                            </span >
                                        </div>
                                    </Grid>

                                    <Grid item md={4} xs={12}>
                                        <div className="formItens">
                                            <DateTimerPicker
                                                label={DataLabelBloqueioFechado}
                                                value={agendaBloqueadaFim ? dayjs(agendaBloqueadaFim) : null}
                                                onChange={setAgendaBloqueadaFim}
                                                tipo={"hora"}
                                            />

                                            <span className="date-time-itens" onClick={() => handleIconClick("bloquadaFim")}>
                                                <Icone iconeProps={{ icone: <FaTrash />, dialogo: "limpar", classItem: "icone" }} />
                                            </span >
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
                    </Grid>
                </fieldset>
            </div>
        </Grid>
    </>
    )
};

export default AgendaBusca;
