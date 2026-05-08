import React, { useCallback, useState } from "react";
import { Tooltip } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { useParams } from "react-router-dom";
import { FaRegTrashAlt, FaSave } from "react-icons/fa";
import BotaoSubmit from "../../../components/submitButton";
import Dropdown from "../../../components/dropdown";
import Mensagem from "../../../components/mensagem";
import SwitchButton from "../../../components/switchButton";
import CampoTexto from "../../../components/textbox";
import Upload from "../../../components/upload";
import { TipoCliente } from "../../../constants/Colaborador/colaboradorConstant";
import { useFormErros } from "../../../hooks/useFormErros";
import updatePersistirPrev from "../../../hooks/useUpdatePersistirPrev";
import { BotaoItens } from "../../../Interfaces/Botao/botao";
import { ColaboradorItens } from "../../../Interfaces/Colaborador/colaboradorItem";
import { MensagemItens } from "../../../Interfaces/Mensagens/MensagemItens";
import { ErroItem } from "../../../Interfaces/shared/erroItem";
import { PersistirItens } from "../../../Interfaces/shared/persistirItens";
import { SwitchButtonItem } from "../../../Interfaces/shared/switchButtonItem";
import { UploadItens } from "../../../Interfaces/TextBox/UploadItens";
import { RetornarMessageService } from "../../../services/shared/retornarMessageService";
import { cpfMaskConst, foneMaskConst } from "../../../utils/mascaras";
import { salvarColaborador } from "../services/colaboradorService";
import styles from "./Colaborador.module.css";

