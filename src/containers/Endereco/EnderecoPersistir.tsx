
import React, { useState,  useCallback } from "react";
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
import RefreshIcon from '@mui/icons-material/Refresh';
import Mensagem from '../../components/mensagem';
import Botao from '../../components/button';
import Dropdown from "../../components/dropdown";
import CampoTexto from '../../components/textbox';
import updatePersistirPrev from "../../hooks/useUpdatePersistirPrev";


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

    updatePersistirPrev(fetchEnderecoData,undefined, persistirProps.item);

    const handleDropdownChange = (e: SelectChangeEvent<string>, tipo: string) => {
        if (tipo === "colaborador") {
            setColaboradorId(Number(e.target.value))
        }
        if (tipo === "loja") {
            setLojaId(Number(e.target.value))
        }
    };


    const handleButtonClick = () => {
        const fakeEvent = {
            preventDefault: () => { }
        } as React.FormEvent;
        handleSubmit(fakeEvent);
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

            const messageRetorno = await RetornarMessageService(false, false, retorno?.notifications ?? [])
            setMessageItens(messageRetorno)
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

    const botaoProps: BotaoItens = {
        name: 'Salvar',
        tooltip: 'Fazer o cadastro',
        label: 'Salvar',
        width: '200px',
        color: 'primary',
        onIconClick: handleButtonClick,
        isLoading: isLoading
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
        if (tipoUsuario === TipoUsuarioLojaId) {
            setLojaId(0);
            setLojaEnderecoId(0);
        }
        if (tipoUsuario === TipoUsuarioColaboradorId) {
            setColaboradorId(0);
            setColaboradorEnderecoId(0);
        }
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
                <Grid item md={6} xs={12} className='gridEsquerdo'>
                    <div className="conteudoEsquerdoEndereco conteudoMenorEsquerdo">
                        {tipoUsuario?.toString() === TipoUsuarioLojaId && (
                            <div className="formItens-drop">
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
                        {tipoUsuario?.toString() === TipoUsuarioColaboradorId && (
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
                                    name: "Cep",
                                    value: cep,
                                    tooltip: "digite seu cep",
                                    label: "cep*",
                                    type: 'text',
                                    readonly: false,
                                    onChange: handleCepChange
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
                                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setLogradouro(e.target.value)
                                }}
                            />
                        </div>

                        <div className="formItens">
                            <CampoTexto
                                textBoxProps={{
                                    name: "numero",
                                    value: numero?.toString(),
                                    tooltip: "digite seu número",
                                    label: "Número*",
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
                                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEstado(e.target.value)
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
                                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCidade(e.target.value)
                                }}
                            />
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
        </form >
    </>
}
export default EnderecoPersistir;