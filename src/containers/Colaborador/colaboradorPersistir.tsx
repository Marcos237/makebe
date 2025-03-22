import React, { useState, useCallback } from "react";
import { PersistirItens } from "../../Interfaces/shared/persistirItens";
import { ColaboradorItens } from "../../Interfaces/Colaborador/colaboradorItem";
import { MensagemItens } from "../../Interfaces/Mensagens/MensagemItens";
import { Grid } from "@mui/material";
import { UploadItens } from '../../Interfaces/TextBox/UploadItens';
import { cpfMaskConst, foneMaskConst } from '../../utils/mascaras';
import { SelectChangeEvent } from '@mui/material/Select';
import { SwitchButtonItem } from "../../Interfaces/shared/switchButtonItem";
import { BotaoItens } from '../../Interfaces/Botao/botao';
import { PostService } from '../../services/shared/postService';
import { RetornarMessageService } from '../../services/shared/retornarMessageService';
import { API_BASE_AGENDA_URL } from "../../config/apiConfig";
import { UrlColaborador } from "../../constants/Colaborador/colaboradorConstant";
import RefreshIcon from '@mui/icons-material/Refresh';
import SwitchButton from "../../components/switchButton";
import Dropdown from "../../components/dropdown";
import CampoTexto from '../../components/textbox';
import Mensagem from '../../components/mensagem';
import Upload from '../../components/upload';
import Botao from '../../components/button';
import updatePersistirPrev from "../../hooks/useUpdatePersistirPrev";