const ColaboradorForm: React.FC<{
    persistirProps: PersistirItens<ColaboradorItens>;
    readOnly: boolean;
    tipoItem?: number;
}> = ({ persistirProps, readOnly, tipoItem }) => {
    const [messageItens, setMessageItens] = useState<MensagemItens>();
    const [isMessage, setMessage] = useState<boolean>(false);
    const [id, setId] = useState<string>("");
    const [usuarioId, setUsuarioId] = useState<string>("");
    const [permissaoId, setPermissaoId] = useState<string>("");
    const [nome, setNome] = useState<string>("");
    const [instagran, setInstagran] = useState<string>("");
    const [cpf, setCpf] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [telefone, setTelefone] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [uploadItem, setUploadItem] = useState<UploadItens>({ uploadProps: { nomeImagem: "", urlImagem: "", id: "1" } });
    const [status, setStatus] = useState<boolean>(false);
    const [readOnlyItem, setReadOnly] = useState<boolean>(false);
    const [tipo, setTipo] = useState<number>();
    const [erros, setErros] = useState<ErroItem[]>([]);
    const [erroTrigger, setErroTrigger] = useState(0);
    const { urlParametro } = useParams();
    const usuario = urlParametro === "CadastroCliente" ? "Cliente" : urlParametro === "CadastroColaborador" ? "Colaborador" : "";

    useFormErros(erros, erroTrigger);

    const fetchColaboradorData = useCallback(async () => {
        setId(persistirProps.item?.id || "");
        setUsuarioId(persistirProps.item?.usuarioId || "");
        setNome(persistirProps.item?.nome || "");
        setCpf(persistirProps.item?.cpf || "");
        setEmail(persistirProps.item?.email || "");
        setTelefone(persistirProps.item?.telefone || "");
        setUploadItem({
            uploadProps: {
                nomeImagem: persistirProps.item?.nomeImagem,
                urlImagem: persistirProps.item?.urlImagem,
                id: "1",
            },
        });
        setInstagran(persistirProps?.item?.instagram ?? "");
        setPermissaoId(persistirProps.item?.permissaoId || "");
        setStatus(persistirProps.item?.status || false);
        setReadOnly(readOnly);
        setTipo(tipoItem);
    }, [persistirProps, readOnly, tipoItem]);

    updatePersistirPrev(fetchColaboradorData, undefined, persistirProps.item);

    const limparItens = () => {
        setIsLoading(false);
        setId("");
        setUsuarioId("");
        setNome("");
        setCpf("");
        setEmail("");
        setTelefone("");
        setInstagran("");
        setUploadItem({ uploadProps: { id: "1" } });
        setPermissaoId("");
        setStatus(false);
        setReadOnly(false);
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

        const colabolador: ColaboradorItens = {
            id: id || "0",
            usuarioId: usuarioId || "",
            nome: nome || "",
            cpf: cpf || "",
            email: email || "",
            telefone: telefone || "",
            instagram: instagran || "",
            urlImagem: uploadItem.uploadProps.urlImagem,
            nomeImagem: uploadItem.uploadProps.nomeImagem,
            permissaoId: permissaoId || "",
            status: status || false,
            tipo: Number(tipoItem) ?? tipo,
        };

        const colaboradorResponse = await salvarColaborador(colabolador);
        if (!colaboradorResponse?.notifications || colaboradorResponse?.notifications?.length === 0) {
            const messageRetorno = await RetornarMessageService(true, true, []);
            setMessageItens(messageRetorno);
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

    const handleImageUpload = (base64String: string, fileName: string) => {
        setUploadItem({
            uploadProps: {
                nomeImagem: fileName,
                urlImagem: base64String,
                id: "1",
            },
        });
    };

    const handleDropdownChange = (e: SelectChangeEvent<string>, tipoDropdown: string) => {
        if (tipoDropdown === "permissao") {
            setPermissaoId(e.target.value);
        }
    };

    const switchButton: SwitchButtonItem = {
        label: "Status : ",
        checked: status,
        handleChange: () => setStatus(!status),
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
                    <h2>{usuario}</h2>
                    <p>Gerencie os dados do {usuario.toLowerCase()}</p>
                </div>

                <div className={styles.messageText}>
                    <Mensagem mensagemProps={messageProps ?? {}} />
                </div>

                <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown} id="frmColaborador" className={styles.form}>
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
                                <Upload uploadProps={uploadItem.uploadProps} onUpload={handleImageUpload} />
                            </div>
                            <div className={styles.formItens}>
                                <CampoTexto
                                    textBoxProps={{
                                        name: "Nome",
                                        tooltip: "digite o nome",
                                        label: "Nome*",
                                        value: nome,
                                        type: "text",
                                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setNome(e.target.value),
                                        erroSession: "Nome",
                                    }}
                                />
                            </div>
                            <div className={styles.formItens}>
                                <CampoTexto
                                    textBoxProps={{
                                        name: "Cpf",
                                        tooltip: "digite o CPF",
                                        label: "CPF*",
                                        value: cpf,
                                        type: "text",
                                        mask: cpfMaskConst,
                                        readonly: readOnlyItem,
                                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCpf(e.target.value),
                                        erroSession: "CPF",
                                    }}
                                />
                            </div>
                            <div className={styles.formItens}>
                                <CampoTexto
                                    textBoxProps={{
                                        name: "Telefone",
                                        tooltip: "digite o Telefone",
                                        label: "Telefone*",
                                        value: telefone,
                                        type: "text",
                                        mask: foneMaskConst(telefone),
                                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setTelefone(e.target.value),
                                        erroSession: "Telefone",
                                    }}
                                />
                            </div>
                            <div className={styles.formItens}>
                                <CampoTexto
                                    textBoxProps={{
                                        name: "Email",
                                        tooltip: "digite o Email",
                                        label: "Email*",
                                        value: email,
                                        type: "text",
                                        readonly: readOnlyItem,
                                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
                                        erroSession: "Email",
                                    }}
                                />
                            </div>
                        </div>

                        <div className={styles.separador}></div>

                        <div className={`${styles.coluna} ${styles.campos}`}>
                            {tipoItem?.toString() !== TipoCliente && (
                                <div className={styles.formItens}>
                                    <Dropdown
                                        dropProps={{
                                            name: "PermissaoId",
                                            label: "Permissão*",
                                            itens: persistirProps.selectItems ?? [],
                                            selectedId: permissaoId || "",
                                            onChange: (e: SelectChangeEvent<string>) => handleDropdownChange(e, "permissao"),
                                            erroSession: "PermissaoId",
                                        }}
                                    />
                                </div>
                            )}
                            <div className={styles.formItens}>
                                <CampoTexto
                                    textBoxProps={{
                                        name: "Instagram",
                                        tooltip: "digite o Instagram",
                                        label: "Instagram",
                                        value: instagran,
                                        type: "text",
                                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setInstagran(e.target.value),
                                    }}
                                />
                            </div>
                            {tipoItem?.toString() !== TipoCliente && (
                                <div className={styles.switchWrapper}>
                                    <SwitchButton switchProps={switchButton} />
                                </div>
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
                                onChange: (e: React.ChangeEvent<HTMLInputElement>) => setId(e.target.value),
                            }}
                        />
                        <CampoTexto
                            textBoxProps={{
                                name: "usuarioId",
                                value: usuarioId,
                                type: "hidden",
                                onChange: (e: React.ChangeEvent<HTMLInputElement>) => setUsuarioId(e.target.value),
                            }}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ColaboradorForm;
