import React, { useCallback, useEffect, useRef, useState } from "react";
import { Avatar, Box, Collapse, Tooltip } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { Dayjs } from "dayjs";
import { FaRegCalendarAlt, FaRegTrashAlt, FaSave } from "react-icons/fa";
import DateTimerPicker from "../../../components/dateTimerPicker";
import Dropdown from "../../../components/dropdown";
import HoraAgendada from "../../../components/horaAgendada";
import Mensagem from "../../../components/mensagem";
import BotaoSubmit from "../../../components/submitButton";
import CampoTexto from "../../../components/textbox";
import { formatarData, formatarHora, formatarHoraComData, formatarSomenteData } from "../../../functions/formatDataHora";
import { mapToSelectItens } from "../../../functions/mapToSelectItens";
import { useFormErros } from "../../../hooks/useFormErros";
import updatePersistirPrev from "../../../hooks/useUpdatePersistirPrev";
import { AgendamentoItem } from "../../../Interfaces/Agendamento/agendamentoItem";
import { HoraAgendadaItem } from "../../../Interfaces/Agendamento/horaAgendadaItem";
import { BotaoItens } from "../../../Interfaces/Botao/botao";
import { ColaboradorItens } from "../../../Interfaces/Colaborador/colaboradorItem";
import { ServicosItens } from "../../../Interfaces/Produto/servicosItens";
import { ErroItem } from "../../../Interfaces/shared/erroItem";
import { PersistirItens } from "../../../Interfaces/shared/persistirItens";
import { SelectItens } from "../../../Interfaces/shared/selectItens";
import { MensagemItens } from "../../../Interfaces/Mensagens/MensagemItens";
import { UsuarioClienteItem } from "../../../Interfaces/Usuario/usuarioClienteItem";
import { RetornarMessageService } from "../../../services/shared/retornarMessageService";
import {
    buscarClientesAgendamento,
    buscarColaboradorPorId,
    buscarServicosAgendamento,
    salvarAgendamento,
} from "../services/agendamentoService";
import styles from "./Agendamento.module.css";

