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
import { BotaoItens } from '../../Interfaces/Botao/botao';
import { paginar } from "../../functions/paginacao";
import { GetPaginadoService } from '../../services/shared/getPaginadoService';
import { API_BASE_AGENDA_URL } from "../../config/apiConfig";
import { formatarHoraComData } from '../../functions/formatDataHora';
import { FaTrash } from 'react-icons/fa';
import Icone from '../../components/icone';
import Dropdown from "../../components/dropdown";
import dayjs from 'dayjs';
import DateTimerPicker from '../../components/dateTimerPicker';
import Botao from '../../components/button';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';

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
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const lojaProps = selectItens.find((item) => item.name === "loja")?.selectItems ?? [];
    const semanaProps = selectItens.find((item) => item.name === "semana")?.selectItems ?? [];
    const colaboradorProps = selectItens.find((item) => item.name === "colaborador")?.selectItems ?? [];

    const handleButtonClick = () => {
        const fakeEvent = { preventDefault: () => { } } as React.FormEvent;
        handleSearch(fakeEvent);
    };
    const handleSearch = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);

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
        setIsLoading(false);
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

    const botaoProps: BotaoItens = {
        tooltip: 'Buscar',
        width: '20px',
        onIconClick: handleButtonClick,
        isLoading: isLoading,
        color: 'success',
        icon: SearchIcon
    };

    const limparItens = () => {
        setIsLoading(false);
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
    }

    const botaoLimparProps: BotaoItens = {
        tooltip: 'Limpar',
        width: '20px',
        color: 'info',
        icon: RefreshIcon,
        onIconClick: handleButtonClickLimpar
    };

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
        <div className="agendaBuscarConteudo">
            <div className="gridBuscarAgenda">
                <div className="titulobusca">
                    <h4>Buscar</h4>
                </div>

                <Grid container spacing={2} className="formItensBusca ">
                    <Grid item md={3} xs={12}>
                        <div className="formItens formItemMenor">

                            {tipoItem?.toString() === TipoLoja && (
                                <div className="formItens-drop">
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

                        </div>
                    </Grid>
                    <Grid item md={3} xs={12}>
                        <div className="formItens formItemMenor">
                            <div className="formItens-drop">
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
                        </div>
                    </Grid>
                    <Grid item md={3} xs={12}>
                        <div className="formItens formItemMenor">
                            <div className="formItens-drop">
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

                        </div>
                    </Grid>
                    <Grid item md={3} xs={12}>
                    </Grid>
                    <Grid item md={3} xs={12}>
                        <div className="formItens formItemMenor">
                            <div className="formItens-drop">
                                <DateTimerPicker
                                    label={DataLabelAgendaAberta}
                                    value={agendaAbertaInicio ? dayjs(agendaAbertaInicio) : null}
                                    onChange={setAgendaAbertaInicio}
                                    width={'360'}
                                    tipo={"data"}
                                />
                                <span className="date-time-itens" onClick={() => handleIconClick("agendaAberta")}>
                                    <Icone iconeProps={{ icone: <FaTrash />, dialogo: "limpar" }} />
                                </span >
                            </div>
                        </div>
                    </Grid>

                    <Grid item md={3} xs={12}>
                        <div className="formItens formItemMenor">
                            <div className="formItens-drop">
                                <DateTimerPicker
                                    label={DataLabelAgendaFechada}
                                    value={agendaAbertaFim ? dayjs(agendaAbertaFim) : null}
                                    onChange={setAgendaAbertaFim}
                                    width={'360'}
                                    tipo={"data"}
                                />
                                <span className="date-time-itens" onClick={() => handleIconClick("agendaFechada")}>
                                    <Icone iconeProps={{ icone: <FaTrash />, dialogo: "limpar" }} />
                                </span >
                            </div>
                        </div>
                    </Grid>

                    <Grid item md={3} xs={12}>
                        <div className="formItens formItemMenor">
                            <div className="formItens-drop">
                                <DateTimerPicker
                                    label={DataLabelBloqueioAberto}
                                    value={agendaBloqueadaInicio ? dayjs(agendaBloqueadaInicio) : null}
                                    onChange={setAgendaBloqueadaInicio}
                                    width={'360'}
                                    tipo={"hora"}
                                />
                                <span className="date-time-itens" onClick={() => handleIconClick("bloquadaInicio")}>
                                    <Icone iconeProps={{ icone: <FaTrash />, dialogo: "limpar" }} />
                                </span >
                            </div>
                        </div>
                    </Grid>

                    <Grid item md={3} xs={12}>
                        <div className="formItens formItemMenor">
                            <div className="formItens-drop">
                                <DateTimerPicker
                                    label={DataLabelBloqueioFechado}
                                    value={agendaBloqueadaFim ? dayjs(agendaBloqueadaFim) : null}
                                    onChange={setAgendaBloqueadaFim}
                                    width={'360'}
                                    tipo={"hora"}
                                />

                                <span  className="date-time-itens" onClick={() => handleIconClick("bloquadaFim")}>
                                    <Icone iconeProps={{ icone: <FaTrash />, dialogo: "limpar" }} />
                                </span >
                            </div>
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
        </div>
    </>
    )
};

export default AgendaBusca;
