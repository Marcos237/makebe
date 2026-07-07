import React, { useCallback, useEffect, useState } from "react";
import { Tooltip } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { FaRegTrashAlt, FaSave } from "react-icons/fa";
import { useParams } from "react-router-dom";
import BotaoSubmit from "../../../components/submitButton";
import Dropdown from "../../../components/dropdown";
import Mensagem from "../../../components/mensagem";
import CampoTexto from "../../../components/textbox";
import { TipoUsuarioColaboradorId, TipoUsuarioLojaId } from "../../../constants/Usuario/usuarioConstant";
import { useFormErros } from "../../../hooks/useFormErros";
import updatePersistirPrev from "../../../hooks/useUpdatePersistirPrev";
import { BotaoItens } from "../../../Interfaces/Botao/botao";
import { EnderecoItens } from "../../../Interfaces/Endereco/enderecoItens";
import { MensagemItens } from "../../../Interfaces/Mensagens/MensagemItens";
import { ErroItem } from "../../../Interfaces/shared/erroItem";
import { PersistirItens } from "../../../Interfaces/shared/persistirItens";
import { RetornarMessageService } from "../../../services/shared/retornarMessageService";
import { mapNotificationErrors } from "../../../utils/mapNotificationErrors";
import { buscarDadosCorreiosEndereco, salvarEndereco } from "../services/enderecoService";
import styles from "./Endereco.module.css";

