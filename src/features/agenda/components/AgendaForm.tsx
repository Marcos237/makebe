import React, { useCallback, useState } from "react";
import { Tooltip } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { FaRegTrashAlt, FaSave } from "react-icons/fa";
import { useParams } from "react-router-dom";
import CampoTexto from "../../../components/textbox";
import DateTimerPicker from "../../../components/dateTimerPicker";
import Dropdown from "../../../components/dropdown";
import Mensagem from "../../../components/mensagem";
import BotaoSubmit from "../../../components/submitButton";
import SwitchButton from "../../../components/switchButton";
import {
    DataLabelAgendaAberta,
    DataLabelAgendaFechada,
    DataLabelBloqueioAberto,
    DataLabelBloqueioFechado,
    SwitchBloqueio,
    SwitchTodoDia,
    TipoColaborador,
    TipoLoja,
} from "../../../constants/Agenda/agendaConstant";
import { formatarHora, formatarHoraComData } from "../../../functions/formatDataHora";
import { BotaoItens } from "../../../Interfaces/Botao/botao";
import { AgendaItens } from "../../../Interfaces/Agenda/AgendaItens";
import { MensagemItens } from "../../../Interfaces/Mensagens/MensagemItens";
import { ErroItem } from "../../../Interfaces/shared/erroItem";
import { PersistirItens } from "../../../Interfaces/shared/persistirItens";
import { SwitchButtonItem } from "../../../Interfaces/shared/switchButtonItem";
import { useFormErros } from "../../../hooks/useFormErros";
import updatePersistirPrev from "../../../hooks/useUpdatePersistirPrev";
import { RetornarMessageService } from "../../../services/shared/retornarMessageService";
import { mapNotificationErrors } from "../../../utils/mapNotificationErrors";
import { salvarAgenda } from "../services/agendaService";
import styles from "./Agenda.module.css";

