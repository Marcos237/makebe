import React, { useCallback, useState } from "react";
import { Tooltip } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { FaPlus, FaRegTrashAlt, FaSave } from "react-icons/fa";
import DateTimerPicker from "../../../components/dateTimerPicker";
import BotaoSubmit from "../../../components/submitButton";
import Dropdown from "../../../components/dropdown";
import Mensagem from "../../../components/mensagem";
import CampoTexto from "../../../components/textbox";
import { formatarHora, formatarHoraComData } from "../../../functions/formatDataHora";
import { useFormErros } from "../../../hooks/useFormErros";
import updatePersistirPrev from "../../../hooks/useUpdatePersistirPrev";
import { BotaoItens } from "../../../Interfaces/Botao/botao";
import {
    ColaboradorProfissionalItem,
    ColaboradorProfissionalServicoItem,
} from "../../../Interfaces/ColaboradorProfissional/colaboradorProfissionalItem";
import { MensagemItens } from "../../../Interfaces/Mensagens/MensagemItens";
import { ErroItem } from "../../../Interfaces/shared/erroItem";
import { PersistirItens } from "../../../Interfaces/shared/persistirItens";
import { RetornarMessageService } from "../../../services/shared/retornarMessageService";
import { mapNotificationErrors } from "../../../utils/mapNotificationErrors";
import { salvarColaboradorProfissional } from "../services/colaboradorProfissionalService";
import styles from "./ColaboradorProfissional.module.css";

const MAX_SERVICOS = 10;

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
    const [servicosSelecionados, setServicosSelecionados] = useState<ColaboradorProfissionalServicoItem[]>([
        { idServico: 0, ativo: true },
    ]);
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

        const servicos = item?.servicos?.length
            ? item.servicos.slice(0, MAX_SERVICOS).map((servico) => ({
                id: servico.id ?? 0,
                idColaborador: servico.idColaborador ?? item?.colaboradorId ?? 0,
                idServico: servico.idServico ?? 0,
                ativo: servico.ativo ?? true,
            }))
            : [{ idServico: item?.servicoId ?? 0, idColaborador: item?.colaboradorId ?? 0, ativo: true }];

        setServicosSelecionados(servicos.length > 0 ? servicos : [{ idServico: 0, ativo: true }]);
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
        setServicosSelecionados([{ idServico: 0, ativo: true }]);
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

        const servicos = servicosSelecionados
            .filter((servico) => Number(servico.idServico ?? 0) > 0)
            .map((servico) => ({
                id: servico.id ?? 0,
                idColaborador: colaboradorId ?? 0,
                idServico: Number(servico.idServico ?? 0),
                ativo: servico.ativo ?? true,
            }));

        const colabolador: ColaboradorProfissionalItem = {
            id: id ?? 0,
            usuarioId: usuarioId ?? "",
            colaboradorId: colaboradorId ?? 0,
            lojaId: lojaId ?? 0,
            servicoId: servicosSelecionados[0]?.idServico ?? 0,
            servicos,
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
            const errosConvertidos: ErroItem[] = mapNotificationErrors(colaboradorResponse?.notifications);
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
    };

    const handleServicoChange = (index: number, value: string) => {
        setServicosSelecionados((prev) => prev.map((servico, currentIndex) => (
            currentIndex === index
                ? {
                    ...servico,
                    idServico: Number(value),
                    idColaborador: colaboradorId,
                    ativo: true,
                }
                : servico
        )));
    };

    const handleAdicionarServico = () => {
        setServicosSelecionados((prev) => {
            if (prev.length >= MAX_SERVICOS) return prev;
            return [...prev, { idServico: 0, idColaborador: colaboradorId, ativo: true }];
        });
    };

    const handleRemoverServico = (index: number) => {
        setServicosSelecionados((prev) => {
            if (prev.length <= 1) {
                return [{ ...prev[0], idServico: 0, idColaborador: colaboradorId, ativo: true }];
            }

            const proximaLista = prev.filter((_, currentIndex) => currentIndex !== index);
            return proximaLista.length > 0 ? proximaLista : [{ idServico: 0, idColaborador: colaboradorId, ativo: true }];
        });
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
                    <p>Gerencie os vinculos profissionais</p>
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
                            {servicosSelecionados.map((servico, index) => (
                                <div className={styles.formItens} key={`servico-${index}`}>
                                    <Dropdown
                                        dropProps={{
                                            name: `ServicoId_${index}`,
                                            label: `Servico ${index + 1}*`,
                                            itens: servicoProps,
                                            selectedId: servico.idServico || "0",
                                            onChange: (e: SelectChangeEvent<string>) => handleServicoChange(index, e.target.value),
                                            erroSession: `ServicoId_${index}`,
                                        }}
                                    />
                                    <div className={styles.formActions}>
                                        {index === servicosSelecionados.length - 1 && servicosSelecionados.length < MAX_SERVICOS && (
                                            <Tooltip title="Adicionar servico">
                                                <button onClick={handleAdicionarServico} className={`${styles.actionButton} ${styles.servicoIconButton}`} type="button">
                                                    <FaPlus />
                                                </button>
                                            </Tooltip>
                                        )}
                                        {servicosSelecionados.length > 1 && (
                                            <Tooltip title="Remover servico">
                                                <button onClick={() => handleRemoverServico(index)} className={`${styles.deleteButton} ${styles.servicoIconButton}`} type="button">
                                                    <FaRegTrashAlt />
                                                </button>
                                            </Tooltip>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <div className={styles.formItens}>
                                <CampoTexto
                                    textBoxProps={{
                                        name: "Descricao",
                                        tooltip: "Descricao",
                                        label: "Descricao",
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
