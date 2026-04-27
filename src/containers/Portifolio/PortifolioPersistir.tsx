import React, { useState, useCallback, useMemo } from "react";
import { PersistirItens } from "../../Interfaces/shared/persistirItens";
import { Grid } from '@mui/material';
import { PortifolioItem } from "../../Interfaces/Portifolio/portifolioItem";
import { UploadItens } from "../../Interfaces/TextBox/UploadItens";
import { EditorTextoItem } from '../../Interfaces/shared/editorTextoItem';
import { Editor, EditorPlaceHolder, UrlPortifolio, UrlTipoPortifolioImagem } from '../../constants/Portifolio/PortifolioConstant';
import { FaSave } from 'react-icons/fa';
import { TipoUsuarioLojaId, TipoUsuarioColaboradorId } from '../../constants/Usuario/usuarioConstant';
import { SelectChangeEvent } from '@mui/material/Select';
import { MensagemItens } from "../../Interfaces/Mensagens/MensagemItens";
import { BotaoItens } from '../../Interfaces/Botao/botao';
import { PortifolioImagemItem } from '../../Interfaces/Portifolio/portifolioImagemItem';
import { PostService } from "../../services/shared/postService";
import { RetornarMessageService } from '../../services/shared/retornarMessageService';
import { API_BASE_AGENDA_URL } from "../../config/apiConfig";
import { TipoPortifolioImagemItem } from "../../Interfaces/Portifolio/tipoPortifolioImagemItem";
import { ResponseItem } from "../../Interfaces/shared/ResponseItem";
import { GetByIdService } from "../../services/shared/getByIdService";
import { FaRegTrashAlt } from "react-icons/fa";
import { Tooltip } from '@mui/material';
import { ErroItem } from '../../Interfaces/shared/erroItem';
import { useFormErros } from '../../hooks/useFormErros';
import BotaoSubmit from '../../components/submitButton';
import CampoTexto from '../../components/textbox';
import Upload from "../../components/upload";
import EditorTexto from "../../components/ckEditor";
import Dropdown from "../../components/dropdown";
import Mensagem from '../../components/mensagem';
import updatePersistirPrev from "../../hooks/useUpdatePersistirPrev";