const ColaboradorPersistir: React.FC<{
    persistirProps: PersistirItens<ColaboradorItens>;
    readOnly: boolean
}> = ({ persistirProps, readOnly }) => {
    const [messageItens, setMessageItens] = useState<MensagemItens>();
    const [isMessage, setMessage] = useState<boolean>(false);
    const [id, setId] = useState<number>(0);
    const [usuarioId, setUsuarioId] = useState<string>('');
    const [permissaoId, setPermissaoId] = useState<string>('');
    const [nome, setNome] = useState<string>('');
    const [instagran, setInstagran] = useState<string>('');
    const [cpf, setCpf] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [telefone, setTelefone] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [uploadItem, setUploadItem] = useState<UploadItens>({ uploadProps: { nomeImagem: '', urlImagem: '', id: '1' } });
    const [status, setStatus] = useState<boolean>(false);
    const [readOnlyItem, setReadOnly] = useState<boolean>(false);


    const fetchColaboradorData = useCallback(async () => {

        setId(persistirProps.item?.id || 0);
        setUsuarioId(persistirProps.item?.usuarioId || '');
        setNome(persistirProps.item?.nome || '');
        setCpf(persistirProps.item?.cpf || '');
        setEmail(persistirProps.item?.email || '');
        setTelefone(persistirProps.item?.telefone || '');
        setUploadItem({
            uploadProps: {
                nomeImagem: persistirProps.item?.nomeImagem,
                urlImagem: persistirProps.item?.urlImagem,
                id: "1"
            },
        });
        setInstagran(persistirProps?.item?.instagram ?? '')
        setPermissaoId(persistirProps.item?.permissaoId || '');
        setStatus(persistirProps.item?.status || false);
        setReadOnly(readOnly)

    }, [persistirProps, readOnly])

    updatePersistirPrev(fetchColaboradorData, undefined, persistirProps.item);

    const handleCloseMessage = () => {
        setMessage(false);
    };

    const messageProps: MensagemItens = {
        texto: messageItens?.texto,
        cor: messageItens?.cor,
        isVisible: isMessage,
        onClick: handleCloseMessage
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        const colabolador: ColaboradorItens = {
            id: id || 0,
            usuarioId: usuarioId || '',
            nome: nome || '',
            cpf: cpf || '',
            email: email || '',
            telefone: telefone || '',
            instagram: instagran || '',
            urlImagem: uploadItem.uploadProps.urlImagem,
            nomeImagem: uploadItem.uploadProps.nomeImagem,
            permissaoId: permissaoId || '',
            status: status || false,

        }

        const colaboradorResponse = await PostService(colabolador, `${API_BASE_AGENDA_URL}${UrlColaborador}`);
        if (!colaboradorResponse?.notifications || colaboradorResponse?.notifications?.length === 0) {

            const messageRetorno = await RetornarMessageService(true, true, [])
            setMessageItens(messageRetorno)
            persistirProps.onSave?.();
            limparItens();

        } else {

            const messageRetorno = await RetornarMessageService(false, false, colaboradorResponse?.notifications ?? [])
            setMessageItens(messageRetorno)
        }
        enviarSatusMessage();
        setIsLoading(false);
    }
    const handleFormKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {

        if (event.key === 'Enter') {
            handleSubmit(event);
        }
    };

    const limparItens = () => {
        setIsLoading(false);
        setId(0);
        setUsuarioId('');
        setNome('');
        setCpf('');
        setEmail('');
        setTelefone('');
        setInstagran('');
        setUploadItem({ uploadProps: { id: '1' } })
        setPermissaoId('');
        setStatus(false);
        setReadOnly(false);
    }
    const handleImageUpload = (base64String: string, fileName: string) => {
        setUploadItem({
            uploadProps: {
                nomeImagem: fileName,
                urlImagem: base64String,
                id: "1",
            },
        });
    };
    const handleDropdownChange = (e: SelectChangeEvent<string>, tipo: string) => {
        if (tipo === "permissao") {
            setPermissaoId(e.target.value)
        }
    };
    const handleChange = () => {
        setStatus(!status);
    };
    const switchButton: SwitchButtonItem = {
        label: "Status : ",
        checked: status,
        handleChange: handleChange

    }

    const handleButtonClick = () => {
        const fakeEvent = {
            preventDefault: () => { }
        } as React.FormEvent;
        handleSubmit(fakeEvent);
    };

    const botaoProps: BotaoItens = {
        name: 'Salvar',
        tooltip: 'Fazer o cadastro',
        label: 'Salvar',
        width: '200px',
        onIconClick: handleButtonClick,
        color: 'primary',
        isLoading: isLoading,
    };

    const enviarSatusMessage = () => {
        setMessage(true)
        setTimeout(() => {
            setMessage(false);
        }, 6000);
    }

    const handleButtonClickLimpar = async () => {
        limparItens();
    }
    const botaoLimparProps: BotaoItens = {
        tooltip: 'limpar',
        width: '20px',
        onIconClick: handleButtonClickLimpar,
        color: 'success',
        icon: RefreshIcon
    };
    return <>
        <div className='messageTextLoja'>
            <Mensagem mensagemProps={messageProps ?? {}} />
        </div>
        <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown} className="conteudo">
            <Grid container spacing={2}>
                <Grid item md={6} xs={10} className='gridEsquerdo'>
                    <div className='conteudoEsquerdoColaborador conteudoMenorEsquerdo'>
                        <div className='formItens-imagem'>
                            <Upload uploadProps={uploadItem.uploadProps} onUpload={handleImageUpload} />
                        </div>
                        <div className='formItens'>
                            <CampoTexto
                                textBoxProps={{
                                    name: "Nome",
                                    tooltip: "digite o nome",
                                    label: "Nome*",
                                    value: nome,
                                    type: 'text',
                                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setNome(e.target.value)
                                }}
                            />
                        </div>
                        <div className='formItens'>
                            <CampoTexto
                                textBoxProps={{
                                    name: "CPF",
                                    tooltip: "digite o CPF",
                                    label: "CPF*",
                                    value: cpf,
                                    type: 'text',
                                    mask: cpfMaskConst,
                                    readonly: readOnlyItem,
                                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCpf(e.target.value)

                                }}
                            />
                        </div>
                        <div className='formItens'>
                            <CampoTexto
                                textBoxProps={{
                                    name: "Telefone",
                                    tooltip: "digite o Telefone",
                                    label: "Telefone*",
                                    value: telefone,
                                    type: 'text',
                                    mask: foneMaskConst(telefone),
                                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setTelefone(e.target.value)
                                }}
                            />
                        </div>

                        <div className='formItens'>
                            <CampoTexto
                                textBoxProps={{
                                    name: "Email",
                                    tooltip: "digite o Email",
                                    label: "Email*",
                                    value: email,
                                    type: 'text',
                                    readonly: readOnlyItem,
                                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)
                                }}
                            />
                        </div>
                    </div>
                </Grid>

                <div className="separador"></div>
                <Grid item md={6} xs={10} className='gridDireito'>
                    <div className="conteudoDireitoColaborador conteudoMenorDireito">
                        <div className="formItens-drop">
                            <Dropdown
                                dropProps={{
                                    name: "Permissao",
                                    label: "Permissão*",
                                    itens: persistirProps.selectItems ?? [],
                                    selectedId: permissaoId || '',
                                    onChange: (e: SelectChangeEvent<string>) => handleDropdownChange(e, "permissao"),
                                }}
                            />
                        </div>

                        <div className="formItens">
                            <CampoTexto
                                textBoxProps={{
                                    name: "Instagram",
                                    tooltip: "digite o Instagram",
                                    label: "Instagram",
                                    value: instagran,
                                    type: 'text',
                                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setInstagran(e.target.value)
                                }}
                            />
                        </div>

                        <div className="formItens-drop">
                            <SwitchButton switchProps={switchButton} />
                        </div>
                    </div>
                </Grid>

                <Grid item xs={12}>
                    <div className="formItens gridBotoes">
                        <div className="botao">
                            <Botao botaoProps={botaoLimparProps} />
                        </div>
                        <div className="botao">
                            <Botao botaoProps={botaoProps} />
                        </div>
                    </div>
                </Grid>
            </Grid>
            <div className='camposInvisiveis'>
                <CampoTexto
                    textBoxProps={{
                        name: "id",
                        value: id?.toString(),
                        type: 'hidden',
                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setId(Number(e.target.value))
                    }} />
            </div>
            <div className='camposInvisiveis'>
                <CampoTexto
                    textBoxProps={{
                        name: "usuarioId",
                        value: usuarioId,
                        type: 'hidden',
                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setUsuarioId(e.target.value)
                    }} />
            </div>
        </form >
    </>
}

export default ColaboradorPersistir;