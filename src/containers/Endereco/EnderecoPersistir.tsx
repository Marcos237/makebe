
import React, { useState, useCallback } from "react";
import { Grid } from '@mui/material';
import { PersistirItens } from "../../Interfaces/shared/persistirItens";
import { BotaoItens } from '../../Interfaces/Botao/botao';
import { MensagemItens } from "../../Interfaces/Mensagens/MensagemItens";
import { RetornarMessageService } from '../../services/shared/retornarMessageService';
import { SelectChangeEvent } from '@mui/material/Select';
import { PostService } from '../../services/shared/postService';
import { EnderecoItens } from "../../Interfaces/Endereco/enderecoItens";
import { BuscarDadosCorreios } from '../../services/shared/correioService';
import { API_BASE_AGENDA_URL } from "../../config/apiConfig";
import { UrlEndereco } from "../../constants/Endereco/enderecoConstants";
import { TipoUsuarioLojaId, TipoUsuarioColaboradorId } from '../../constants/Usuario/usuarioConstant';
import { FaSave } from 'react-icons/fa';
import { ErroItem } from '../../Interfaces/shared/erroItem';
import { useFormErros } from '../../hooks/useFormErros';
import { Tooltip } from '@mui/material';
import { FaRegTrashAlt } from "react-icons/fa";
import Mensagem from '../../components/mensagem';
import Dropdown from "../../components/dropdown";
import CampoTexto from '../../components/textbox';
import updatePersistirPrev from "../../hooks/useUpdatePersistirPrev";
import BotaoSubmit from "../../components/submitButton";