const EnderecoForm: React.FC<{
    persistirProps: PersistirItens<EnderecoItens>;
    persistirDropProps: Array<PersistirItens<EnderecoItens>>;
    tipoUsuario?: string;
    clearTrigger?: number;
}> = ({ persistirProps, persistirDropProps, tipoUsuario, clearTrigger }) => {
    const [isMessage, setMessage] = useState<boolean>(false);
    const [messageItens, setMessageItens] = useState<MensagemItens>();
    const [lojaId, setLojaId] = useState<number>();
    const [id, setId] = useState<number>();
    const [numero, setNumero] = useState<number>();
    const [cep, setCep] = useState<string>("");
    const [logradouro, setLogradouro] = useState<string>("");
    const [complemento, setComplemento] = useState<string>("");
    const [estado, setEstado] = useState<string>("");
    const [cidade, setCidade] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {urlParametro } = useParams();
    const [colaboradorEnderecoId, setColaboradorEnderecoId] = useState<number>();
    const [colaboradorId, setColaboradorId] = useState<number>();
    const [lojaEnderecoId, setLojaEnderecoId] = useState<number>();
    const [erros, setErros] = useState<ErroItem[]>([]);
    const [erroTrigger, setErroTrigger] = useState(0);

    const tipoUsuarioId =
        persistirProps.item?.tipoUsuarioId
        ?? (urlParametro === "Loja" ? Number(TipoUsuarioLojaId) : urlParametro === "Colaborador" ? Number(TipoUsuarioColaboradorId) : 0);

    const colaboradorProps = persistirDropProps.find((item) => item.name === "colaborador")?.selectItems ?? [];
    const lojaProps = persistirDropProps.find((item) => item.name === "loja")?.selectItems ?? [];

    useFormErros(erros, erroTrigger);

    const handleDropdownChange = (e: SelectChangeEvent<string>, tipo: string) => {
        if (tipo === "colaborador") {
            setColaboradorId(Number(e.target.value));
        }
        if (tipo === "loja") {
            setLojaId(Number(e.target.value));
        }
    };

    const limparItens = useCallback(() => {
        setId(0);
        setCep("");
        setLojaId(0);
        setNumero(0);
        setLogradouro("");
        setCidade("");
        setEstado("");
        setComplemento("");
        if (tipoUsuario === TipoUsuarioLojaId) {
            setLojaId(0);
            setLojaEnderecoId(0);
        }
        if (tipoUsuario === TipoUsuarioColaboradorId) {
            setColaboradorId(0);
            setColaboradorEnderecoId(0);
        }
    }, [tipoUsuario]);

    const fetchEnderecoData = useCallback(async () => {
        setId(persistirProps.item?.id);
        setCep(persistirProps.item?.cep || "");
        setLojaId(persistirProps.item?.lojaId);
        setNumero(persistirProps.item?.numero);
        setLogradouro(persistirProps.item?.logradouro || "");
        setCidade(persistirProps.item?.cidade || "");
        setEstado(persistirProps.item?.estado || "");
        setColaboradorEnderecoId(persistirProps?.item?.colaboradorEnderecoId);
        setLojaEnderecoId(persistirProps?.item?.lojaEnderecoId);
        setColaboradorId(persistirProps?.item?.colaboradorId);
    }, [persistirProps.item]);

    const limparFormulario = useCallback(async () => {
        limparItens();
    }, [limparItens]);

    updatePersistirPrev(fetchEnderecoData, limparFormulario, persistirProps.item);

    useEffect(() => {
        if (tipoUsuario === TipoUsuarioLojaId) {
            setColaboradorId(0);
        }

        if (tipoUsuario === TipoUsuarioColaboradorId) {
            setLojaId(0);
        }
    }, [tipoUsuario]);

    useEffect(() => {
        limparItens();
    }, [clearTrigger, limparItens]);

    const enviarSatusMessage = () => {
        setMessage(true);
        setTimeout(() => {
            setMessage(false);
        }, 6000);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);

        const endereco: EnderecoItens = {
            id: id || 0,
            logradouro: logradouro || "",
            cep: cep || "",
            complemento: complemento || "",
            cidade: cidade || "",
            estado: estado || "",
            numero: numero || 0,
            lojaId: Number(lojaId) || 0,
            colaboradorId: Number(colaboradorId) || 0,
            colaboradorEnderecoId: colaboradorEnderecoId || 0,
            lojaEnderecoId: lojaEnderecoId || 0,
            tipoUsuarioId: tipoUsuarioId,
        };

        const retorno = await salvarEndereco(endereco);
        if (!retorno?.notifications || retorno?.notifications?.length === 0) {
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
            const errosConvertidos: ErroItem[] = mapNotificationErrors(retorno?.notifications);
            setErros(errosConvertidos);
            setErroTrigger((prev) => prev + 1);
            enviarSatusMessage();
        }
        setIsLoading(false);
    };

    const handleCepChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const newCep = event.target.value.replace(/\D/g, "");
        setCep(newCep);
        if (newCep.length === 8) {
            const dadosEndereco = await buscarDadosCorreiosEndereco(newCep);
            setLogradouro(dadosEndereco?.logradouro ?? "");
            setEstado(dadosEndereco?.estado ?? "");
            setCidade(dadosEndereco?.cidade ?? "");
        } else {
            setLogradouro("");
            setEstado("");
            setCidade("");
        }
    }, []);

    const handleFormKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
        if (event.key === "Enter") {
            handleSubmit(event);
        }
    };

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
    };

    return (
        <div className={styles.formPersistir}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h2>Endereço</h2>
                    <p>Gerencie os dados do endereço</p>
                </div>

                <div className={styles.messageText}>
                    <Mensagem mensagemProps={messageProps ?? {}} />
                </div>

                <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown} id="frmEndereco" className={styles.form}>
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
                            {tipoUsuario?.toString() === TipoUsuarioLojaId && (
                                <div className={styles.formItens}>
                                    <Dropdown
                                        dropProps={{
                                            name: "LojaColaborador",
                                            label: "Loja*",
                                            itens: lojaProps ?? [],
                                            selectedId: lojaId?.toString() || "",
                                            onChange: (e: SelectChangeEvent<string>) => handleDropdownChange(e, "loja"),
                                            erroSession: "LojaColaborador",
                                        }}
                                    />
                                </div>
                            )}
                            {tipoUsuario?.toString() === TipoUsuarioColaboradorId && (
                                <div className={styles.formItens}>
                                    <Dropdown
                                        dropProps={{
                                            name: "LojaColaborador",
                                            label: "Colaborador*",
                                            itens: colaboradorProps,
                                            selectedId: colaboradorId || "0",
                                            onChange: (e: SelectChangeEvent<string>) => handleDropdownChange(e, "colaborador"),
                                            erroSession: "LojaColaborador",
                                        }}
                                    />
                                </div>
                            )}
                            <div className={styles.formItens}>
                                <CampoTexto
                                    textBoxProps={{
                                        name: "CEP",
                                        value: cep,
                                        tooltip: "digite seu cep",
                                        label: "cep*",
                                        type: "text",
                                        readonly: false,
                                        onChange: handleCepChange,
                                        erroSession: "CEP",
                                    }}
                                />
                            </div>
                            <div className={styles.formItens}>
                                <CampoTexto
                                    textBoxProps={{
                                        name: "Logradouro",
                                        value: logradouro,
                                        tooltip: "digite seu Logradouro",
                                        label: "Logradouro*",
                                        type: "text",
                                        readonly: false,
                                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setLogradouro(e.target.value),
                                        erroSession: "Logradouro",
                                    }}
                                />
                            </div>
                            <div className={styles.formItens}>
                                <CampoTexto
                                    textBoxProps={{
                                        name: "numero",
                                        value: numero?.toString(),
                                        tooltip: "digite seu nÃºmero",
                                        label: "Número",
                                        type: "text",
                                        readonly: false,
                                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setNumero(Number(e.target.value)),
                                    }}
                                />
                            </div>
                        </div>

                        <div className={styles.separador}></div>

                        <div className={`${styles.coluna} ${styles.campos}`}>
                            <div className={styles.formItens}>
                                <CampoTexto
                                    textBoxProps={{
                                        name: "Complemento",
                                        value: complemento,
                                        tooltip: "digite seu complemento",
                                        label: "complemento",
                                        type: "text",
                                        readonly: false,
                                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setComplemento(e.target.value),
                                    }}
                                />
                            </div>
                            <div className={styles.formItens}>
                                <CampoTexto
                                    textBoxProps={{
                                        name: "Estado",
                                        value: estado,
                                        tooltip: "digite seu Estado",
                                        label: "Estado*",
                                        type: "text",
                                        readonly: false,
                                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEstado(e.target.value),
                                        erroSession: "Estado",
                                    }}
                                />
                            </div>
                            <div className={styles.formItens}>
                                <CampoTexto
                                    textBoxProps={{
                                        name: "Cidade",
                                        value: cidade,
                                        tooltip: "digite sua Cidade",
                                        label: "Cidade*",
                                        type: "text",
                                        readonly: false,
                                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCidade(e.target.value),
                                        erroSession: "Cidade",
                                    }}
                                />
                            </div>
                            <div className={styles.botaoArea}>
                                <div className={styles.botaoSalvar}>
                                    <BotaoSubmit botaoProps={botaoProps} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.hiddenFields}>
                        <CampoTexto textBoxProps={{ name: "id", value: id?.toString(), type: "hidden", onChange: (e: React.ChangeEvent<HTMLInputElement>) => setId(Number(e.target.value)) }} />
                        <CampoTexto textBoxProps={{ name: "colaboradorId", value: colaboradorId?.toString(), type: "hidden", onChange: (e: React.ChangeEvent<HTMLInputElement>) => setColaboradorId(Number(e.target.value)) }} />
                        <CampoTexto textBoxProps={{ name: "lojaEnderecoId", value: lojaEnderecoId?.toString(), type: "hidden", onChange: (e: React.ChangeEvent<HTMLInputElement>) => setLojaEnderecoId(Number(e.target.value)) }} />
                        <CampoTexto textBoxProps={{ name: "colaboradorEnderecoId", value: colaboradorEnderecoId?.toString(), type: "hidden", onChange: (e: React.ChangeEvent<HTMLInputElement>) => setColaboradorEnderecoId(Number(e.target.value)) }} />
                        <CampoTexto textBoxProps={{ name: "TipoUsuarioId", value: tipoUsuarioId.toString(), type: "hidden", onChange: () => undefined }} />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EnderecoForm;
