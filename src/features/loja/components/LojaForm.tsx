import React, { useCallback, useState } from "react";
import { Tooltip } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { FaRegTrashAlt, FaSave } from "react-icons/fa";
import BotaoSubmit from "../../../components/submitButton";
import Dropdown from "../../../components/dropdown";
import Mensagem from "../../../components/mensagem";
import CampoTexto from "../../../components/textbox";
import updatePersistirPrev from "../../../hooks/useUpdatePersistirPrev";
import { useFormErros } from "../../../hooks/useFormErros";
import { BotaoItens } from "../../../Interfaces/Botao/botao";
import { LojaItens } from "../../../Interfaces/Loja/lojaItens";
import { MensagemItens } from "../../../Interfaces/Mensagens/MensagemItens";
import { ErroItem } from "../../../Interfaces/shared/erroItem";
import { PersistirItens } from "../../../Interfaces/shared/persistirItens";
import { RetornarMessageService } from "../../../services/shared/retornarMessageService";
import { cnpjMaskConst, foneMaskConst } from "../../../utils/mascaras";
import { salvarLoja } from "../services/lojaService";
import styles from "./Loja.module.css";

const LojaForm: React.FC<{ persistirProps: PersistirItens<LojaItens> }> = ({ persistirProps }) => {
    const [isMessage, setMessage] = useState<boolean>(false);
    const [messageItens, setMessageItens] = useState<MensagemItens>();
    const [id, setId] = useState<number>();
    const [tipoLojaId, setTipoLojaId] = useState<number>();
    const [razaoSocial, setRazaoSocial] = useState<string>("");
    const [cnpj, setCnpj] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [telefone, setTelefone] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [erros, setErros] = useState<ErroItem[]>([]);
    const [erroTrigger, setErroTrigger] = useState(0);

    useFormErros(erros, erroTrigger);

    const fetchLojaData = useCallback(async () => {
        if (!persistirProps.item) return;
        setId(persistirProps.item.id ?? 0);
        setTipoLojaId(persistirProps.item.tipoLojaId ?? 0);
        setRazaoSocial(persistirProps.item.razaoSocial ?? "");
        setCnpj(persistirProps.item.cnpj ?? "");
        setEmail(persistirProps.item.email ?? "");
        setTelefone(persistirProps.item.telefone ?? "");
    }, [persistirProps]);

    updatePersistirPrev(fetchLojaData, undefined, persistirProps.item);

    const limparItens = () => {
        setIsLoading(false);
        setId(0);
        setCnpj("");
        setRazaoSocial("");
        setEmail("");
        setTelefone("");
        setTipoLojaId(0);
    };

    const enviarSatusMessage = () => {
        setMessage(true);
        setTimeout(() => setMessage(false), 6000);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        const loja: LojaItens = {
            id: id || 0,
            razaoSocial: razaoSocial || "",
            cnpj: cnpj || "",
            telefone: telefone || "",
            email: email || "",
            tipoLojaId: Number(tipoLojaId) || 0,
        };
        const retorno = await salvarLoja(loja);
        if (!retorno?.notifications || retorno?.notifications?.length === 0) {
            const messageRetorno = await RetornarMessageService(true, true, []);
            setMessageItens(messageRetorno);
            limparItens();
            enviarSatusMessage();
            window.setTimeout(() => {
                persistirProps.onSave?.();
            }, 2000);
        } else {
            const errosConvertidos: ErroItem[] = retorno?.notifications?.map((n) => ({
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
        if (event.key === "Enter") handleSubmit(event);
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
                    <h2>Loja</h2>
                    <p>Gerencie os dados da loja</p>
                </div>

                <div className={styles.messageText}>
                    <Mensagem mensagemProps={messageProps ?? {}} />
                </div>

                <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown} id="frmLoja" className={styles.form}>
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
                                <CampoTexto textBoxProps={{ name: "RazaoSocial", tooltip: "digite a razão social", label: "razão social*", value: razaoSocial, type: "text", maxLength: 250, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setRazaoSocial(e.target.value), erroSession: "RazaoSocial" }} />
                            </div>
                            <div className={styles.formItens}>
                                <CampoTexto textBoxProps={{ name: "CNPJ", tooltip: "digite seu cnpj", label: "cnpj*", value: cnpj, type: "text", mask: cnpjMaskConst, readonly: false, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCnpj(e.target.value), erroSession: "CNPJ" }} />
                            </div>
                            <div className={styles.formItens}>
                                <CampoTexto textBoxProps={{ name: "Telefone", tooltip: "digite seu telefone", label: "telefone*", value: telefone, mask: foneMaskConst(telefone), type: "text", onChange: (e: React.ChangeEvent<HTMLInputElement>) => setTelefone(e.target.value), erroSession: "Telefone" }} />
                            </div>
                        </div>

                        <div className={styles.separador}></div>

                        <div className={`${styles.coluna} ${styles.campos}`}>
                            <div className={styles.formItens}>
                                <CampoTexto textBoxProps={{ name: "Email", tooltip: "digite seu e-mail", label: "email*", value: email, type: "text", onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value), erroSession: "Email" }} />
                            </div>
                            <div className={styles.formItens}>
                                <Dropdown dropProps={{ name: "TipoLoja", itens: persistirProps.selectItems, label: "Tipo de Loja*", selectedId: tipoLojaId?.toString() || "", onChange: (e: SelectChangeEvent<string>) => setTipoLojaId(Number(e.target.value)), erroSession: "TipoLoja" }} />
                            </div>
                            <div className={styles.botaoArea}>
                                <BotaoSubmit botaoProps={botaoProps} />
                            </div>
                        </div>
                    </div>

                    <div className={styles.hiddenFields}>
                        <CampoTexto textBoxProps={{ name: "id", value: id?.toString(), type: "hidden", onChange: (e: React.ChangeEvent<HTMLInputElement>) => setId(Number(e.target.value)) }} />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LojaForm;
