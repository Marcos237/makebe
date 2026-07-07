import React, { useState, useCallback, useMemo } from "react";
import { PersistirItens } from "../../../Interfaces/shared/persistirItens";
import { PortifolioItem } from "../../../Interfaces/Portifolio/portifolioItem";
import { UploadItens } from "../../../Interfaces/TextBox/UploadItens";
import { EditorTextoItem } from "../../../Interfaces/shared/editorTextoItem";
import { Editor, EditorPlaceHolder, UrlPortifolio, UrlTipoPortifolioImagem } from "../../../constants/Portifolio/PortifolioConstant";
import { FaSave, FaRegTrashAlt } from "react-icons/fa";
import { TipoUsuarioLojaId, TipoUsuarioColaboradorId } from "../../../constants/Usuario/usuarioConstant";
import { SelectChangeEvent } from "@mui/material/Select";
import { MensagemItens } from "../../../Interfaces/Mensagens/MensagemItens";
import { BotaoItens } from "../../../Interfaces/Botao/botao";
import { PortifolioImagemItem } from "../../../Interfaces/Portifolio/portifolioImagemItem";
import { PostService } from "../../../services/shared/postService";
import { RetornarMessageService } from "../../../services/shared/retornarMessageService";
import { API_BASE_AGENDA_URL } from "../../../config/apiConfig";
import { TipoPortifolioImagemItem } from "../../../Interfaces/Portifolio/tipoPortifolioImagemItem";
import { ResponseItem } from "../../../Interfaces/shared/ResponseItem";
import { GetByIdService } from "../../../services/shared/getByIdService";
import { Tooltip } from "@mui/material";
import { ErroItem } from "../../../Interfaces/shared/erroItem";
import { useFormErros } from "../../../hooks/useFormErros";
import { useParams } from "react-router-dom";
import BotaoSubmit from "../../../components/submitButton";
import CampoTexto from "../../../components/textbox";
import Upload from "../../../components/upload";
import EditorTexto from "../../../components/ckEditor";
import Dropdown from "../../../components/dropdown";
import Mensagem from "../../../components/mensagem";
import updatePersistirPrev from "../../../hooks/useUpdatePersistirPrev";
import { mapNotificationErrors } from "../../../utils/mapNotificationErrors";
import styles from "./Portifolio.module.css";