const EnderecoPersistir: React.FC<{
    persistirProps: PersistirItens<EnderecoItens>;
    persistirDropProps: Array<PersistirItens<EnderecoItens>>; tipoUsuario?: string;
}> = ({ persistirProps, persistirDropProps, tipoUsuario }) => {

    const [isMessage, setMessage] = useState<boolean>(false);
    const [messageItens, setMessageItens] = useState<MensagemItens>();
    const [lojaId, setLojaId] = useState<number>();
    const [id, setId] = useState<number>();
    const [numero, setNumero] = useState<number>();
    const [cep, setCep] = useState<string>('');
    const [logradouro, setLogradouro] = useState<string>('');
    const [complemento, setComplemento] = useState<string>('');
    const [estado, setEstado] = useState<string>('');
    const [cidade, setCidade] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [tipoUsuarioId, setTipoUsuarioId] = useState<number>();
    const [colaboradorEnderecoId, setColaboradorEnderecoId] = useState<number>();
    const [colaboradorId, setColaboradorId] = useState<number>();
    const [lojaEnderecoId, setLojaEnderecoId] = useState<number>();
    const colaboradorProps = persistirDropProps.find((item) => item.name === "colaborador")?.selectItems ?? [];
    const lojaProps = persistirDropProps.find((item) => item.name === "loja")?.selectItems ?? [];
    const [erros, setErros] = useState<ErroItem[]>([]);
    const [erroTrigger, setErroTrigger] = useState(0);

    useFormErros(erros, erroTrigger);

    const fetchEnderecoData = useCallback(async () => {
        setId(persistirProps.item?.id);
        setCep(persistirProps.item?.cep || '');
        setLojaId(persistirProps.item?.lojaId);
        setNumero(persistirProps.item?.numero)
        setLogradouro(persistirProps.item?.logradouro || '')
        setCidade(persistirProps.item?.cidade || '')
        setEstado(persistirProps.item?.estado || '');
        setTipoUsuarioId(Number(tipoUsuario));
        setColaboradorEnderecoId(persistirProps?.item?.colaboradorEnderecoId);
        setLojaEnderecoId(persistirProps?.item?.lojaEnderecoId);
        setColaboradorId(persistirProps?.item?.colaboradorId);
    }, [persistirProps.item, tipoUsuario]);

    updatePersistirPrev(fetchEnderecoData, undefined, persistirProps.item);

    const handleDropdownChange = (e: SelectChangeEvent<string>, tipo: string) => {
        if (tipo === "colaborador") {
            setColaboradorId(Number(e.target.value))
        }
        if (tipo === "loja") {
            setLojaId(Number(e.target.value))
        }
    };


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);

        const endereco: EnderecoItens = {
            id: id || 0,
            logradouro: logradouro || '',
            cep: cep || '',
            complemento: complemento || '',
            cidade: cidade || '',
            estado: estado || '',
            numero: numero || 0,
            lojaId: Number(lojaId) || 0,
            colaboradorId: Number(colaboradorId) || 0,
            colaboradorEnderecoId: colaboradorEnderecoId || 0,
            lojaEnderecoId: lojaEnderecoId || 0,
            tipoUsuarioId: Number(tipoUsuario) ?? tipoUsuarioId
        }

        const retorno = await PostService(endereco, `${API_BASE_AGENDA_URL}${UrlEndereco}`);
        if (!retorno?.notifications || retorno?.notifications?.length === 0) {

            const messageRetorno = await RetornarMessageService(true, true, [])
            setMessageItens(messageRetorno)
            persistirDropProps.forEach(item => {
                item.onSave?.();
                item.isSave = true
            });
            setIsLoading(false);
            limparItens();
        } else {

            const errosConvertidos: ErroItem[] = retorno?.notifications?.map((n) => ({
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

    const handleCepChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const newCep = event.target.value.replace(/\D/g, '');
        setCep(newCep);
        if (newCep.length === 8) {
            const dadosEndereco = await BuscarDadosCorreios(newCep);
            setLogradouro(dadosEndereco?.logradouro ?? '');
            setEstado(dadosEndereco?.estado ?? '');
            setCidade(dadosEndereco?.cidade ?? '');

        } else {
            setLogradouro('');
            setEstado('');
            setCidade('');
        }
    }, [setLogradouro, setEstado, setCidade, setCep]);

    const handleFormKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {

        if (event.key === 'Enter') {
            handleSubmit(event);
        }
    };

    const handleCloseMessage = () => {
        setMessage(false);
    };

    const messageProps: MensagemItens = {
        texto: messageItens?.texto,
        cor: messageItens?.cor,
        isVisible: isMessage,
        onClick: handleCloseMessage
    }

    const enviarSatusMessage = () => {
        setMessage(true)
        setTimeout(() => {
            setMessage(false);
        }, 6000);
    }

    const handleButtonClickLimpar = async () => {
        limparItens();
    }

    const limparItens = () => {
        setId(0);
        setCep('');
        setLojaId(0);
        setNumero(0)
        setLogradouro('')
        setCidade('')
        setEstado('');
        setComplemento('');
        if (tipoUsuario === TipoUsuarioLojaId) {
            setLojaId(0);
            setLojaEnderecoId(0);
        }
        if (tipoUsuario === TipoUsuarioColaboradorId) {
            setColaboradorId(0);
            setColaboradorEnderecoId(0);
        }
    }

    const botaoProps: BotaoItens = {
        tooltip: 'Salvar',
        isLoading: isLoading,
        icon: FaSave,
        marginLeft: '4px',
        marginRight: '4px'

    };


    return <>

        <div className='messageTextLoja'>
            <Mensagem mensagemProps={messageProps ?? {}} />
        </div>

        <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown} id="frmEndereco">
            <Grid container spacing={2} className="ContainerGrid">
                <div className='conteudo'>
                    <fieldset className='icone-box icone-box-form'>
                        <legend>Endereço</legend>

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
                            <div className="conteudoEsquerdoEndereco conteudoMenorEsquerdo">
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
                                    <div className="formItens">
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
                                            name: "CEP",
                                            value: cep,
                                            tooltip: "digite seu cep",
                                            label: "cep*",
                                            type: 'text',
                                            readonly: false,
                                            onChange: handleCepChange,
                                            erroSession: "CEP"
                                        }}
                                    />
                                </div>

                                <div className="formItens">
                                    <CampoTexto
                                        textBoxProps={{
                                            name: "Logradouro",
                                            value: logradouro,
                                            tooltip: "digite seu Logradouro",
                                            label: "Logradouro*",
                                            type: 'text',
                                            readonly: false,
                                            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setLogradouro(e.target.value),
                                            erroSession: "Logradouro"
                                        }}
                                    />
                                </div>

                                <div className="formItens">
                                    <CampoTexto
                                        textBoxProps={{
                                            name: "numero",
                                            value: numero?.toString(),
                                            tooltip: "digite seu número",
                                            label: "Número",
                                            type: 'text',
                                            readonly: false,
                                            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setNumero(Number(e.target.value))
                                        }}
                                    />
                                </div>
                            </div>
                        </Grid>
                        <div className="separador"></div>
                        <Grid item md={6} xs={12} className='gridDireito'>
                            <div className="conteudoDireitoEndereco conteudoMenorDireito">
                                <div className="formItens">
                                    <CampoTexto
                                        textBoxProps={{
                                            name: "Complemento",
                                            value: complemento,
                                            tooltip: "digite seu complemento",
                                            label: "complemento",
                                            type: 'text',
                                            readonly: false,
                                            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setComplemento(e.target.value)
                                        }}
                                    />
                                </div>

                                <div className="formItens">
                                    <CampoTexto
                                        textBoxProps={{
                                            name: "Estado",
                                            value: estado,
                                            tooltip: "digite seu Estado",
                                            label: "Estado*",
                                            type: 'text',
                                            readonly: false,
                                            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEstado(e.target.value),
                                            erroSession: "Estado"
                                        }}
                                    />
                                </div>

                                <div className="formItens">
                                    <CampoTexto
                                        textBoxProps={{
                                            name: "Cidade",
                                            value: cidade,
                                            tooltip: "digite sua Cidade",
                                            label: "Cidade*",
                                            type: 'text',
                                            readonly: false,
                                            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCidade(e.target.value),
                                            erroSession: "Cidade"
                                        }}
                                    />
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
                                    name: "id",
                                    value: id?.toString(),
                                    type: 'hidden',
                                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setId(Number(e.target.value))
                                }} />

                            <CampoTexto
                                textBoxProps={{
                                    name: "colaboradorId",
                                    value: colaboradorId?.toString(),
                                    type: 'hidden',
                                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setColaboradorId(Number(e.target.value))
                                }} />

                            <CampoTexto
                                textBoxProps={{
                                    name: "lojaEnderecoId",
                                    value: lojaEnderecoId?.toString(),
                                    type: 'hidden',
                                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setLojaEnderecoId(Number(e.target.value))
                                }} />

                            <CampoTexto
                                textBoxProps={{
                                    name: "colaboradorEnderecoId",
                                    value: colaboradorEnderecoId?.toString(),
                                    type: 'hidden',
                                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setColaboradorEnderecoId(Number(e.target.value))
                                }} />

                            <CampoTexto
                                textBoxProps={{
                                    name: "TipoUsuarioId",
                                    value: tipoUsuarioId?.toString(),
                                    type: 'hidden',
                                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setTipoUsuarioId(Number(e.target.value))
                                }} />
                        </div>
                    </fieldset>
                </div>
            </Grid>
        </form >
    </>
}
export default EnderecoPersistir;