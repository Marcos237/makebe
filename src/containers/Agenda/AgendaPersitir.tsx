import React, { useState, useCallback } from "react";
import { PersistirItens } from "../../Interfaces/shared/persistirItens";
import { MensagemItens } from "../../Interfaces/Mensagens/MensagemItens";
import { Grid } from "@mui/material";
import {
    DataLabelAgendaAberta, DataLabelAgendaFechada,
    DataLabelBloqueioAberto, DataLabelBloqueioFechado, SwitchTodoDia, SwitchBloqueio, UrlAgenda,
    TipoColaborador, TipoLoja

} from "../../constants/Agenda/agendaConstant";
import { SelectChangeEvent } from '@mui/material/Select';
import { SwitchButtonItem } from "../../Interfaces/shared/switchButtonItem";
import { BotaoItens } from '../../Interfaces/Botao/botao';
import { PostService } from "../../services/shared/postService";
import { API_BASE_AGENDA_URL } from '../../config/apiConfig';
import { RetornarMessageService } from '../../services/shared/retornarMessageService';
import { formatarHoraComData, formatarHora } from '../../functions/formatDataHora';
import CampoTexto from '../../components/textbox';
import Botao from '../../components/button';
import Mensagem from '../../components/mensagem';
import DateTimerPicker from '../../components/dateTimerPicker';
import Dropdown from "../../components/dropdown";
import SwitchButton from "../../components/switchButton";
import RefreshIcon from '@mui/icons-material/Refresh';
import updatePersistirPrev from "../../hooks/useUpdatePersistirPrev";
import { AgendaItens } from "../../Interfaces/Agenda/AgendaItens";


