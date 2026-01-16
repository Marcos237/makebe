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
import { UrlColaborador, TipoCliente } from "../../constants/Colaborador/colaboradorConstant";
import { Tooltip } from '@mui/material';
import { FaRegTrashAlt } from "react-icons/fa";
import { FaSave } from 'react-icons/fa';
import { useFormErros } from '../../hooks/useFormErros';
import { ErroItem } from '../../Interfaces/shared/erroItem';
import { useParams } from "react-router-dom";
import SwitchButton from "../../components/switchButton";
import Dropdown from "../../components/dropdown";
import CampoTexto from '../../components/textbox';
import Mensagem from '../../components/mensagem';
import Upload from '../../components/upload';
import BotaoSubmit from '../../components/submitButton';
import updatePersistirPrev from "../../hooks/useUpdatePersistirPrev";

import '../../assets/styles/Colaborador/colaborador.css';

const ColaboradorPersistir: React.FC<{
    persistirProps: PersistirItens<ColaboradorItens>;
    readOnly: boolean;
    tipoItem?: number;
}> = ({ persistirProps, readOnly, tipoItem }) => {
    const [messageItens, setMessageItens] = useState<MensagemItens>();
    const [isMessage, setMessage] = useState<boolean>(false);
    const [id, setId] = useState<string>('');
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
    const [tipo, setTipo] = useState<number>();
    const [erros, setErros] = useState<ErroItem[]>([]);
    const [erroTrigger, setErroTrigger] = useState(0);
    const { urlParametro } = useParams();

    const usuario = urlParametro === "CadastroCliente" ? "Cliente" : urlParametro === "CadastroColaborador" ? "Colaborador" : "";

    useFormErros(erros, erroTrigger);
    const fetchColaboradorData = useCallback(async () => {

        setId(persistirProps.item?.id || '');
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
        setReadOnly(readOnly);
        setTipo(tipoItem);

    }, [persistirProps, readOnly, tipoItem])

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
            id: id || '0',
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
            tipo: Number(tipoItem) ?? tipo
        }

        const colaboradorResponse = await PostService(colabolador, `${API_BASE_AGENDA_URL}${UrlColaborador}`);
        if (!colaboradorResponse?.notifications || colaboradorResponse?.notifications?.length === 0) {
            const messageRetorno = await RetornarMessageService(true, true, [])
            setMessageItens(messageRetorno)
            persistirProps.onSave?.();
            limparItens();

        } else {

            const errosConvertidos: ErroItem[] = colaboradorResponse?.notifications?.map((n) => ({
                Key: n.notificationProps?.Key ?? '',
                Mensagem: n.notificationProps?.Message ?? '',
                erroSession: n.notificationProps?.Key ?? ''
            })) ?? [];
            setErros(errosConvertidos);
            setErroTrigger(prev => prev + 1);
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
        setId('');
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

    const botaoProps: BotaoItens = {
        tooltip: 'Salvar',
        isLoading: isLoading,
        icon: FaSave,
        marginLeft: '4px',
        marginRight: '4px'

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

    return <>
        <div className='messageTextLoja'>
            <Mensagem mensagemProps={messageProps ?? {}} />
        </div>


        <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown} id="frmColaborador">
            <Grid container spacing={2} className="ContainerGrid">
                <div className='conteudo'>
                    <fieldset className='icone-box icone-box-form'>
                        <legend>{usuario}</legend>

                        <div className="links-login">
                            <button onClick={handleButtonClickLimpar} className="botao-link">
                                <Tooltip title="limpar">
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                        <FaRegTrashAlt />
                                    </span>
                                </Tooltip>
                            </button>
                        </div>

                        <Grid item md={6} xs={12} className='gridEsquerdo'>
                            <div className="conteudoEsquerdo conteudoMenorEsquerdo">
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
                                            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setNome(e.target.value),
                                            erroSession:"Nome"
                                        }}
                                    />
                                </div>
                                <div className='formItens'>
                                    <CampoTexto
                                        textBoxProps={{
                                            name: "Cpf",
                                            tooltip: "digite o CPF",
                                            label: "CPF*",
                                            value: cpf,
                                            type: 'text',
                                            mask: cpfMaskConst,
                                            readonly: readOnlyItem,
                                            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCpf(e.target.value),
                                            erroSession:"CPF"

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
                                            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setTelefone(e.target.value),
                                            erroSession: "Telefone"
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
                                            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
                                            erroSession:"Email"
                                        }}
                                    />
                                </div>
                            </div>
                        </Grid>
                        <div className="separador"></div>
                        <Grid item md={6} xs={12} className='gridDireito'>
                            <div className="conteudoDireitoColaborador">
                                {tipoItem?.toString() !== TipoCliente && (
                                    <div className="formItens-drop">
                                        <Dropdown
                                            dropProps={{
                                                name: "PermissaoId",
                                                label: "Permissão*",
                                                itens: persistirProps.selectItems ?? [],
                                                selectedId: permissaoId || '',
                                                onChange: (e: SelectChangeEvent<string>) => handleDropdownChange(e, "permissao"),
                                                erroSession:"PermissaoId"
                                            }}
                                        />
                                    </div>
                                )}
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
                                {tipoItem?.toString() !== TipoCliente && (
                                    <div className="formItens-drop">
                                        <SwitchButton switchProps={switchButton} />
                                    </div>
                                )}

                                <div className="gridBotoes">
                                    <div className="botao botao-salvar">
                                        <BotaoSubmit botaoProps={botaoProps} />
                                    </div>
                                </div>
                            </div>
                        </Grid>
                    </fieldset>
                </div>
            </Grid>

            <div className='camposInvisiveis'>
                <CampoTexto
                    textBoxProps={{
                        name: "id",
                        value: id?.toString(),
                        type: 'hidden',
                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setId(e.target.value)
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