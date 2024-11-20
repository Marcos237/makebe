import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { PersistirItens } from "../../Interfaces/shared/persistirItens";
import { Grid } from '@mui/material';
import { LojaPortifolioItem } from "../../Interfaces/LojaPortifolio/lojaportifolioItem";
import { UploadItens } from "../../Interfaces/TextBox/UploadItens";
import { EditorTextoItem } from '../../Interfaces/shared/editorTextoItem';
import {
    primeiraImagemBanner, segundaImagemBanner, terceiraImagemBanner, imagensSessaoBanner, imagensSessaoVitrine,
    imagensSessaoVitrinePrimeiro, imagensSessaoVitrinesegundo, Editor, EditorPlaceHolder, SessaoImagens,
    SessaoTitulos, SessaoTexto
} from '../../constants/LojaPortifolio/LojaPortifolioConstant';
import { SessaoItens } from '../../Interfaces/shared/sessaoItens';
import { SelectChangeEvent } from '@mui/material/Select';
import { MensagemItens } from "../../Interfaces/Mensagens/MensagemItens";
import { BotaoItens } from '../../Interfaces/Botao/botao';
import { LojaPortifolioImagemItem } from '../../Interfaces/LojaPortifolio/lojaportifolioImagemItem';
import { LojaPortifolioPersistirService } from "../../services/LojaPortifolio/LojaPortifolioPersistirService";
import { RetornarMessageService } from '../../services/Perfil/retornarMessageService';
import Botao from '../../components/button';
import CampoTexto from '../../components/textbox';
import Upload from "../../components/upload";
import EditorTexto from "../../components/ckEditor";
import Sessao from "../../components/sessao";
import Dropdown from "../../components/dropdown";
import Mensagem from '../../components/mensagem';
import "../../assets/styles/Loja/lojaPortifolio.css"