const AgendamentoForm: React.FC<{
    persistirProps: PersistirItens<AgendamentoItem>;
    onDayClick?: (date: Dayjs | null) => void | Promise<void>;
    horasAgendadas?: Array<HoraAgendadaItem>;
}> = ({ persistirProps, onDayClick, horasAgendadas }) => {
    const [messageItens, setMessageItens] = useState<MensagemItens>();
    const [colaborador, setColaborador] = useState<ColaboradorItens>();
    const [clientes, setClientes] = useState<Array<SelectItens>>();
    const [servicos, setServicos] = useState<Array<SelectItens>>();
    const [isMessage, setMessage] = useState<boolean>(false);
    const [id, setId] = useState<number>(0);
    const [idUsuario, setIdUsuario] = useState<string>("");
    const [idColaborador, setIdColaborador] = useState<string>("");
    const [idServico, setIdServico] = useState<number>(0);
    const [nomeUsuario, setNomeUsuario] = useState<string>("");
    const [dataInicio, setDataInicio] = useState<string>("");
    const [dataInicioAgendamento, setDataInicioAgendamento] = useState<string>("");
    const [dataTerminoAgendamento, setDataTerminoAgendamento] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [erros, setErros] = useState<ErroItem[]>([]);
    const [erroTrigger, setErroTrigger] = useState(0);
    const [isHoraOpen, setHoraOpen] = useState<boolean>(false);
    const [dropClienteKey, setDropClienteKey] = useState(0);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useFormErros(erros, erroTrigger);

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
        setDropClienteKey((k) => k + 1);
    };

    const fetchAgendamentoPersistir = useCallback(async () => {
        limparItens();
        setId(persistirProps?.item?.id ?? 0);
        setIdColaborador(persistirProps?.item?.idColaborador ?? "0");
        setIdUsuario(persistirProps?.item?.idUsuario ?? "");
        setIdServico(persistirProps?.item?.idServico ?? 0);
        setDropClienteKey(persistirProps?.item?.idServico ?? 0);
        setDataInicio(formatarSomenteData(persistirProps?.item?.dataInicioAgendamento ?? null));
        setDataInicioAgendamento(formatarHoraComData(persistirProps?.item?.dataInicioAgendamento ?? ""));
        setDataTerminoAgendamento(formatarHoraComData(persistirProps?.item?.dataTerminoAgendamento ?? ""));
        setNomeUsuario(persistirProps?.item?.nomeUsuario ?? "");
    }, [persistirProps]);

    const colaboradorData = useCallback(async () => {
        const response = await buscarColaboradorPorId(Number(persistirProps?.item?.idColaborador));
        setColaborador(response?.data);
    }, [persistirProps]);

    const servicoData = useCallback(async () => {
        const response = await buscarServicosAgendamento();
        const itensSelect = mapToSelectItens(response?.datas as ServicosItens[], "id", "descricao");
        setServicos(itensSelect);
    }, []);

    updatePersistirPrev(colaboradorData, undefined, persistirProps.item);
    updatePersistirPrev(fetchAgendamentoPersistir, undefined, persistirProps.item);
    updatePersistirPrev(servicoData, undefined, persistirProps.item);

    const verificarDigitos = (s?: string | null, n = 3) => {
        if (!s) return false;
        const soAlfaNum = s.normalize("NFC").replace(/[^\p{L}\p{N}]/gu, "");
        return soAlfaNum.length >= n;
    };

    const handlerBuscarUsuario = useCallback(async (term: string) => {
        const response = await buscarClientesAgendamento(term);
        const itensSelect = mapToSelectItens(response?.datas as UsuarioClienteItem[], "id", "nome", "urlImagem", true);
        setClientes(itensSelect);
    }, []);

    const onInputChange = useCallback((value?: string) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (!verificarDigitos(value, 3)) {
            setNomeUsuario("");
            return;
        }

        timerRef.current = setTimeout(() => {
            handlerBuscarUsuario(value!.trim());
            setNomeUsuario(value ?? "");
        }, 1000);
    }, [handlerBuscarUsuario]);

    useEffect(() => () => {
        if (timerRef.current) clearTimeout(timerRef.current);
    }, []);

    const enviarSatusMessage = () => {
        setMessage(true);
        setTimeout(() => {
            setMessage(false);
        }, 6000);
    };

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
            ativo: true,
        };

        const response = await salvarAgendamento(agendamento);
        if (!response?.notifications || response?.notifications?.length === 0) {
            const messageRetorno = await RetornarMessageService(true, true, []);
            setMessageItens(messageRetorno);
            enviarSatusMessage();
            window.setTimeout(() => {
                persistirProps.onSave?.();
            }, 2000);
        } else {
            const errosConvertidos: ErroItem[] = response?.notifications?.map((n) => ({
                Key: n.notificationProps?.Key ?? "",
                Mensagem: n.notificationProps?.Message ?? "",
                erroSession: n.notificationProps?.Key ?? "",
            })) ?? [];
            setErros(errosConvertidos);
            setErroTrigger((prev) => prev + 1);
            enviarSatusMessage();
        }
        setIsLoading(false);
    };

    const handleFormKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
        if (event.key === "Enter") {
            handleSubmit(event);
        }
    };

    const handleDropdownChange = (e: SelectChangeEvent<string>, tipo: string) => {
        if (tipo === "cliente") {
            if (e.target.value === "0") return;
            setIdUsuario(e.target.value);
        }
        if (tipo === "servico") {
            setIdServico(Number(e.target.value));
        }
    };

    const handlerOpenAgendadosClick = useCallback((e?: React.MouseEvent<HTMLButtonElement>) => {
        e?.preventDefault?.();
        const nextOpen = !isHoraOpen;
        setHoraOpen(nextOpen);
        if (nextOpen) {
            const data = formatarData(dataInicio);
            void onDayClick?.(data);
        }
    }, [dataInicio, isHoraOpen, onDayClick]);

    const messageProps: MensagemItens = {
        texto: messageItens?.texto,
        cor: messageItens?.cor,
        isVisible: isMessage,
        onClick: () => setMessage(false),
    };

    const botaoProps: BotaoItens = {
        tooltip: "Salvar",
        isLoading,
        icon: FaSave,
        marginLeft: "4px",
        marginRight: "4px",
        isDisable: false,
    };

    return (
        <div className={styles.formPersistir}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h2>Agendamento</h2>
                    <p>Gerencie clientes, horários e serviços agendados</p>
                </div>

                <div className={styles.messageText}>
                    <Mensagem mensagemProps={messageProps ?? {}} />
                </div>

                <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown} id="frmAgendamento" className={styles.form}>
                    <div className={styles.formActions}>
                        <button onClick={limparItens} className={styles.deleteButton} type="button">
                            <Tooltip title="limpar">
                                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                    <FaRegTrashAlt />
                                </span>
                            </Tooltip>
                        </button>
                    </div>

                    <div className={styles.camposLayout}>
                        <div className={`${styles.coluna} ${styles.campos}`}>
                            <div className={styles.formItensImagem}>
                                <Avatar className={styles.avatar} src={colaborador?.urlImagem ?? persistirProps?.item?.urlImagem} />
                                <span className={styles.nomeAvatar}>{colaborador?.nome}</span>
                                <span className={styles.dataAvatar}>{dataInicio || null}</span>
                            </div>
                            <div className={styles.formItens}>
                                <Dropdown
                                    key={dropClienteKey}
                                    dropProps={{
                                        name: "Cliente",
                                        label: "Cliente*",
                                        value: nomeUsuario,
                                        itens: clientes,
                                        selectedId: idUsuario || "0",
                                        onChange: (e: SelectChangeEvent<string>) => handleDropdownChange(e, "cliente"),
                                        isTextRead: true,
                                        onInputChange,
                                        erroSession: "Cliente",
                                    }}
                                />
                            </div>
                            <div className={styles.formItens}>
                                <Dropdown
                                    dropProps={{
                                        name: "Servico",
                                        label: "Servico*",
                                        itens: servicos,
                                        selectedId: idServico || "",
                                        onChange: (e: SelectChangeEvent<string>) => handleDropdownChange(e, "servico"),
                                        erroSession: "Servico",
                                    }}
                                />
                            </div>
                        </div>

                        <div className={styles.separador}></div>

                        <div className={`${styles.coluna} ${styles.campos}`}>
                            <div className={styles.agendadosHeader}>
                                <button type="button" onClick={handlerOpenAgendadosClick} className={styles.calendarToggle} aria-expanded={isHoraOpen} aria-controls="agendados-panel">
                                    <Tooltip title="agendados">
                                        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                            <Box
                                                component="span"
                                                sx={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    transition: "transform .18s ease",
                                                    transform: isHoraOpen ? "rotate(180deg)" : "rotate(0deg)",
                                                }}
                                            >
                                                <FaRegCalendarAlt />
                                            </Box>
                                        </span>
                                    </Tooltip>
                                </button>
                            </div>

                            <div className={styles.agendadosPanel}>
                                <Collapse
                                    in={isHoraOpen}
                                    timeout={{ enter: 90, exit: 70 }}
                                    easing={{
                                        enter: "cubic-bezier(0.2, 0, 0, 1)",
                                        exit: "cubic-bezier(0.4, 0, 1, 1)",
                                    }}
                                    collapsedSize={0}
                                >
                                    <Box id="agendados-panel" component="div" sx={{ willChange: "height", overflow: "hidden" }}>
                                        <HoraAgendada horaAgendadaItem={horasAgendadas} isReadOnly />
                                    </Box>
                                </Collapse>
                            </div>

                            <div className={styles.pickerRow}>
                                <DateTimerPicker
                                    name="DataInicioAgendamento"
                                    label="Hora Inicio"
                                    value={formatarHora(dataInicioAgendamento)}
                                    onChange={setDataInicioAgendamento}
                                    tipo="hora"
                                    erroSession="DataInicioAgendamento"
                                />
                                <DateTimerPicker
                                    name="DataTerminoAgendamento"
                                    label="Hora Termino"
                                    value={formatarHora(dataTerminoAgendamento)}
                                    onChange={setDataTerminoAgendamento}
                                    tipo="hora"
                                    erroSession="DataTerminoAgendamento"
                                />
                            </div>

                            <div className={styles.botaoArea}>
                                <BotaoSubmit botaoProps={botaoProps} />
                            </div>
                        </div>
                    </div>

                    <div className={styles.hiddenFields}>
                        <CampoTexto
                            textBoxProps={{
                                name: "id",
                                value: id?.toString(),
                                type: "hidden",
                                onChange: (e: React.ChangeEvent<HTMLInputElement>) => setId(Number(e.target.value)),
                            }}
                        />
                        <CampoTexto
                            textBoxProps={{
                                name: "idColaborador",
                                value: idColaborador?.toString(),
                                type: "hidden",
                                onChange: (e: React.ChangeEvent<HTMLInputElement>) => setIdColaborador(e.target.value),
                            }}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AgendamentoForm;