const PortifolioPersistir: React.FC<{
    persistirProps: PersistirItens<PortifolioItem>;
    tiposPortifolioImagem: Array<TipoPortifolioImagemItem>;
    persistirDropProps: Array<PersistirItens<PortifolioItem>>;
    tipoUsuario?: string;
}> = ({ persistirProps, tiposPortifolioImagem, persistirDropProps, tipoUsuario }) => {
    const [isMessage, setMessage] = useState<boolean>(false);
    const [idPersitir, setId] = useState<number>(0);
    const [messageItens, setMessageItens] = useState<MensagemItens>({} as MensagemItens);
    const [titulo, setTitulo] = useState<string>("");
    const [subTitulo, setSubTitulo] = useState<string>("");
    const [texto, setTexto] = useState<string>("");
    const [lojaId, setLojaId] = useState<number>(0);
    const [imagens, setImagens] = useState<PortifolioImagemItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [uploadItems, setUploadItems] = useState<Array<UploadItens>>([]);
    const [colaboradorId, setColaboradorId] = useState<number>(0);
    const [colaboradorPortifolioId, setColaboradorPortifolioId] = useState<number>(0);
    const [lojaPortifolioId, setLojaPortifolioId] = useState<number>(0);
    const [TipoUsuarioId, setTipoUsuarioId] = useState<number>(0);
    const { urlParametro } = useParams();
    const colaboradorProps = persistirDropProps.find((item) => item.name === "colaborador")?.selectItems ?? [];
    const lojaProps = persistirDropProps.find((item) => item.name === "loja")?.selectItems ?? [];
    const portifolioImagemItem: PortifolioImagemItem[] = useMemo(() => {
        return persistirProps?.item?.portifolioImagens ?? [];
    }, [persistirProps]);
    const [erros, setErros] = useState<ErroItem[]>([]);
    const [erroTrigger, setErroTrigger] = useState(0);

    const tipoUsuarioAtual =
        persistirProps.item?.tipoUsuarioId
        ?? (tipoUsuario ? Number(tipoUsuario) : undefined)
        ?? (urlParametro === "Loja" ? Number(TipoUsuarioLojaId) : urlParametro === "Colaborador" ? Number(TipoUsuarioColaboradorId) : 0);

    useFormErros(erros, erroTrigger);

    const fetchPortifolioData = useCallback(async () => {
        setId(persistirProps?.item?.id ?? 0);
        setLojaId(persistirProps?.item?.lojaId ?? 0);
        setTitulo(persistirProps?.item?.titulo ?? "");
        setSubTitulo(persistirProps?.item?.subTitulo ?? "");
        setTexto(persistirProps?.item?.texto ?? "");
        setImagens(portifolioImagemItem);
        setColaboradorId(persistirProps?.item?.colaboradorId ?? 0);
        setColaboradorPortifolioId(persistirProps?.item?.colaboradorPortifolioId ?? 0);
        setLojaPortifolioId(persistirProps?.item?.lojaPortifolioId ?? 0);
        setTipoUsuarioId(tipoUsuarioAtual);

        const uploadItemsRetorno: UploadItens[] = [];
        tiposPortifolioImagem.forEach((tipos, index) => {
            const imagemEncontrada = portifolioImagemItem.find((imagem) => imagem.tituloImagem === tipos.descricao);
            const uploadImagem: UploadItens = imagemEncontrada
                ? {
                    uploadProps: {
                        nomeImagem: imagemEncontrada.nomeImagem,
                        urlImagem: imagemEncontrada.urlImagem,
                        tituloImagem: imagemEncontrada.tituloImagem,
                        tituloSessao: tipos?.titulo,
                        id: `Imagem_${(index + 1).toString()}`,
                        name: `Imagem_${(index + 1).toString()}`
                    },
                }
                : {
                    uploadProps: {
                        nomeImagem: "",
                        urlImagem: "",
                        tituloImagem: tipos.descricao,
                        tituloSessao: tipos?.titulo,
                        id: `Imagem_${(index + 1).toString()}`,
                        name: `Imagem_${(index + 1).toString()}`
                    },
                };
            uploadItemsRetorno.push(uploadImagem);
            setUploadItems(uploadItemsRetorno);
        });
    }, [persistirProps, tipoUsuarioAtual, tiposPortifolioImagem, portifolioImagemItem]);

    const limparUpload = async () => {
        const imagem = await GetByIdService(tipoUsuarioAtual, `${API_BASE_AGENDA_URL}${UrlTipoPortifolioImagem}`) as ResponseItem<TipoPortifolioImagemItem>;

        const uploadItemsRetorno: UploadItens[] = [];
        imagem?.datas?.forEach((tipos, index) => {
            const uploadImagem: UploadItens = {
                uploadProps: {
                    nomeImagem: "",
                    urlImagem: "",
                    tituloImagem: tipos.descricao,
                    tituloSessao: tipos?.titulo,
                    id: `Imagem_${(index + 1).toString()}`,
                    errorSession: `Imagem_${(index + 1).toString()}`,
                    name: `Imagem_${(index + 1).toString()}`
                }
            };
            uploadItemsRetorno.push(uploadImagem);
        });
        setUploadItems(uploadItemsRetorno);
    };

    const limparCampos = async () => {
        await limparUpload();
        setId(0);
        setTitulo("");
        setSubTitulo("");
        if (tipoUsuario === TipoUsuarioLojaId) {
            setLojaId(0);
        }
        if (tipoUsuario === TipoUsuarioColaboradorId) {
            setColaboradorId(0);
        }
        setTexto("");
    };

    updatePersistirPrev(fetchPortifolioData, limparCampos, persistirProps.item);

    const addImagemItem = useCallback((uploadsItemAtualizado: UploadItens[]): PortifolioImagemItem[] => {
        const imagensFiltradas: PortifolioImagemItem[] = uploadsItemAtualizado
            .filter((upload) => upload.uploadProps.nomeImagem && upload.uploadProps.nomeImagem.trim() !== "")
            .map((upload) => ({
                lojaPortifolioImagemId: 0,
                lojaPortifolioId: 0,
                id: upload.uploadProps.id,
                nomeImagem: upload.uploadProps.nomeImagem,
                urlImagem: upload.uploadProps.urlImagem || "",
                tituloImagem: upload.uploadProps.tituloImagem || "",
            }));
        setImagens(imagensFiltradas);
        return imagensFiltradas;
    }, []);

    const handleImageUpload = useCallback((base64String: string, fileName: string, tituloImagem?: string, index?: string, tituloSessao?: string) => {
        if (!index) return;
        setUploadItems((prevState) => {
            const updatedItems = [...prevState];
            const position = Number(index.split("_")[1]) - 1;

            if (position >= 0) {
                updatedItems[position] = {
                    uploadProps: {
                        nomeImagem: fileName,
                        urlImagem: base64String,
                        tituloImagem: tituloImagem ?? "",
                        tituloSessao: tituloSessao ?? "",
                        id: index,
                        name: index,
                        errorSession: index,
                    },
                };
            }
            return updatedItems;
        });
    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);

        const imagensAtualizadas = addImagemItem(uploadItems) ?? imagens;
        const portifolio: PortifolioItem = {
            id: idPersitir || 0,
            titulo: titulo || "",
            subTitulo: subTitulo || "",
            texto: texto || "",
            lojaId: lojaId || 0,
            colaboradorId: Number(colaboradorId) || 0,
            colaboradorPortifolioId: colaboradorPortifolioId || 0,
            lojaPortifolioId: lojaPortifolioId || 0,
            portifolioImagens: imagensAtualizadas || [],
            tipoUsuarioId: TipoUsuarioId || tipoUsuarioAtual
        };
        const retorno = await PostService(portifolio, `${API_BASE_AGENDA_URL}${UrlPortifolio}`);
        retornoPost(retorno);
        if (!retorno?.notifications || retorno?.notifications?.length === 0) {
            limparCampos();
            enviarSatusMessage();
            window.setTimeout(() => {
                persistirProps.onSave?.();
            }, 3000);
        } else {
            enviarSatusMessage();
        }
        setIsLoading(false);
    };

    const retornoPost = async (retorno: ResponseItem<PortifolioItem>) => {
        if (!retorno?.notifications || retorno?.notifications?.length === 0) {
            const messageRetorno = await RetornarMessageService(true, true, []);
            setMessageItens(messageRetorno);
            persistirDropProps.forEach(item => {
                item.onSave?.();
                item.isSave = true;
            });

            setIsLoading(false);
        } else {
            const errosConvertidos: ErroItem[] = mapNotificationErrors(retorno?.notifications);
            setErros(errosConvertidos);
            setErroTrigger(prev => prev + 1);
        }
    };

    const handleCloseMessage = () => {
        setMessage(false);
    };

    const handleFormKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
        if (event.key === "Enter") {
            handleSubmit(event);
        }
    };

    const messageProps: MensagemItens = {
        texto: messageItens?.texto,
        cor: messageItens?.cor,
        isVisible: isMessage,
        onClick: handleCloseMessage
    };

    const handleButtonClickLimpar = async () => {
        limparCampos();
    };

    const handleDropdownChange = (e: SelectChangeEvent<string>, tipo: string) => {
        if (tipo === "colaborador") {
            setColaboradorId(Number(e.target.value));
        }
        if (tipo === "loja") {
            setLojaId(Number(e.target.value));
        }
    };

    const editorProps: EditorTextoItem = {
        nome: Editor ?? "",
        value: texto,
        placeholder: EditorPlaceHolder ?? "",
        maxlength: 2000,
        rows: 15,
        altura: 25,
        alturaDefault: 200,
        onChange: (value: string) => setTexto(value)
    };

    const enviarSatusMessage = () => {
        setMessage(true);
        setTimeout(() => {
            setMessage(false);
        }, 6000);
    };

    const botaoProps: BotaoItens = {
        tooltip: "Salvar",
        isLoading: isLoading,
        icon: FaSave,
        marginLeft: "4px",
        marginRight: "4px"
    };

    return (
        <div className={styles.formPersistir}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h2>Portifólio</h2>
                    <p>Gerencie os dados do portifólio</p>
                </div>

                <div className={styles.messageText}>
                    <Mensagem mensagemProps={messageProps ?? {}} />
                </div>

                <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown} id="frmProtifolio" className={styles.form}>
                    <div className={styles.formActions}>
                        <button onClick={handleButtonClickLimpar} className={styles.deleteButton} type="button">
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
                                            erroSession: "LojaColaborador"
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
                                            erroSession: "LojaColaborador"
                                        }}
                                    />
                                </div>
                            )}
                            <div className={styles.formItens}>
                                <CampoTexto
                                    textBoxProps={{
                                        name: "Titulo",
                                        value: titulo,
                                        tooltip: "digite seu título",
                                        label: "tí­tulo",
                                        type: "text",
                                        readonly: false,
                                        maxLength: 100,
                                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setTitulo(e.target.value),
                                        erroSession: "Titulo"
                                    }}
                                />
                            </div>
                            <div className={styles.formItens}>
                                <CampoTexto
                                    textBoxProps={{
                                        name: "Subtitulo",
                                        value: subTitulo,
                                        tooltip: "digite seu subtitulo",
                                        label: "subtitulo",
                                        type: "text",
                                        maxLength: 100,
                                        readonly: false,
                                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setSubTitulo(e.target.value)
                                    }}
                                />
                            </div>
                            <div className={styles.editorArea}>
                                <EditorTexto editorItem={editorProps} />
                            </div>
                        </div>

                        <div className={styles.separador}></div>

                        <div className={`${styles.coluna} ${styles.campos}`}>
                            <div className={styles.uploadGrid}>
                                {uploadItems.map((item, index) => (
                                    <div key={index} className={styles.uploadItem}>
                                        <Upload uploadProps={item ? item.uploadProps : {}} onUpload={handleImageUpload} />
                                    </div>
                                ))}
                            </div>

                            <div className={styles.botaoArea}>
                                <BotaoSubmit botaoProps={botaoProps} />
                            </div>
                        </div>
                    </div>

                    <div className={styles.hiddenFields}>
                        <CampoTexto textBoxProps={{ name: "colaboradorId", value: colaboradorId?.toString(), type: "hidden", onChange: (e: React.ChangeEvent<HTMLInputElement>) => setColaboradorId(Number(e.target.value)) }} />
                        <CampoTexto textBoxProps={{ name: "lojaPortifolioId", value: lojaPortifolioId?.toString(), type: "hidden", onChange: (e: React.ChangeEvent<HTMLInputElement>) => setLojaPortifolioId(Number(e.target.value)) }} />
                        <CampoTexto textBoxProps={{ name: "colaboradorPortifolioId", value: colaboradorPortifolioId?.toString(), type: "hidden", onChange: (e: React.ChangeEvent<HTMLInputElement>) => setColaboradorPortifolioId(Number(e.target.value)) }} />
                        <CampoTexto textBoxProps={{ name: "TipoUsuarioId", value: TipoUsuarioId?.toString(), type: "hidden", onChange: (e: React.ChangeEvent<HTMLInputElement>) => setTipoUsuarioId(Number(e.target.value)) }} />
                        <CampoTexto textBoxProps={{ name: "Id", value: idPersitir?.toString(), type: "hidden", onChange: (e: React.ChangeEvent<HTMLInputElement>) => setTipoUsuarioId(Number(e.target.value)) }} />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PortifolioPersistir;