const LojaPortifolioPersistir: React.FC<{ persistirProps: PersistirItens<LojaPortifolioItem> }> = ({ persistirProps }) => {
    const [isMessage, setMessage] = useState<boolean>(false);
    const [messageItens, setMessageItens] = useState<MensagemItens>();
    const [id, setId] = useState<number>();
    const [titulo, setTitulo] = useState<string>('');
    const [subTitulo, setSubTitulo] = useState<string>('');
    const [texto, setTexto] = useState<string>('');
    const [lojaId, setLojaId] = useState<number>();
    const [imagens, setImagens] = useState<LojaPortifolioImagemItem[]>([]);
    const sessoesItens: Array<SessaoItens> = [];
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<number>();
    const [uploadItems, setUploadItems] = useState<Array<UploadItens>>([]);

    const titulos: Array<string> = useMemo(() => [
        primeiraImagemBanner,
        segundaImagemBanner,
        terceiraImagemBanner,
        imagensSessaoVitrinePrimeiro,
        imagensSessaoVitrinesegundo,
    ], []);
    
    const fetchPortifolioData = useCallback(async () => {
        const { id = 0, lojaId = 0, titulo = '', subTitulo = '', texto = '', lojaPortifolioImagens = [] } = persistirProps.item ?? {};

        setId(id);
        setLojaId(lojaId);
        setTitulo(titulo);
        setSubTitulo(subTitulo);
        setTexto(texto);
        setImagens(lojaPortifolioImagens);
        setIsOpen(id);

        const uploadItemsRetorno: UploadItens[] = [];
        titulos.forEach((titulo, index) => {
            const imagemEncontrada = lojaPortifolioImagens.find((imagem) => imagem.tituloImagem === titulo);
            const uploadImagem: UploadItens = imagemEncontrada ? {
                uploadProps: {
                    nomeImagem: imagemEncontrada.nomeImagem,
                    urlImagem: imagemEncontrada.urlImagem,
                    tituloImagem: imagemEncontrada.tituloImagem,
                    id: (index + 1).toString()
                }
            } : {
                uploadProps: {
                    tituloImagem: titulo,
                    id: `${(index + 1).toString()}`
                }
            };
            uploadItemsRetorno.push(uploadImagem);
            setUploadItems(uploadItemsRetorno)
        });
    }, [persistirProps, titulos]);

    const addImagemItem = useCallback(
        (uploadsItemAtualizado: UploadItens[]): LojaPortifolioImagemItem[] => {
            const imagensFiltradas: LojaPortifolioImagemItem[] = uploadsItemAtualizado
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
    const handleImageUpload = useCallback(
        (base64String: string, fileName: string, tituloImagem?: string, index?: string) => {
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

        const portifolio: LojaPortifolioItem = {
            id: id || 0,
            titulo: titulo || '',
            subTitulo: subTitulo || '',
            texto: texto || '',
            lojaPortifolioImagens: imagensAtualizadas || [],
            lojaId: Number(lojaId) || 0,
        }

        const retorno = await LojaPortifolioPersistirService(portifolio);
        if (!retorno?.notifications || retorno?.notifications?.length === 0) {

            const messageRetorno = await RetornarMessageService(true, true, [])
            setMessageItens(messageRetorno)
            persistirProps.onSave?.();
            setIsLoading(false);
            limparCampos();
        } else {

            const messageRetorno = await RetornarMessageService(false, false, retorno?.notifications ?? [])
            setMessageItens(messageRetorno)
        }
        enviarSatusMessage();
        setIsLoading(false);
    }
    const limparCampos = useCallback(() => {
        limparUploads();
        setId(0);
        setTitulo('');
        setSubTitulo('');
        setLojaId(0);
        setTexto('');
    }, []);

    const limparUploads = () => {
        setUploadItems([{ uploadProps: {} }]);
    };
    const handleDropdownChange = (e: SelectChangeEvent<string>) => {
        setLojaId(Number(e.target.value));
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
                                    <div className="formItens">
                                        <Upload uploadProps={uploadItems[0] ? uploadItems[0].uploadProps : {}} onUpload={handleImageUpload} />
                                    </div>
                                    <div className="formItens">
                                        <Upload uploadProps={uploadItems[1] ? uploadItems[1].uploadProps : {}} onUpload={handleImageUpload} />
                                    </div>
                                    <div className="formItens">
                                        <Upload uploadProps={uploadItems[2] ? uploadItems[2].uploadProps : {}} onUpload={handleImageUpload} />
                                    </div>
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
                                    <div className="formItens">
                                        <Upload uploadProps={uploadItems[3] ? uploadItems[3].uploadProps : {}} onUpload={handleImageUpload} />
                                    </div>
                                    <div className="formItens">
                                        <Upload uploadProps={uploadItems[4] ? uploadItems[4].uploadProps : {}} onUpload={handleImageUpload} />
                                    </div>
                                    <div className="itemVazio"></div>
                                </div>
                            </div>
                        </Grid>
                    </div>
                </Grid>
            </>
        )
    }

    const sessaoItemTitulos: SessaoItens = {
        nome: SessaoTitulos,
        conteudo: (
            <>
                <Grid container className="ContainerGrid">
                    <div className="conteudo">
                        <Grid item md={6} xs={12} className="gridEsquerdo">
                            <div className="conteudoLojaPortifolioPersistirEsquerdo conteudoMenorEsquerdo">

                                <div className="formItens">
                                    <Dropdown
                                        dropProps={{
                                            name: "Loja",
                                            label: "Loja*",
                                            itens: persistirProps?.selectItems ?? [],
                                            selectedId: lojaId?.toString() || '',
                                            onChange: handleDropdownChange
                                        }}
                                    />
                                </div>


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

    const handleCloseMessage = () => {
        setMessage(false);
    };

    const messageProps: MensagemItens = {
        texto: messageItens?.texto,
        cor: messageItens?.cor,
        isVisible: isMessage,
        onClick: handleCloseMessage
    }


    return (
        <>
            <div className='messageTextLojaPortifolio'>
                <Mensagem mensagemProps={messageProps ?? {}} />
            </div>
            <div className="sessaoLojaPortifolio">
                <form>
                    <Sessao sessaoProps={sessoesItens} isOpen={isOpen || 0} ></Sessao>
                    <Grid item md={12} xs={7}>
                        <div className='formItens'>
                            <div className='botao'>
                                <Botao botaoProps={botaoProps} />
                            </div>
                        </div>
                    </Grid>
                </form>
            </div>

            <div className='camposInvisiveis'>
                <CampoTexto
                    textBoxProps={{
                        name: "id",
                        value: id?.toString(),
                        type: 'hidden',
                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setId(Number(e.target.value))
                    }} />
            </div>
        </>
    );
};

export default LojaPortifolioPersistir;
