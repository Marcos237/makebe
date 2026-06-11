import React, { useCallback, useState } from "react";
import { Tooltip } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { FaRegTrashAlt, FaSave } from "react-icons/fa";
import DateTimerPicker from "../../../components/dateTimerPicker";
import BotaoSubmit from "../../../components/submitButton";
import Dropdown from "../../../components/dropdown";
import Mensagem from "../../../components/mensagem";
import CampoTexto from "../../../components/textbox";
import { formatarHora, formatarHoraComData } from "../../../functions/formatDataHora";
import { useFormErros } from "../../../hooks/useFormErros";
import updatePersistirPrev from "../../../hooks/useUpdatePersistirPrev";
import { BotaoItens } from "../../../Interfaces/Botao/botao";
import { ColaboradorProfissionalItem } from "../../../Interfaces/ColaboradorProfissional/colaboradorProfissionalItem";
import { MensagemItens } from "../../../Interfaces/Mensagens/MensagemItens";
import { ErroItem } from "../../../Interfaces/shared/erroItem";
import { PersistirItens } from "../../../Interfaces/shared/persistirItens";
import { RetornarMessageService } from "../../../services/shared/retornarMessageService";
import { salvarColaboradorProfissional } from "../services/colaboradorProfissionalService";
import styles from "./ColaboradorProfissional.module.css";