const AgendaLojaPersistir: React.FC<{
    persistirProps: PersistirItens<AgendaItens>,
    persistirDropProps: Array<PersistirItens<AgendaItens>>,
    tipoItem?: number;
}> = ({ persistirProps, persistirDropProps, tipoItem }) => {
    const [messageItens, setMessageItens] = useState<MensagemItens>();
    const [isMessage, setMessage] = useState<boolean>(false);
    const [id, setId] = useState<number>(0);
    const [isTodoDia, setTodoDia] = useState<boolean>(false);
    const [idAgendaSemanaInicio, setAgendaSemanaInicio] = useState<number>(0);
    const [tipo, setTipo] = useState<number>();
    const [idAgendaSemanaFim, setAgendaSemanaFim] = useState<number>(0);
    const [agendaAbertaInicio, setAgendaAbertaInicio] = useState<string>('');
    const [agendaAbertaFim, setAgendaAbertaFim] = useState<string>('');
    const [agendaBloqueadaInicio, setAgendaBloqueadaInicio] = useState<string>('');
    const [agendaBloqueadaFim, setAgendaBloqueadaFim] = useState<string>('');
    const [isBloqueadoHoje, setBloquadoHoje] = useState<boolean>(false);
    const [idLoja, setIdLoja] = useState<number>(0);
    const [idColaborador, setColaboradorId] = useState<number>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const lojaProps = persistirDropProps.find((item) => item.name === "loja")?.selectItems ?? [];
    const colaboradorProps = persistirDropProps.find((item) => item.name === "colaborador")?.selectItems ?? [];
    const semanaProps = persistirDropProps.find((item) => item.name === "semana")?.selectItems ?? [];
    const [isLeitura, setIsLeitura] = useState<boolean>(false);
    const [isLeituraBloqueado, setIsLeituraBloqueado] = useState<boolean>(false);

    const fetchAgendaPersistir = useCallback(async () => {

        setId(persistirProps?.item?.id ?? 0);
        setTodoDia(persistirProps?.item?.isTodoDia ?? false);
        setAgendaSemanaInicio(persistirProps?.item?.idAgendaSemanaInicio ?? 0);
        setAgendaSemanaFim(persistirProps?.item?.idAgendaSemanaFim ?? 0);
        setAgendaAbertaInicio(persistirProps?.item?.agendaAbertaInicio ?? '');
        setAgendaAbertaFim(persistirProps?.item?.agendaAbertaFim ?? '');
        setAgendaBloqueadaInicio(persistirProps?.item?.agendaBloqueadaInicio ?? '');
        setAgendaBloqueadaFim(persistirProps?.item?.agendaBloqueadaFim ?? '');
        setBloquadoHoje(persistirProps?.item?.bloqueado ?? false);
        setIdLoja(persistirProps?.item?.idLoja ?? 0);
        setTipo(tipoItem);
        setColaboradorId(persistirProps?.item?.idColaborador);

        setIsLeitura(persistirProps?.item?.isTodoDia ?? false);
    }, [persistirProps, tipoItem])

    updatePersistirPrev(fetchAgendaPersistir, undefined, persistirProps.item);

    const handleCloseMessage = () => {
        setMessage(false);
    };
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        const agenda: AgendaItens = {
            id: id || 0,
            isTodoDia: isTodoDia,
            idAgendaSemanaInicio: idAgendaSemanaInicio,
            idAgendaSemanaFim: idAgendaSemanaFim,
            agendaAbertaInicio: formatarHoraComData(agendaAbertaInicio),
            agendaAbertaFim: formatarHoraComData(agendaAbertaFim),
            agendaBloqueadaInicio: formatarHoraComData(agendaBloqueadaInicio),
            agendaBloqueadaFim: formatarHoraComData(agendaBloqueadaFim),
            bloqueado: isBloqueadoHoje,
            idLoja: idLoja,
            idColaborador: idColaborador,
            tipo: Number(tipoItem) ?? tipo
        }
        const agendaResponse = await PostService(agenda, `${API_BASE_AGENDA_URL}${UrlAgenda}`);
        if (!agendaResponse?.notifications || agendaResponse?.notifications?.length === 0) {
            const messageRetorno = await RetornarMessageService(true, true, [])
            setMessageItens(messageRetorno)
            persistirDropProps.forEach(item => {
                item.onSave?.();
                item.isSave = true
            });
            limparItens();

        } else {
            const messageRetorno = await RetornarMessageService(false, false, agendaResponse?.notifications ?? [])
            setMessageItens(messageRetorno)
        }
        enviarSatusMessage();
        setIsLoading(false);
    }
    const handleFormKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {

        if (event.key === 'Enter') {
            handleSubmit(event);
        }
    };

    const messageProps: MensagemItens = {
        texto: messageItens?.texto,
        cor: messageItens?.cor,
        isVisible: isMessage,
        onClick: handleCloseMessage
    }

    const handleDropdownChange = (e: SelectChangeEvent<string>, tipo: string) => {

        if (tipo === 'loja') {
            setIdLoja(Number(e.target.value))
        }
        if (tipo === "colaborador") {
            setColaboradorId(Number(e.target.value))
        }
        if (tipo === 'semanaInicio') {
            setAgendaSemanaInicio(Number(e.target.value))
        }
        if (tipo === 'semanaFim') {
            setAgendaSemanaFim(Number(e.target.value))
        }
    };

    const handleChange = (tipo: string) => {
        if (tipo === 'todoDia') {
            setAgendaSemanaInicio(0);
            setAgendaSemanaFim(0);
            setTodoDia(!isTodoDia);
            setIsLeitura(!isTodoDia);

        }
        if (tipo === 'bloquiadoHoje') {

            setBloquadoHoje(!isBloqueadoHoje);
            setAgendaBloqueadaInicio('');
            setAgendaBloqueadaFim('');
            setIsLeituraBloqueado(!isBloqueadoHoje);
        }
    };

    const switchButton: SwitchButtonItem = {
        label: SwitchTodoDia,
        checked: isTodoDia,
        handleChange: () => handleChange('todoDia')
    }
    const switchButtonBloqueio: SwitchButtonItem = {
        label: SwitchBloqueio,
        checked: isBloqueadoHoje,
        handleChange: () => handleChange('bloquiadoHoje')
    }

    const handleButtonClick = () => {
        const fakeEvent = {
            preventDefault: () => { }
        } as React.FormEvent;
        handleSubmit(fakeEvent);
    };

    const enviarSatusMessage = () => {
        setMessage(true)
        setTimeout(() => {
            setMessage(false);
        }, 6000);
    }

    const handleButtonClickLimpar = async () => {
        limparItens();
    }

    const limparItens = () => {
        setIsLoading(false);
        setId(0);
        setTodoDia(false);
        setAgendaSemanaInicio(0);
        setAgendaSemanaFim(0);
        setAgendaAbertaInicio('');
        setAgendaAbertaFim('');
        setAgendaBloqueadaInicio('');
        setAgendaBloqueadaFim('');
        setBloquadoHoje(false);
        setIdLoja(0);
        setColaboradorId(0);
        setTipo(tipoItem);
    }

    const botaoProps: BotaoItens = {
        name: 'Salvar',
        tooltip: 'Fazer o cadastro',
        label: 'Salvar',
        width: '200px',
        onIconClick: handleButtonClick,
        color: 'primary',
        isLoading: isLoading,
    };

    const botaoLimparProps: BotaoItens = {
        tooltip: 'limpar',
        width: '20px',
        onIconClick: handleButtonClickLimpar,
        color: 'success',
        icon: RefreshIcon
    };

    return <>
        <div className='messageTextLoja'>
            <Mensagem mensagemProps={messageProps ?? {}} />
        </div>
        <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown} className="conteudo">
            <Grid container spacing={2}>
                <Grid item md={6} xs={10} className='gridEsquerdo'>
                    <div className='conteudoEsquerdoAgenda conteudoMenorEsquerdo'>
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

                        <div className="formItens-drop">
                            <SwitchButton switchProps={switchButton} />
                        </div>

                        <div className="">
                            <div className="formItens-drop">
                                <Dropdown
                                    dropProps={{
                                        name: "Dia",
                                        label: "Dia da semana Início",
                                        itens: semanaProps,
                                        selectedId: idAgendaSemanaInicio || '0',
                                        isLeitura: isLeitura,
                                        onChange: (e: SelectChangeEvent<string>) => handleDropdownChange(e, 'semanaInicio'),
                                    }}
                                />
                            </div>
                            <div className="formItens-drop">
                                <Dropdown
                                    dropProps={{
                                        name: "Dia",
                                        label: "Dia da semana Fim",
                                        itens: semanaProps,
                                        selectedId: idAgendaSemanaFim || '0',
                                        isLeitura: isLeitura,
                                        onChange: (e: SelectChangeEvent<string>) => handleDropdownChange(e, 'semanaFim'),
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </Grid>
                <div className="separador"></div>
                <Grid item md={6} xs={12} className="gridDireito">
                    <div className='conteudoDireitoAgenda conteudoMenorDireito'>
                        <div className="formItensHorizontal itemPicker">
                            <DateTimerPicker
                                label={DataLabelAgendaAberta}
                                value={formatarHora(agendaAbertaInicio)}
                                onChange={setAgendaAbertaInicio}
                                width={'450'}
                                tipo={"datahora"}
                            />

                            <DateTimerPicker
                                label={DataLabelAgendaFechada}
                                value={formatarHora(agendaAbertaFim)}
                                onChange={setAgendaAbertaFim}
                                width={'450'}
                                tipo={"datahora"}
                            />
                        </div>

                        <div className="formItens-drop">
                            <SwitchButton switchProps={switchButtonBloqueio} />
                        </div>

                        <div className="formItensHorizontal itemPicker itemPickerBaixo">
                            <DateTimerPicker
                                label={DataLabelBloqueioAberto}
                                value={formatarHora(agendaBloqueadaInicio)}
                                onChange={setAgendaBloqueadaInicio}
                                width={'450'}
                                tipo={"hora"}
                                isLeituraOnly={isLeituraBloqueado}
                            />


                            <DateTimerPicker
                                label={DataLabelBloqueioFechado}
                                value={formatarHora(agendaBloqueadaFim)}
                                onChange={setAgendaBloqueadaFim}
                                width={'450'}
                                tipo={"hora"}
                                isLeituraOnly={isLeituraBloqueado}
                            />
                        </div>

                    </div>

                    <div className='camposInvisiveis'>
                        <CampoTexto
                            textBoxProps={{
                                name: "id",
                                value: id?.toString(),
                                type: 'hidden',
                                onChange: (e: React.ChangeEvent<HTMLInputElement>) => setId(Number(e.target.value))
                            }} />
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <div className="formItens gridBotoes">
                        <div className="botao">
                            <Botao botaoProps={botaoLimparProps} />
                        </div>
                        <div className="botao">
                            <Botao botaoProps={botaoProps} />
                        </div>
                    </div>
                </Grid>
            </Grid>
        </form>

    </>
}

export default AgendaLojaPersistir;