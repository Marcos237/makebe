import React, { useState, useCallback, useEffect, useRef, useTransition } from "react";
import { PersistirItens } from "../../Interfaces/shared/persistirItens";
import { MensagemItens } from "../../Interfaces/Mensagens/MensagemItens";
import { AgendamentoItem } from "../../Interfaces/Agendamento/agendamentoItem";
import { SelectChangeEvent } from '@mui/material/Select';
import { FaRegTrashAlt, FaRegCalendarAlt } from "react-icons/fa";
import { ColaboradorItens } from "../../Interfaces/Colaborador/colaboradorItem";
import { useFormErros } from '../../hooks/useFormErros';
import { ErroItem } from '../../Interfaces/shared/erroItem';
import { PostService } from "../../services/shared/postService";
import { formatarData, formatarHoraComData, formatarHora, formatarSomenteData } from "../../functions/formatDataHora";
import { UrlBuscarPorId } from '../../constants/Colaborador/colaboradorConstant';
import { API_BASE_AGENDA_URL, API_BASE_URL } from '../../config/apiConfig';
import { GetByIdService } from "../../services/shared/getByIdService";
import { ResponseItem } from '../../Interfaces/shared/ResponseItem';
import { BotaoItens } from '../../Interfaces/Botao/botao';
import { UrlBuscarCliente } from '../../constants/shared/baseConstant';
import { UsuarioClienteItem } from "../../Interfaces/Usuario/usuarioClienteItem";
import { SelectItens } from "../../Interfaces/shared/selectItens";
import { mapToSelectItens } from '../../functions/mapToSelectItens';
import { UrlServico } from '../../constants/Servicos/servicoConstant';
import { ServicosItens } from "../../Interfaces/Produto/servicosItens";
import { GetAllService } from "../../services/shared/getAllService";
import { HoraAgendadaItem } from "../../Interfaces/Agendamento/horaAgendadaItem";
import { FaSave } from 'react-icons/fa';
import { Dayjs } from "dayjs";
import { RetornarMessageService } from '../../services/shared/retornarMessageService';
import { UrlAgendamento } from "../../constants/Agendamento/agendamentoConstant";
import { Grid, Collapse, Tooltip, IconButton, Box } from "@mui/material";
import DateTimerPicker from '../../components/dateTimerPicker';
import updatePersistirPrev from "../../hooks/useUpdatePersistirPrev";
import BotaoSubmit from '../../components/submitButton';
import HoraAgendada from "../../components/horaAgendada";
import Avatar from '@mui/material/Avatar';
import CampoTexto from '../../components/textbox';
import Mensagem from '../../components/mensagem';
import Dropdown from "../../components/dropdown";