const PortifolioPersistir: React.FC<{
    persistirProps: PersistirItens<PortifolioItem>;
    tiposPortifolioImagem: Array<TipoPortifolioImagemItem>;
    persistirDropProps: Array<PersistirItens<PortifolioItem>>;
    tipoUsuario?: string;
}> = ({ persistirProps, tiposPortifolioImagem, persistirDropProps, tipoUsuario }) => {
    const [isMessage, setMessage] = useState<boolean>(false);
    const [idPersitir, setId] = useState<number>(0);
    const [messageItens, setMessageItens] = useState<MensagemItens>({} as MensagemItens);
    const [titulo, setTitulo] = useState<string>('');
    const [subTitulo, setSubTitulo] = useState<string>('');
    const [texto, setTexto] = useState<string>('');
    const [lojaId, setLojaId] = useState<number>(0);
    const [imagens, setImagens] = useState<PortifolioImagemItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [uploadItems, setUploadItems] = useState<Array<UploadItens>>([]);
    const [colaboradorId, setColaboradorId] = useState<number>(0);
    const [colaboradorPortifolioId, setColaboradorPortifolioId] = useState<number>(0);
    const [lojaPortifolioId, setLojaPortifolioId] = useState<number>(0);
    const [TipoUsuarioId, setTipoUsuarioId] = useState<number>(0);
    const colaboradorProps = persistirDropProps.find((item) => item.name === "colaborador")?.selectItems ?? [];
    const lojaProps = persistirDropProps.find((item) => item.name === "loja")?.selectItems ?? [];
    const portifolioImagemItem: PortifolioImagemItem[] = useMemo(() => {
        return persistirProps?.item?.portifolioImagens ?? [];
    }, [persistirProps]);
    const [erros, setErros] = useState<ErroItem[]>([]);
    const [erroTrigger, setErroTrigger] = useState(0);


    useFormErros(erros, erroTrigger);


    const fetchPortifolioData = useCallback(async () => {
        setId(persistirProps?.item?.id ?? 0);
        setLojaId(persistirProps?.item?.lojaId ?? 0);
        setTitulo(persistirProps?.item?.titulo ?? '');
        setSubTitulo(persistirProps?.item?.subTitulo ?? '');
        setTexto(persistirProps?.item?.texto ?? '');
        setImagens(portifolioImagemItem);
        setColaboradorId(persistirProps?.item?.colaboradorId ?? 0);
        setColaboradorPortifolioId(persistirProps?.item?.colaboradorPortifolioId ?? 0);
        setLojaPortifolioId(persistirProps?.item?.lojaPortifolioId ?? 0);
        setTipoUsuarioId(Number(tipoUsuario ?? ""));

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
    }, [persistirProps, tipoUsuario, tiposPortifolioImagem, portifolioImagemItem]);


    const limparUpload = async () => {
        const imagem = await GetByIdService(tipoUsuario ?? "", `${API_BASE_AGENDA_URL}${UrlTipoPortifolioImagem}`
        ) as ResponseItem<TipoPortifolioImagemItem>;

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
    }
    const limparCampos = async () => {
        await limparUpload();
        setId(0);
        setTitulo('');
        setSubTitulo('');
        if (tipoUsuario === TipoUsuarioLojaId) {
            setLojaId(0);
        }
        if (tipoUsuario === TipoUsuarioColaboradorId) {
            setColaboradorId(0);
        }
        setTexto('');
    };

    updatePersistirPrev(fetchPortifolioData, limparCampos, persistirProps.item);
    const addImagemItem = useCallback(
        (uploadsItemAtualizado: UploadItens[]): PortifolioImagemItem[] => {
            const imagensFiltradas: PortifolioImagemItem[] = uploadsItemAtualizado
                .filter(
                    (upload) =>
                        upload.uploadProps.nomeImagem && upload.uploadProps.nomeImagem.trim() !== ''
                )
                .map((upload) => ({
                    lojaPortifolioImagemId: 0,
                    lojaPortifolioId: 0,
                    id: upload.uploadProps.id,
                    nomeImagem: upload.uploadProps.nomeImagem,
                    urlImagem: upload.uploadProps.urlImagem || '',
                    tituloImagem: upload.uploadProps.tituloImagem || '',
                }));
            setImagens(imagensFiltradas);
            return imagensFiltradas;
        },
        []
    );
    const handleImageUpload = useCallback((base64String: string, fileName: string, tituloImagem?: string, index?: string, tituloSessao?: string) => {
        if (!index) return;
        setUploadItems((prevState) => {
            const updatedItems = [...prevState];
            const position = Number(index.split('_')[1]) - 1;

            if (position >= 0) {
                updatedItems[position] = {
                    uploadProps: {
                        nomeImagem: fileName,
                        urlImagem: base64String,
                        tituloImagem: tituloImagem ?? '',
                        tituloSessao: tituloSessao ?? "",
                        id: index,
                        name: index,
                        errorSession: index,
                    },
                };
            }
            return updatedItems;
        });
    },
        []
    );


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);

        const imagensAtualizadas = addImagemItem(uploadItems) ?? imagens;
        const portifolio: PortifolioItem = {
            id: idPersitir || 0,
            titulo: titulo || '',
            subTitulo: subTitulo || '',
            texto: texto || '',
            lojaId: lojaId || 0,
            colaboradorId: Number(colaboradorId) || 0,
            colaboradorPortifolioId: colaboradorPortifolioId || 0,
            lojaPortifolioId: lojaPortifolioId || 0,
            portifolioImagens: imagensAtualizadas || [],
            tipoUsuarioId: TipoUsuarioId ?? Number(tipoUsuario)

        }
        const retorno = await PostService(portifolio, `${API_BASE_AGENDA_URL}${UrlPortifolio}`);
        retornoPost(retorno);
        enviarSatusMessage();
        setIsLoading(false);
        if (!retorno?.notifications || retorno?.notifications?.length === 0) {
            limparCampos();
        }
    }
    const retornoPost = async (retorno: ResponseItem<PortifolioItem>) => {
        if (!retorno?.notifications || retorno?.notifications?.length === 0) {

            const messageRetorno = await RetornarMessageService(true, true, [])
            setMessageItens(messageRetorno)
            persistirDropProps.forEach(item => {
                item.onSave?.();
                item.isSave = true
            });

            setIsLoading(false);
        } else {
            const errosConvertidos: ErroItem[] = retorno?.notifications?.map((n) => ({
                Key: n.notificationProps?.Key ?? '',
                Mensagem: n.notificationProps?.Message ?? '',
                erroSession: n.notificationProps?.Key ?? ''
            })) ?? [];

            setErros(errosConvertidos);
            setErroTrigger(prev => prev + 1);
        }
    }
    const handleCloseMessage = () => {
        setMessage(false);
    };

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
    const handleButtonClickLimpar = async () => {
        limparCampos();
    }


    const handleDropdownChange = (e: SelectChangeEvent<string>, tipo: string) => {
        if (tipo === "colaborador") {
            setColaboradorId(Number(e.target.value))
        }
        if (tipo === "loja") {
            setLojaId(Number(e.target.value))
        }
    };

    const editorProps: EditorTextoItem = {
        nome: Editor ?? '',
        value: texto,
        placeholder: EditorPlaceHolder ?? '',
        maxlength: 2000,
        rows: 15,
        altura: 25,
        alturaDefault: 200,
        onChange: (value: string) => setTexto(value)
    }


    const enviarSatusMessage = () => {
        setMessage(true)
        setTimeout(() => {
            setMessage(false);
        }, 6000);
    }

    const botaoProps: BotaoItens = {
        tooltip: 'Salvar',
        isLoading: isLoading,
        icon: FaSave,
        marginLeft: '4px',
        marginRight: '4px'

    };

    return (
        <>
            <div className='messageTextLojaPortifolio'>
                <Mensagem mensagemProps={messageProps ?? {}} />
            </div>

            <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown} id="frmProtifolio">
                <Grid container spacing={2} className="ContainerGrid">
                    <div className='conteudo'>
                        <fieldset className='icone-box icone-box-form'>
                            <legend>Portifólio</legend>


                            <div className="remove-item">
                                <button onClick={handleButtonClickLimpar} className="btn-danger" type="button">
                                    <Tooltip title="limpar">
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                            <FaRegTrashAlt />
                                        </span>
                                    </Tooltip>
                                </button>
                            </div>

                            <Grid item md={6} xs={12} className='gridEsquerdo'>
                                <div className="conteudoPortifolioEsquerdo conteudoMenorEsquerdo">
                                    {tipoUsuario?.toString() === TipoUsuarioLojaId && (
                                        <div className="formItens-drop">
                                            <Dropdown
                                                dropProps={{
                                                    name: "LojaColaborador",
                                                    label: "Loja*",
                                                    itens: lojaProps ?? [],
                                                    selectedId: lojaId?.toString() || '',
                                                    onChange: (e: SelectChangeEvent<string>) => handleDropdownChange(e, "loja"),
                                                    erroSession: "LojaColaborador"
                                                }}
                                            />
                                        </div>
                                    )}
                                    {tipoUsuario?.toString() === TipoUsuarioColaboradorId && (
                                        <div className="formItens-drop">
                                            <Dropdown
                                                dropProps={{
                                                    name: "LojaColaborador",
                                                    label: "Colaborador*",
                                                    itens: colaboradorProps,
                                                    selectedId: colaboradorId || '0',
                                                    onChange: (e: SelectChangeEvent<string>) => handleDropdownChange(e, "colaborador"),
                                                    erroSession: "LojaColaborador"
                                                }}
                                            />
                                        </div>
                                    )}
                                    <div className="formItens">
                                        <CampoTexto
                                            textBoxProps={{
                                                name: "Titulo",
                                                value: titulo,
                                                tooltip: "digite seu título",
                                                label: "título",
                                                type: 'text',
                                                readonly: false,
                                                maxLength: 100,
                                                onChange: (e: React.ChangeEvent<HTMLInputElement>) => setTitulo(e.target.value),
                                                erroSession: "Titulo"
                                            }}
                                        />
                                    </div>
                                    <div className="formItens">
                                        <CampoTexto
                                            textBoxProps={{
                                                name: "Subtitulo",
                                                value: subTitulo,
                                                tooltip: "digite seu subtitulo",
                                                label: "subtitulo",
                                                type: 'text',
                                                maxLength: 100,
                                                readonly: false,
                                                onChange: (e: React.ChangeEvent<HTMLInputElement>) => setSubTitulo(e.target.value)
                                            }}
                                        />
                                    </div>
                                    <div className="formItens">
                                        <div className="editor-protifolio">
                                            <EditorTexto editorItem={editorProps} />
                                        </div>
                                    </div>
                                </div>
                            </Grid>
                            <Grid item md={6} xs={12} className='gridDireito grid-direito-custom'>

                                <div className="conteudoPortifolioDireito conteudoMenorDireito">
                                    <div className="formItensHorizontal">
                                        {uploadItems
                                            .map((item, index) => (
                                                <div key={index} className="formItens">
                                                    <Upload
                                                        uploadProps={item ? item.uploadProps : {}}
                                                        onUpload={handleImageUpload}

                                                    />
                                                </div>
                                            ))}
                                        <div className="itemVazio"></div>
                                    </div>
                                </div>

                                <div className="gridBotoes">
                                    <div className="botao botao-salvar">
                                        <BotaoSubmit botaoProps={botaoProps} />
                                    </div>
                                </div>
                            </Grid>


                            <div className='camposInvisiveis'>
                                <CampoTexto
                                    textBoxProps={{
                                        name: "colaboradorId",
                                        value: colaboradorId?.toString(),
                                        type: 'hidden',
                                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setColaboradorId(Number(e.target.value))
                                    }} />

                                <CampoTexto
                                    textBoxProps={{
                                        name: "lojaPortifolioId",
                                        value: lojaPortifolioId?.toString(),
                                        type: 'hidden',
                                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setLojaPortifolioId(Number(e.target.value))
                                    }} />

                                <CampoTexto
                                    textBoxProps={{
                                        name: "colaboradorPortifolioId",
                                        value: colaboradorPortifolioId?.toString(),
                                        type: 'hidden',
                                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setColaboradorPortifolioId(Number(e.target.value))
                                    }} />

                                <CampoTexto
                                    textBoxProps={{
                                        name: "TipoUsuarioId",
                                        value: TipoUsuarioId?.toString(),
                                        type: 'hidden',
                                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setTipoUsuarioId(Number(e.target.value))
                                    }} />

                                <CampoTexto
                                    textBoxProps={{
                                        name: "Id",
                                        value: idPersitir?.toString(),
                                        type: 'hidden',
                                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setTipoUsuarioId(Number(e.target.value))
                                    }} />
                            </div>
                        </fieldset>
                    </div>
                </Grid>
            </form>
        </>
    );
};

export default PortifolioPersistir;