const AgendaForm: React.FC<{
    persistirProps: PersistirItens<AgendaItens>;
    persistirDropProps: Array<PersistirItens<AgendaItens>>;
    tipoItem?: number;
}> = ({ persistirProps, persistirDropProps, tipoItem }) => {
    const [messageItens, setMessageItens] = useState<MensagemItens>();
    const [isMessage, setMessage] = useState<boolean>(false);
    const [id, setId] = useState<number>(0);
    const [isTodoDia, setTodoDia] = useState<boolean>(false);
    const [idAgendaSemanaInicio, setAgendaSemanaInicio] = useState<number>(0);
    const [tipo, setTipo] = useState<number>();
    const [idAgendaSemanaFim, setAgendaSemanaFim] = useState<number>(0);
    const [agendaAbertaInicio, setAgendaAbertaInicio] = useState<string>("");
    const [agendaAbertaFim, setAgendaAbertaFim] = useState<string>("");
    const [agendaBloqueadaInicio, setAgendaBloqueadaInicio] = useState<string>("");
    const [agendaBloqueadaFim, setAgendaBloqueadaFim] = useState<string>("");
    const [isBloqueadoHoje, setBloquadoHoje] = useState<boolean>(false);
    const [idLoja, setIdLoja] = useState<number>(0);
    const [idColaborador, setColaboradorId] = useState<number>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLeitura, setIsLeitura] = useState<boolean>(false);
    const [erros, setErros] = useState<ErroItem[]>([]);
    const [erroTrigger, setErroTrigger] = useState(0);
    const { urlParametro } = useParams();
    const parametroNormalizado = (urlParametro ?? "").trim().toLowerCase();
    const tipoAgendaAtual =
        tipoItem
        ?? (parametroNormalizado === "loja" ? Number(TipoLoja) : parametroNormalizado === "colaborador" ? Number(TipoColaborador) : 0);
    const isAgendaColaborador = tipoAgendaAtual.toString() === TipoColaborador;

    const lojaProps = persistirDropProps.find((item) => item.name === "loja")?.selectItems ?? [];
    const colaboradorProps = persistirDropProps.find((item) => item.name === "colaborador")?.selectItems ?? [];
    const semanaProps = persistirDropProps.find((item) => item.name === "semana")?.selectItems ?? [];

    useFormErros(erros, erroTrigger);

    const fetchAgendaPersistir = useCallback(async () => {
        setId(persistirProps?.item?.id ?? 0);
        setTodoDia(persistirProps?.item?.isTodoDia ?? false);
        setAgendaSemanaInicio(persistirProps?.item?.idAgendaSemanaInicio ?? 0);
        setAgendaSemanaFim(persistirProps?.item?.idAgendaSemanaFim ?? 0);
        setAgendaAbertaInicio(persistirProps?.item?.agendaAbertaInicio ?? "");
        setAgendaAbertaFim(persistirProps?.item?.agendaAbertaFim ?? "");
        setAgendaBloqueadaInicio(isAgendaColaborador ? persistirProps?.item?.agendaBloqueadaInicio ?? "" : "");
        setAgendaBloqueadaFim(isAgendaColaborador ? persistirProps?.item?.agendaBloqueadaFim ?? "" : "");
        setBloquadoHoje(isAgendaColaborador
            ? (
                persistirProps?.item?.IsBloqueadoHoje ??
                persistirProps?.item?.isBloqueadoHoje ??
                (persistirProps?.item as AgendaItens & { IsBloquedoHoje?: boolean })?.IsBloquedoHoje ??
                false
            )
            : false);
        setIdLoja(persistirProps?.item?.idLoja ?? 0);
        setTipo(tipoAgendaAtual);
        setColaboradorId(persistirProps?.item?.idColaborador);
        setIsLeitura(persistirProps?.item?.isTodoDia ?? false);
    }, [isAgendaColaborador, persistirProps, tipoAgendaAtual]);

    updatePersistirPrev(fetchAgendaPersistir, undefined, persistirProps.item);

    const limparItens = () => {
        setIsLoading(false);
        setId(0);
        setTodoDia(false);
        setAgendaSemanaInicio(0);
        setAgendaSemanaFim(0);
        setAgendaAbertaInicio("");
        setAgendaAbertaFim("");
        setAgendaBloqueadaInicio("");
        setAgendaBloqueadaFim("");
        setBloquadoHoje(false);
        setIdLoja(0);
        setColaboradorId(0);
        setTipo(tipoAgendaAtual);
    };

    const enviarSatusMessage = () => {
        setMessage(true);
        setTimeout(() => {
            setMessage(false);
        }, 6000);
    };

    const handleCloseMessage = () => {
        setMessage(false);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);

        const agenda: AgendaItens = {
            id: id || 0,
            isTodoDia,
            idAgendaSemanaInicio,
            idAgendaSemanaFim,
            agendaAbertaInicio: formatarHoraComData(agendaAbertaInicio),
            agendaAbertaFim: formatarHoraComData(agendaAbertaFim),
            idLoja,
            idColaborador,
            tipo: tipoAgendaAtual || tipo,
            ...(isAgendaColaborador
                ? {
                    agendaBloqueadaInicio: formatarHoraComData(agendaBloqueadaInicio),
                    agendaBloqueadaFim: formatarHoraComData(agendaBloqueadaFim),
                    IsBloqueadoHoje: isBloqueadoHoje,
                }
                : {}),
        };

        const agendaResponse = await salvarAgenda(agenda);
        if (!agendaResponse?.notifications || agendaResponse?.notifications?.length === 0) {
            const messageRetorno = await RetornarMessageService(true, true, []);
            setMessageItens(messageRetorno);
            persistirDropProps.forEach((item) => {
                item.onSave?.();
                item.isSave = true;
            });
            limparItens();
            enviarSatusMessage();
            window.setTimeout(() => {
                persistirProps.onSave?.();
            }, 3000);
        } else {
            const errosConvertidos: ErroItem[] = mapNotificationErrors(agendaResponse?.notifications);
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

    const handleDropdownChange = (e: SelectChangeEvent<string>, tipoDropdown: string) => {
        if (tipoDropdown === "loja") {
            setIdLoja(Number(e.target.value));
        }
        if (tipoDropdown === "colaborador") {
            setColaboradorId(Number(e.target.value));
        }
        if (tipoDropdown === "semanaInicio") {
            setAgendaSemanaInicio(Number(e.target.value));
        }
        if (tipoDropdown === "semanaFim") {
            setAgendaSemanaFim(Number(e.target.value));
        }
    };

    const handleChange = (tipoChange: string) => {
        if (tipoChange === "todoDia") {
            setAgendaSemanaInicio(0);
            setAgendaSemanaFim(0);
            setTodoDia(!isTodoDia);
            setIsLeitura(!isTodoDia);
        }
        if (tipoChange === "bloquiadoHoje") {
            setBloquadoHoje(!isBloqueadoHoje);
        }
    };

    const switchButton: SwitchButtonItem = {
        label: SwitchTodoDia,
        name: "IsTodoDia",
        erroSession: "IsTodoDia",
        checked: isTodoDia,
        handleChange: () => handleChange("todoDia"),
    };

    const switchButtonBloqueio: SwitchButtonItem = {
        label: SwitchBloqueio,
        name: "IsBloqueadoHoje",
        erroSession: "IsBloqueadoHoje",
        checked: isBloqueadoHoje,
        handleChange: () => handleChange("bloquiadoHoje"),
    };

    const messageProps: MensagemItens = {
        texto: messageItens?.texto,
        cor: messageItens?.cor,
        isVisible: isMessage,
        onClick: handleCloseMessage,
    };

    const botaoProps: BotaoItens = {
        tooltip: "Salvar",
        isLoading,
        icon: FaSave,
        marginLeft: "4px",
        marginRight: "4px",
    };

    return (
        <div className={styles.formPersistir}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h2>Agenda</h2>
                    <p>Gerencie os dados da agenda</p>
                </div>

                <div className={styles.messageText}>
                    <Mensagem mensagemProps={messageProps ?? {}} />
                </div>

                <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown} id="frmAgenda" className={styles.form}>
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
                            {tipoAgendaAtual.toString() === TipoLoja && (
                                <div className={styles.formItens}>
                                    <Dropdown
                                        dropProps={{
                                            name: "IdLoja",
                                            label: "Loja*",
                                            itens: lojaProps ?? [],
                                            selectedId: idLoja?.toString() || "",
                                            onChange: (e: SelectChangeEvent<string>) => handleDropdownChange(e, "loja"),
                                            erroSession: "IdLoja",
                                        }}
                                    />
                                </div>
                            )}
                            {tipoAgendaAtual.toString() === TipoColaborador && (
                                <div className={styles.formItens}>
                                    <Dropdown
                                        dropProps={{
                                            name: "IdColaborador",
                                            label: "Colaborador*",
                                            itens: colaboradorProps,
                                            selectedId: idColaborador || "0",
                                            onChange: (e: SelectChangeEvent<string>) => handleDropdownChange(e, "colaborador"),
                                            erroSession: "IdColaborador",
                                        }}
                                    />
                                </div>
                            )}
                            <div className={styles.switchAgenda}>
                                <SwitchButton switchProps={switchButton} />
                            </div>
                            <div className={styles.formItens}>
                                <Dropdown
                                    dropProps={{
                                        name: "IdAgendaSemanaInicio",
                                        label: "Dia da semana Início*",
                                        itens: semanaProps,
                                        selectedId: idAgendaSemanaInicio || "0",
                                        isLeitura,
                                        onChange: (e: SelectChangeEvent<string>) => handleDropdownChange(e, "semanaInicio"),
                                        erroSession: "IdAgendaSemanaInicio",
                                    }}
                                />
                            </div>
                            <div className={styles.formItens}>
                                <Dropdown
                                    dropProps={{
                                        name: "IdAgendaSemanaFim",
                                        label: "Dia da semana Fim*",
                                        itens: semanaProps,
                                        selectedId: idAgendaSemanaFim || "0",
                                        isLeitura,
                                        onChange: (e: SelectChangeEvent<string>) => handleDropdownChange(e, "semanaFim"),
                                        erroSession: "IdAgendaSemanaFim",
                                    }}
                                />
                            </div>
                        </div>

                        <div className={styles.separador}></div>

                        <div className={`${styles.coluna} ${styles.campos}`}>
                            <div className={styles.pickerGroup}>
                                <div className={styles.formItens}>
                                    <DateTimerPicker
                                        name="AgendaAbertaInicio"
                                        label={DataLabelAgendaAberta}
                                        value={formatarHora(agendaAbertaInicio)}
                                        onChange={setAgendaAbertaInicio}
                                        tipo="datahora"
                                        erroSession="AgendaAbertaInicio"
                                    />
                                </div>
                                <div className={styles.formItens}>
                                    <DateTimerPicker
                                        name="AgendaAbertaFim"
                                        label={DataLabelAgendaFechada}
                                        value={formatarHora(agendaAbertaFim)}
                                        onChange={setAgendaAbertaFim}
                                        tipo="datahora"
                                        erroSession="AgendaAbertaFim"
                                    />
                                </div>
                            </div>

                            {isAgendaColaborador && (
                                <>
                                    <div className={styles.switchAgenda}>
                                        <SwitchButton switchProps={switchButtonBloqueio} />
                                    </div>

                                    <div className={styles.pickerGroup}>
                                        <div className={styles.formItens}>
                                            <DateTimerPicker
                                                name="AgendaBloqueadaInicio"
                                                label={DataLabelBloqueioAberto}
                                                value={formatarHora(agendaBloqueadaInicio)}
                                                onChange={setAgendaBloqueadaInicio}
                                                tipo="hora"
                                                isLeituraOnly={false}
                                                erroSession="AgendaBloqueadaInicio"
                                            />
                                        </div>
                                        <div className={styles.formItens}>
                                            <DateTimerPicker
                                                name="AgendaBloqueadaFim"
                                                label={DataLabelBloqueioFechado}
                                                value={formatarHora(agendaBloqueadaFim)}
                                                onChange={setAgendaBloqueadaFim}
                                                tipo="hora"
                                                isLeituraOnly={false}
                                                erroSession="AgendaBloqueadaFim"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

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
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AgendaForm;