const ColaboradorProfissionalForm: React.FC<{
    persistirProps: PersistirItens<ColaboradorProfissionalItem>;
    persistirDropProps: Array<PersistirItens<ColaboradorProfissionalItem>>;
}> = ({ persistirProps, persistirDropProps }) => {
    const [messageItens, setMessageItens] = useState<MensagemItens>();
    const [isMessage, setMessage] = useState<boolean>(false);
    const [id, setId] = useState<number>(0);
    const [usuarioId, setUsuarioId] = useState<string>("");
    const [colaboradorId, setColaboradorId] = useState<number>(0);
    const [lojaId, setLojaId] = useState<number>(0);
    const [servicoId, setServicoId] = useState<number>(0);
    const [descricao, setDescricao] = useState<string>("");
    const [periodoInativoInicio, setPeriodoInativoInicio] = useState<string>("");
    const [periodoInativoFim, setPeriodoInativoFim] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [erros, setErros] = useState<ErroItem[]>([]);
    const [erroTrigger, setErroTrigger] = useState(0);

    const colaboradorProps = persistirDropProps.find((item) => item.name === "colaborador")?.selectItems ?? [];
    const lojaProps = persistirDropProps.find((item) => item.name === "loja")?.selectItems ?? [];
    const servicoProps = persistirDropProps.find((item) => item.name === "servico")?.selectItems ?? [];

    useFormErros(erros, erroTrigger);

    const fetchColaboradorProfissionalData = useCallback(async () => {
        const item = persistirProps.item;
        setId(item?.id || 0);
        setUsuarioId(item?.usuarioId || "");
        setColaboradorId(item?.colaboradorId ?? 0);
        setLojaId(item?.lojaId ?? 0);
        setServicoId(item?.servicoId ?? 0);
        setDescricao(item?.descricao ?? "");
        setPeriodoInativoInicio(
            item?.PeriodoInativoInicioExtenso ??
            (item as ColaboradorProfissionalItem & { periodoInativoInicioExtenso?: string })?.periodoInativoInicioExtenso ??
            "",
        );
        setPeriodoInativoFim(
            item?.PeriodoInativoFimExtenso ??
            (item as ColaboradorProfissionalItem & { periodoInativoFimExtenso?: string })?.periodoInativoFimExtenso ??
            "",
        );
    }, [persistirProps]);

    updatePersistirPrev(fetchColaboradorProfissionalData, undefined, persistirProps.item);

    const limparItens = () => {
        setIsLoading(false);
        setId(0);
        setColaboradorId(0);
        setLojaId(0);
        setServicoId(0);
        setDescricao("");
        setPeriodoInativoInicio("");
        setPeriodoInativoFim("");
    };

    const enviarSatusMessage = () => {
        setMessage(true);
        setTimeout(() => {
            setMessage(false);
        }, 6000);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        const colabolador: ColaboradorProfissionalItem = {
            id: id ?? 0,
            usuarioId: usuarioId ?? "",
            colaboradorId: colaboradorId ?? 0,
            lojaId: lojaId ?? 0,
            servicoId: servicoId ?? 0,
            descricao: descricao ?? "",
            PeriodoInativoInicioExtenso: formatarHoraComData(periodoInativoInicio) ?? undefined,
            PeriodoInativoFimExtenso: formatarHoraComData(periodoInativoFim) ?? undefined,
        };

        const colaboradorResponse = await salvarColaboradorProfissional(colabolador);
        if (!colaboradorResponse?.notifications || colaboradorResponse?.notifications?.length === 0) {
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
            const errosConvertidos: ErroItem[] = colaboradorResponse?.notifications?.map((n) => ({
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
        if (tipo === "colaborador") {
            setColaboradorId(Number(e.target.value));
        }
        if (tipo === "loja") {
            setLojaId(Number(e.target.value));
        }
        if (tipo === "servico") {
            setServicoId(Number(e.target.value));
        }
    };

    const botaoProps: BotaoItens = {
        tooltip: "Salvar",
        isLoading,
        icon: FaSave,
        marginLeft: "4px",
        marginRight: "4px",
    };

    const messageProps: MensagemItens = {
        texto: messageItens?.texto,
        cor: messageItens?.cor,
        isVisible: isMessage,
        onClick: () => setMessage(false),
    };

    return (
        <div className={styles.formPersistir}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h2>Profissional</h2>
                    <p>Gerencie os vínculos profissionais</p>
                </div>

                <div className={styles.messageText}>
                    <Mensagem mensagemProps={messageProps ?? {}} />
                </div>

                <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown} id="frmColaboradorProfissional" className={styles.form}>
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
                            <div className={styles.formItens}>
                                <Dropdown
                                    dropProps={{
                                        name: "ColaboradorId",
                                        label: "Colaborador*",
                                        itens: colaboradorProps,
                                        selectedId: colaboradorId || "0",
                                        onChange: (e: SelectChangeEvent<string>) => handleDropdownChange(e, "colaborador"),
                                        erroSession: "ColaboradorId",
                                    }}
                                />
                            </div>
                            <div className={styles.formItens}>
                                <Dropdown
                                    dropProps={{
                                        name: "LojaId",
                                        label: "Loja*",
                                        itens: lojaProps,
                                        selectedId: lojaId || "0",
                                        onChange: (e: SelectChangeEvent<string>) => handleDropdownChange(e, "loja"),
                                        erroSession: "LojaId",
                                    }}
                                />
                            </div>
                        </div>

                        <div className={styles.separador}></div>

                        <div className={`${styles.coluna} ${styles.campos}`}>
                            <div className={styles.formItens}>
                                <Dropdown
                                    dropProps={{
                                        name: "ServicoId",
                                        label: "Serviço*",
                                        itens: servicoProps,
                                        selectedId: servicoId || "0",
                                        onChange: (e: SelectChangeEvent<string>) => handleDropdownChange(e, "servico"),
                                        erroSession: "ServicoId",
                                    }}
                                />
                            </div>
                            <div className={styles.formItens}>
                                <CampoTexto
                                    textBoxProps={{
                                        name: "Descricao",
                                        tooltip: "Descrição",
                                        label: "Descrição",
                                        value: descricao,
                                        type: "text",
                                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setDescricao(e.target.value),
                                        erroSession: "Descricao",
                                    }}
                                />
                            </div>
                            <div className={styles.periodoInativoSection}>
                                <div className={styles.periodoInativoLegenda}>Periodo Inativo</div>
                                <div className={styles.pickerSplit}>
                                    <DateTimerPicker
                                        name="PeriodoInativoInicio"
                                        label="Periodo Inicio"
                                        value={formatarHora(periodoInativoInicio)}
                                        onChange={setPeriodoInativoInicio}
                                        tipo="hora"
                                        erroSession="PeriodoInativoInicio"
                                    />
                                    <DateTimerPicker
                                        name="PeriodoInativoFim"
                                        label="Periodo Fim"
                                        value={formatarHora(periodoInativoFim)}
                                        onChange={setPeriodoInativoFim}
                                        tipo="hora"
                                        erroSession="PeriodoInativoFim"
                                    />
                                </div>
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
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ColaboradorProfissionalForm;
