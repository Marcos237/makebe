import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { PersistirItens } from "../../Interfaces/shared/persistirItens";
import { Grid } from '@mui/material';
import { PortifolioItem } from "../../Interfaces/Portifolio/portifolioItem";
import { UploadItens } from "../../Interfaces/TextBox/UploadItens";
import { EditorTextoItem } from '../../Interfaces/shared/editorTextoItem';
import {
    imagensSessaoBanner, imagensSessaoVitrine, Editor, EditorPlaceHolder, SessaoImagens,
    SessaoTitulos, SessaoTexto, UrlPortifolio, TipoUsuarioPortifolioColaboradorId, TipoUsuarioPortifolioLojaId,
    UrlTipoPortifolioImagem
} from '../../constants/Portifolio/PortifolioConstant';
import { SessaoItens } from '../../Interfaces/shared/sessaoItens';
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

import Botao from '../../components/button';
import CampoTexto from '../../components/textbox';
import Upload from "../../components/upload";
import EditorTexto from "../../components/ckEditor";
import Sessao from "../../components/sessao";
import Dropdown from "../../components/dropdown";
import Mensagem from '../../components/mensagem';
import RefreshIcon from '@mui/icons-material/Refresh';


const PortifolioPersistir: React.FC<{
    persistirProps: PersistirItens<PortifolioItem>;
    tiposPortifolioImagem: Array<TipoPortifolioImagemItem>;
    persistirDropProps: Array<PersistirItens<PortifolioItem>>;
    tipoUsuarioPortifolio?: string;
}> = ({ persistirProps, tiposPortifolioImagem, persistirDropProps, tipoUsuarioPortifolio }) => {
    const [isMessage, setMessage] = useState<boolean>(false);
    const [messageItens, setMessageItens] = useState<MensagemItens>();
    const [id, setId] = useState<number>();
    const [titulo, setTitulo] = useState<string>('');
    const [subTitulo, setSubTitulo] = useState<string>('');
    const [texto, setTexto] = useState<string>('');
    const [lojaId, setLojaId] = useState<number>();
    const [imagens, setImagens] = useState<PortifolioImagemItem[]>([]);
    const sessoesItens: Array<SessaoItens> = [];
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<number>();
    const [uploadItems, setUploadItems] = useState<Array<UploadItens>>([]);
    const [colaboradorId, setColaboradorId] = useState<number>();
    const [colaboradorPortifolioId, setColaboradorPortifolioId] = useState<number>();
    const [lojaPortifolioId, setLojaPortifolioId] = useState<number>();
    const [tipoUsuarioPortifolioId, setTipoUsuarioPortifolioId] = useState<number>();
    const colaboradorProps = persistirDropProps.find((item) => item.name === "colaborador")?.selectItems ?? [];
    const lojaProps = persistirDropProps.find((item) => item.name === "loja")?.selectItems ?? [];
    const portifolioImagemItem: PortifolioImagemItem[] = persistirProps?.item?.portifolioImagens ?? [];

    const fetchPortifolioData = useCallback(async () => {
        setId(persistirProps?.item?.id ?? 0);
        setLojaId(persistirProps?.item?.lojaId ?? 0);
        setTitulo(persistirProps?.item?.titulo ?? '');
        setSubTitulo(persistirProps?.item?.subTitulo ?? '');
        setTexto(persistirProps?.item?.texto ?? '');
        setImagens(portifolioImagemItem);
        setIsOpen(id);
        setColaboradorId(persistirProps?.item?.colaboradorId);
        setColaboradorPortifolioId(persistirProps?.item?.colaboradorPortifolioId);
        setLojaPortifolioId(persistirProps?.item?.lojaPortifolioId);
        setTipoUsuarioPortifolioId(Number(tipoUsuarioPortifolio));

        const uploadItemsRetorno: UploadItens[] = [];
        tiposPortifolioImagem.forEach((tipos, index) => {
            const imagemEncontrada = portifolioImagemItem.find((imagem) => imagem.tituloImagem === tipos.descricao);

            const uploadImagem: UploadItens = imagemEncontrada ? {
                uploadProps: {
                    nomeImagem: imagemEncontrada.nomeImagem,
                    urlImagem: imagemEncontrada.urlImagem,
                    tituloImagem: imagemEncontrada.tituloImagem,
                    tituloSessao: tipos?.titulo,
                    id: (index + 1).toString()
                }
            } : {
                uploadProps: {
                    nomeImagem: "",
                    urlImagem: "",
                    tituloImagem: tipos.descricao,
                    tituloSessao: tipos?.titulo,
                    id: `${(index + 1).toString()}`
                }
            };

            uploadItemsRetorno.push(uploadImagem);
            setUploadItems(uploadItemsRetorno)
        });
    }, [persistirProps]);

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
            const position = Number(index) - 1;

            if (position >= 0) {
                updatedItems[position] = {
                    uploadProps: {
                        nomeImagem: fileName,
                        urlImagem: base64String,
                        tituloImagem: tituloImagem ?? '',
                        tituloSessao: tituloSessao ?? "",
                        id: index,
                    },
                };
            }
            return updatedItems;
        });
    },
        []
    );

    const handleButtonClick = () => {
        const fakeEvent = {
            preventDefault: () => { }
        } as React.FormEvent;
        handleSubmit(fakeEvent);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);

        const imagensAtualizadas = addImagemItem(uploadItems) ?? imagens;
        const portifolio: PortifolioItem = {
            id: id || 0,
            titulo: titulo || '',
            subTitulo: subTitulo || '',
            texto: texto || '',
            lojaId: lojaId || 0,
            colaboradorId: Number(colaboradorId) || 0,
            colaboradorPortifolioId: colaboradorPortifolioId || 0,
            lojaPortifolioId: lojaPortifolioId || 0,
            portifolioImagens: imagensAtualizadas || [],
            tipoUsuarioPortifolioId: tipoUsuarioPortifolioId

        }
        const retorno = await PostService(portifolio, `${API_BASE_AGENDA_URL}${UrlPortifolio}`);
        retornoPost(retorno);
        enviarSatusMessage();
        setIsLoading(false);

        const tipoPortifolioImagensResponse = await GetByIdService(tipoUsuarioPortifolio ?? "", `${API_BASE_AGENDA_URL}${UrlTipoPortifolioImagem}`
        ) as ResponseItem<TipoPortifolioImagemItem>;

        await limparCampos(tipoPortifolioImagensResponse.datas);
    }
    const retornoPost = async (retorno: ResponseItem<PortifolioItem>) => {
        if (!retorno?.notifications || retorno?.notifications?.length === 0) {

            const messageRetorno = await RetornarMessageService(true, true, [])
            setMessageItens(messageRetorno)
            persistirDropProps.forEach(item => {
                item.onSave?.();
            });

            setIsLoading(false);
        } else {

            const messageRetorno = await RetornarMessageService(false, false, retorno?.notifications ?? [])
            setMessageItens(messageRetorno)
        }
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
    const handleButtonClickLimpar = async () => {
        limparCampos(tiposPortifolioImagem);
    }

    const botaoLimparProps: BotaoItens = {
        tooltip: 'limpar',
        width: '20px',
        onIconClick: handleButtonClickLimpar,
        color: 'success',
        icon: RefreshIcon
    };

    const limparCampos = useCallback(async (imagem?: Array<TipoPortifolioImagemItem>) => {
        const uploadItemsRetorno: UploadItens[] = [];
        imagem?.map((tipos, index) => {

            const uploadImagem: UploadItens = {
                uploadProps: {
                    nomeImagem: "",
                    urlImagem: "",
                    tituloImagem: tipos.descricao,
                    tituloSessao: tipos?.titulo,
                    id: `${(index + 1).toString()}`
                }
            };
            uploadItemsRetorno.push(uploadImagem);
        });
        setUploadItems(uploadItemsRetorno);

        setId(0);
        setTitulo('');
        setSubTitulo('');
        if (tipoUsuarioPortifolio === TipoUsuarioPortifolioLojaId) {
            setLojaId(0);
        }
        if (tipoUsuarioPortifolio === TipoUsuarioPortifolioColaboradorId) {
            setColaboradorId(0);
        }
        setTexto('');
    }, [tipoUsuarioPortifolio]);

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

    const botaoProps: BotaoItens = {
        name: 'Salvar',
        tooltip: 'Fazer o cadastro',
        label: 'Salvar',
        width: '200px',
        color: 'primary',
        onIconClick: handleButtonClick,
        isLoading: isLoading
    };

    const enviarSatusMessage = () => {
        setMessage(true)
        setTimeout(() => {
            setMessage(false);
        }, 6000);
    }

    const prevItemRef = useRef(persistirProps.item);
    useEffect(() => {
        const prevItem = prevItemRef.current;
        if (persistirProps.item && prevItem !== persistirProps.item) {
            fetchPortifolioData();
        }
        prevItemRef.current = persistirProps.item;
        if (!prevItem) {
            fetchPortifolioData();
        }
    }, [fetchPortifolioData, persistirProps.item]);

    const sessaoItemImagem: SessaoItens = {
        nome: SessaoImagens,
        conteudo: (
            <>
                <Grid container className="ContainerGrid">
                    <div className="conteudo">
                        <Grid item md={6} xs={12} className="gridEsquerdo">
                            <div className="conteudoLojaPortifolioPersistirEsquerdo">
                                <div className="sessaoImagensBanner">
                                    <h5>{imagensSessaoBanner}</h5>
                                </div>
                                <div className="formItensHorizontal">
                                    {uploadItems
                                        .filter((item) => item.uploadProps.tituloSessao === imagensSessaoBanner)
                                        .map((item, index) => (
                                            <div key={index} className="formItens">
                                                <Upload
                                                    uploadProps={item ? item.uploadProps : {}}
                                                    onUpload={handleImageUpload}
                                                />
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </Grid>

                        <div className="separador"></div>
                        <Grid item md={6} xs={12} className="gridDireito">
                            <div className="conteudoLojaPortifolioPersistirDireito">
                                <div className="sessaoImagensBanner">
                                    <h5>{imagensSessaoVitrine}</h5>
                                </div>
                                <div className="formItensHorizontal">
                                    {uploadItems
                                        .filter((item) => item.uploadProps?.tituloSessao === imagensSessaoVitrine)
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
                        </Grid>
                    </div>
                </Grid>
            </>
        )
    };

    const sessaoItemTitulos: SessaoItens = {
        nome: SessaoTitulos,
        conteudo: (
            <>
                <Grid container className="ContainerGrid">
                    <div className="conteudo">
                        <Grid item md={6} xs={12} className="gridEsquerdo">
                            <div className="conteudoLojaPortifolioPersistirEsquerdo conteudoMenorEsquerdo">
                                {tipoUsuarioPortifolioId?.toString() == TipoUsuarioPortifolioLojaId && (
                                    <div className="formItens">
                                        <Dropdown
                                            dropProps={{
                                                name: "Loja",
                                                label: "Loja*",
                                                itens: lojaProps ?? [],
                                                selectedId: lojaId?.toString() || '',
                                                onChange: (e: SelectChangeEvent<string>) => handleDropdownChange(e, "loja")
                                            }}
                                        />
                                    </div>
                                )}
                                {tipoUsuarioPortifolioId?.toString() === TipoUsuarioPortifolioColaboradorId && (
                                    <div className="formItens-drop">
                                        <Dropdown
                                            dropProps={{
                                                name: "Colaborador",
                                                label: "Colaborador*",
                                                itens: colaboradorProps,
                                                selectedId: colaboradorId || '0',
                                                onChange: (e: SelectChangeEvent<string>) => handleDropdownChange(e, "colaborador"),
                                            }}
                                        />
                                    </div>
                                )}

                                <div className="formItens">
                                    <CampoTexto
                                        textBoxProps={{
                                            name: "Título",
                                            value: titulo,
                                            tooltip: "digite seu título",
                                            label: "título",
                                            type: 'text',
                                            readonly: false,
                                            maxLength: 100,
                                            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setTitulo(e.target.value)
                                        }}
                                    />
                                </div>
                            </div>
                        </Grid>
                        <Grid item md={6} xs={12} className="gridDireito">
                            <div className="conteudoLojaPortifolioPersistirDireito conteudoMenorDireitoLojaPortifolio">
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
                            </div>
                        </Grid>
                    </div>
                </Grid>
            </>
        )
    }

    const sessaoItemTexto: SessaoItens = {
        nome: SessaoTexto,
        conteudo: (
            <>
                <Grid container className="ContainerGrid">
                    <div className="conteudo">
                        <Grid item md={12} xs={12}>
                            <div className="conteudoLojaPortifolioPersistir">
                                <EditorTexto editorItem={editorProps} />
                            </div>
                        </Grid>
                    </div>
                </Grid>
            </>
        )
    }

    sessoesItens.push(sessaoItemTitulos);
    sessoesItens.push(sessaoItemImagem);
    sessoesItens.push(sessaoItemTexto);


    return (
        <>
            <div className='messageTextLojaPortifolio'>
                <Mensagem mensagemProps={messageProps ?? {}} />
            </div>
            <div className="sessaoLojaPortifolio">
                <form>
                    <Sessao sessaoProps={sessoesItens} isOpen={isOpen || 0} ></Sessao>

                    <Grid container spacing={2}>
                        <Grid item md={3} xs={7}>
                            <div className='formItens botaoItem'>
                                <div className='botao'>
                                    <Botao botaoProps={botaoLimparProps} />
                                </div>
                            </div>
                        </Grid>
                        <Grid item md={7} xs={3}>
                            <div className='formItens botaoItemSalvar'>
                                <div className='botao'>
                                    <Botao botaoProps={botaoProps} />
                                </div>
                            </div>
                        </Grid>
                    </Grid>

                </form>
            </div>

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
                        name: "tipoUsuarioPortifolioId",
                        value: tipoUsuarioPortifolioId?.toString(),
                        type: 'hidden',
                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setTipoUsuarioPortifolioId(Number(e.target.value))
                    }} />
            </div>
        </>
    );
};

export default PortifolioPersistir;