const AgendamentoPersistir: React.FC<{
    persistirProps: PersistirItens<AgendamentoItem>;
    onDayClick?: (date: Dayjs | null) => void | Promise<void>;
    horasAgendadas?: Array<HoraAgendadaItem>;
}> = ({ persistirProps, onDayClick, horasAgendadas }) => {
    const [messageItens, setMessageItens] = useState<MensagemItens>();
    const [useColaborador, setColaborador] = useState<ColaboradorItens>();
    const [useClientes, setClientes] = useState<Array<SelectItens>>();
    const [useServicos, setServicos] = useState<Array<SelectItens>>();
    const [isMessage, setMessage] = useState<boolean>(false);
    const [id, setId] = useState<number>(0);
    const [idUsuario, setIdUsuario] = useState<string>("");
    const [idColaborador, setIdColaborador] = useState<string>("");
    const [idServico, setIdServico] = useState<number>(0);
    const [nomeUsuario, setNomeUsuario] = useState<string>("")
    const [dataInicio, setDataInicio] = useState<string>("");
    const [dataInicioAgendamento, setDataInicioAgendamento] = useState<string>("");
    const [dataTerminoAgendamento, setDataTerminoAgendamento] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [erros, setErros] = useState<ErroItem[]>([]);
    const [erroTrigger, setErroTrigger] = useState(0);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [isHoraOpen, setHoraOpen] = useState<boolean>(false);
    const [dropClienteKey, setDropClienteKey] = useState(0);
    const [isPending, startTransition] = useTransition();

    useFormErros(erros, erroTrigger);
    const fetchAgendamentoPersistir = useCallback(async () => {

        limparItens();
        setId(persistirProps?.item?.id ?? 0);
        setIdColaborador(persistirProps?.item?.idColaborador ?? "0");
        setIdUsuario(persistirProps?.item?.idUsuario ?? "");
        setIdServico(persistirProps?.item?.idServico ?? 0);
        setDropClienteKey(persistirProps?.item?.idServico ?? 0)
        setDataInicio(formatarSomenteData(persistirProps?.item?.dataInicioAgendamento ?? null));
        setDataInicioAgendamento(formatarHoraComData(persistirProps?.item?.dataInicioAgendamento ?? ''));
        setDataTerminoAgendamento(formatarHoraComData(persistirProps?.item?.dataTerminoAgendamento ?? ''));
        setNomeUsuario(persistirProps?.item?.nomeUsuario ?? "")

    }, [persistirProps])

    const colaboradorData = useCallback(async () => {
        const id = Number(persistirProps?.item?.idColaborador);
        const response = await GetByIdService(id, `${API_BASE_AGENDA_URL}${UrlBuscarPorId}`) as ResponseItem<ColaboradorItens>;
        setColaborador(response?.data);
    }, [persistirProps])

    const servicoData = useCallback(async () => {
        const response = await GetAllService(`${API_BASE_AGENDA_URL}${UrlServico}`) as ResponseItem<ServicosItens>;
        const itensSelect = mapToSelectItens(response?.datas, 'id', 'descricao');
        setServicos(itensSelect);
    }, [])

    updatePersistirPrev(colaboradorData, undefined, persistirProps.item);
    updatePersistirPrev(fetchAgendamentoPersistir, undefined, persistirProps.item);
    updatePersistirPrev(servicoData, undefined, persistirProps.item);

    const verificarDigitos = (s?: string | null, n = 3) => {
        if (!s) return false;
        const soAlfaNum = s.normalize('NFC').replace(/[^\p{L}\p{N}]/gu, '');
        return soAlfaNum.length >= n;
    };
    const handlerBuscarUsuario = useCallback(async (term: string) => {
        const response = await GetByIdService(term, `${API_BASE_URL}${UrlBuscarCliente}`) as ResponseItem<UsuarioClienteItem>;
        const itensSelect = mapToSelectItens(response?.datas, 'id', 'nome', "urlImagem", true);
        setClientes(itensSelect)
    }, []);

    const onInputChange = useCallback((value?: string) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (!verificarDigitos(value, 3)) {
            setNomeUsuario("");
            return;
        };

        timerRef.current = setTimeout(() => {
            handlerBuscarUsuario(value!.trim());

            setNomeUsuario(value ?? '');
        }, 1000);
    }, [handlerBuscarUsuario]);

    useEffect(() => () => {
        if (timerRef.current)
            clearTimeout(timerRef.current);
    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        const agendamento: AgendamentoItem = {
            id: id ?? 0,
            idColaborador: idColaborador ?? id,
            idServico: idServico ?? 0,
            idUsuario: idUsuario ?? "",
            dataInicioAgendamento: formatarHora(dataInicioAgendamento) ?? undefined,
            dataTerminoAgendamento: formatarHora(dataTerminoAgendamento) ?? undefined,
            dataInicioAgendamentoExtenso: formatarHoraComData(dataInicioAgendamento) ?? "",
            dataTerminoAgendamentoExtenso: formatarHoraComData(dataTerminoAgendamento) ?? "",
            data: dataInicio ?? "",
            ativo: true
        }
        const response = await PostService(agendamento, `${API_BASE_AGENDA_URL}${UrlAgendamento}`);
        if (!response?.notifications || response?.notifications?.length === 0) {
            const messageRetorno = await RetornarMessageService(true, true, [])
            setMessageItens(messageRetorno)

        } else {
            const errosConvertidos: ErroItem[] = response?.notifications?.map((n) => ({
                Key: n.notificationProps?.Key ?? '',
                Mensagem: n.notificationProps?.Message ?? '',
                erroSession: n.notificationProps?.Key ?? ''
            })) ?? [];
            setErros(errosConvertidos);
            setErroTrigger(prev => prev + 1);
        }
        enviarSatusMessage();
        setIsLoading(false);

    }

    const limparItens = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setIsLoading(false);
        setId(0);
        setIdServico(0);
        setIdColaborador("");
        setIdUsuario("0");
        setDataInicioAgendamento("");
        setDataTerminoAgendamento("");
        setDataInicio("");
        setClientes([]);
        setDropClienteKey(k => k + 1);

    };
    const enviarSatusMessage = () => {
        setMessage(true)
        setTimeout(() => {
            setMessage(false);
        }, 6000);
    }

    const handleCloseMessage = () => {
        setMessage(false);
    };
    const messageProps: MensagemItens = {
        texto: messageItens?.texto,
        cor: messageItens?.cor,
        isVisible: isMessage,
        onClick: handleCloseMessage
    }
    const handleFormKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
        if (event.key === 'Enter') {
            handleSubmit(event);
        }
    };

    const handleDropdownChange = (e: SelectChangeEvent<string>, tipo: string) => {
        if (tipo === "cliente") {
           if(e.target.value === '0') {return;}
            setIdUsuario(e.target.value)
        }
        if (tipo === "servico") {
            setIdServico(Number(e.target.value))
        }
    };
    const handleButtonClickLimpar = async () => {
        limparItens();
    }

    const handlerOpenAgendadosClick = useCallback((e?: React.PointerEvent | React.MouseEvent) => {
        e?.preventDefault?.();
        setHoraOpen(prev => {
            const next = !prev;
            if (next) {
                startTransition(() => {
                    const data = formatarData(dataInicio);
                    onDayClick?.(data);
                });
            }
            return next;
        });
    }, [dataInicio, onDayClick, startTransition]);

    const botaoProps: BotaoItens = {
        tooltip: 'Salvar',
        isLoading: isLoading,
        icon: FaSave,
        marginLeft: '4px',
        marginRight: '4px',
        isDisable: isPending

    };


    return <>
        <div className='messageTextLoja'>
            <Mensagem mensagemProps={messageProps ?? {}} />
        </div>
        <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown} id="frmAgendamento">
            <Grid container spacing={2} className="ContainerGrid" component="div">
                <div className='conteudo'>
                    <fieldset className='icone-box icone-box-form'>
                        <legend>Agendamento</legend>

                        <div className="links-login">
                            <button onClick={handleButtonClickLimpar} className="botao-link">
                                <Tooltip title="limpar">
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                        <FaRegTrashAlt />
                                    </span>
                                </Tooltip>
                            </button>
                        </div>

                        <Grid item md={6} xs={12} className='gridEsquerdo'>
                            <div className='conteudoEsquerdoAgendamento conteudoMenorEsquerdo'>
                                <div className="formItens-drop grid-avatar">

                                    <div className='formItens-imagem'>
                                        <Avatar src={useColaborador?.urlImagem ?? persistirProps?.item?.urlImagem} sx={{ width: 148, height: 148 }}>
                                        </Avatar>
                                    </div>
                                    <span className="nome-avatar">{useColaborador?.nome}</span>
                                    <span className="data-avatar">{dataInicio || null}</span>
                                </div>

                                <div className="formItens-drop">
                                    <Dropdown
                                        key={dropClienteKey}
                                        dropProps={{
                                            name: "Cliente",
                                            label: "Cliente*",
                                            value: nomeUsuario,
                                            itens: useClientes,
                                            selectedId: idUsuario || '0',
                                            onChange: (e: SelectChangeEvent<string>) => handleDropdownChange(e, "cliente"),
                                            isTextRead: true,
                                            onInputChange: onInputChange,
                                            erroSession: "Cliente"
                                        }}
                                    />
                                </div>

                                <div className="formItens-drop">
                                    <Dropdown
                                        dropProps={{
                                            name: "Servico",
                                            label: "Servico*",
                                            itens: useServicos,
                                            selectedId: idServico || '',
                                            onChange: (e: SelectChangeEvent<string>) => handleDropdownChange(e, "servico"),
                                            erroSession: "Servico"
                                        }}
                                    />
                                </div>
                            </div>
                        </Grid>
                        <div className="separador"></div>
                        <Grid item md={6} xs={12} className='gridDireito'>
                            <div className="conteudoDireitoAgendamento conteudoMenorDireito">

                                <div className="horas-itens">
                                    <Tooltip title="agendados">
                                        <IconButton
                                            onPointerDown={handlerOpenAgendadosClick}
                                            aria-expanded={isHoraOpen}
                                            aria-controls="agendados-panel"
                                            size="small"
                                            sx={{
                                                color: "#ed145b",
                                                transition: "transform .12s ease-out",
                                                "&:hover": { transform: "scale(1.06)" },
                                                "&:active": { transform: "scale(0.94)" }
                                            }}
                                        >
                                            <Box component="div"
                                                sx={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    transition: "transform .18s ease",
                                                    transform: isHoraOpen ? "rotate(180deg)" : "rotate(0deg)"

                                                }}
                                            >
                                                <FaRegCalendarAlt />


                                            </Box>
                                        </IconButton>
                                    </Tooltip>

                                </div>

                                <div className="agendados-item">
                                    <Collapse
                                        in={isHoraOpen}
                                        timeout={{ enter: 220, exit: 180 }}
                                        easing={{
                                            enter: "cubic-bezier(0.2, 0, 0, 1)",
                                            exit: "cubic-bezier(0.4, 0, 1, 1)"
                                        }}
                                        collapsedSize={0}
                                    >
                                        <Box id="agendados-panel" component="div" sx={{ willChange: "height", overflow: "hidden" }}>
                                            <HoraAgendada
                                                horaAgendadaItem={horasAgendadas}
                                                isReadOnly
                                            />
                                        </Box>
                                    </Collapse>
                                </div>

                                <div className="formItensHorizontal itemPicker item-horas">
                                    <DateTimerPicker
                                        name={"DataInicioAgendamento"}
                                        label={"Hora Inicio"}
                                        value={formatarHora(dataInicioAgendamento)}
                                        onChange={setDataInicioAgendamento}
                                        tipo={"hora"}
                                        erroSession="DataInicioAgendamento"
                                    />


                                    <DateTimerPicker
                                        name={"DataTerminoAgendamento"}
                                        label={"Hora Termino"}
                                        value={formatarHora(dataTerminoAgendamento)}
                                        onChange={setDataTerminoAgendamento}
                                        tipo={"hora"}
                                        erroSession="DataTerminoAgendamento"
                                    />
                                </div>


                                <div className="gridBotoes">
                                    <div className="botao botao-salvar">
                                        <BotaoSubmit botaoProps={botaoProps} />
                                    </div>
                                </div>
                            </div>
                        </Grid>
                    </fieldset>
                </div>
            </Grid>

            <div className='camposInvisiveis'>
                <CampoTexto
                    textBoxProps={{
                        name: "id",
                        value: id?.toString(),
                        type: 'hidden',
                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setId(Number(e.target.value))
                    }} />
                <CampoTexto
                    textBoxProps={{
                        name: "idColaborador",
                        value: idColaborador?.toString(),
                        type: 'hidden',
                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setIdColaborador(e.target.value)
                    }} />

            </div>
        </form >
    </>
}
export default AgendamentoPersistir;