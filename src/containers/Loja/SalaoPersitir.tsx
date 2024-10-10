
import React, { useState, useEffect, useCallback } from "react";
import { cnpjMaskConst } from '../../constants/Loja/lojaConstant';
import CampoTexto from '../../components/textbox';
import { Grid } from '@mui/material';
import Botao from '../../components/button';
import Dropdown from "../../components/dropdown";
import { BotaoItens } from '../../Interfaces/Botao/botao';
import Mensagem from '../../components/mensagem';
import { foneMaskConst } from "../../constants/Usuario/usuarioConstant";
import { MensagemItens } from "../../Interfaces/Mensagens/MensagemItens";
import { LojaItens } from "../../Interfaces/Loja/lojaItens";
import { LojaPersistirService } from '../../services/Loja/lojaPersistirService';
import { RetornarMessageService } from '../../services/Perfil/retornarMessageService';
import { SelectChangeEvent } from '@mui/material/Select';

import '../../assets/styles/Loja/lojapersistir.css'
import { PersistirItens } from "../../Interfaces/shared/persistirItens";

const SalaoPersistir: React.FC<{ persistirProps: PersistirItens<LojaItens> }> = ({ persistirProps }) => {
    const [isMessage, setMessage] = useState<boolean>(false);
    const [messageItens, setMessageItens] = useState<MensagemItens>();
    const [id, setId] = useState<number>();
    const [tipoLojaId, setTipoLojaId] = useState<number>();
    const [razaoSocial, setRazaoSocial] = useState<string>('');
    const [cnpj, setCnpj] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [telefone, setTelefone] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchLojaData = useCallback(async () => {
        setId(persistirProps.item?.id);
        setTipoLojaId(persistirProps.item?.tipoLojaId);
        setRazaoSocial(persistirProps.item?.razaoSocial ?? '');
        setCnpj(persistirProps.item?.cnpj ?? '');
        setEmail(persistirProps.item?.email ?? '');
        setTelefone(persistirProps.item?.telefone ?? '');
    }, [persistirProps]);

    useEffect(() => {
        fetchLojaData();
    }, [fetchLojaData]);

    const handleButtonClick = () => {
        const fakeEvent = {
            preventDefault: () => { }
        } as React.FormEvent;
        handleSubmit(fakeEvent);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        const loja: LojaItens = {
            id: id,
            razaoSocial: razaoSocial,
            cnpj: cnpj,
            telefone: telefone,
            email: email,
            tipoLojaId: Number(tipoLojaId)
        }
        const retorno = await LojaPersistirService(loja);
        if (!retorno?.notifications || retorno?.notifications?.length === 0) {
            const messageRetorno = await RetornarMessageService(true, true, [])
            setMessageItens(messageRetorno)
            persistirProps.onSave?.();
            setIsLoading(false);
            setId(0);
            setCnpj('');
            setRazaoSocial('');
            setEmail('')
            setTelefone('')
            setTipoLojaId(0)

        } else {

            const messageRetorno = await RetornarMessageService(false, false, retorno?.notifications ?? [])
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
    const enviarSatusMessage = () => {
        setMessage(true)
        setTimeout(() => {
            setMessage(false);
        }, 6000);
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

    const botaoProps: BotaoItens = {
        name: 'Salvar',
        tooltip: 'Fazer o cadastro',
        label: 'Salvar',
        width: '200px',
        onIconClick: handleButtonClick,
        color: 'primary',
        isLoading: isLoading,
    };

    const handleDropdownChange = (e: SelectChangeEvent<string>) => {
        setTipoLojaId(Number(e.target.value));
    };

    return <>

        <div className='messageTextLoja'>
            <Mensagem mensagemProps={messageProps ?? {}} />
        </div>

        <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown}>
            <Grid container spacing={2} className="gridlojaTab">
                <Grid item md={6} xs={12} className='gridEsquerdoLoja'>
                    <div className='conteudoEsquerdoLoja'>
                        <div className='camposEsquerdoLoja'>
                            <div className="formItens">
                                <CampoTexto
                                    textBoxProps={{
                                        name: "Razão Social",
                                        tooltip: "digite a razão social",
                                        label: "razão social*",
                                        value: razaoSocial,
                                        type: 'text',
                                        maxLength : 250,
                                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setRazaoSocial(e.target.value)
                                    }}
                                />
                            </div>
                            <div className="formItens">
                                <CampoTexto
                                    textBoxProps={{
                                        name: "CNPJ",
                                        tooltip: "digite seu cnpj",
                                        label: "cnpj*",
                                        value: cnpj,
                                        type: 'text',
                                        mask: cnpjMaskConst,
                                        readonly: false,
                                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCnpj(e.target.value)

                                    }}
                                />
                            </div>
                            <div className="formItens">
                                <CampoTexto
                                    textBoxProps={{
                                        name: "Telefone",
                                        tooltip: "digite seu telefone",
                                        label: "telefone*",
                                        value: telefone,
                                        mask: foneMaskConst(telefone),
                                        type: 'text',
                                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setTelefone(e.target.value)
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </Grid>
                <Grid item md={6} xs={12} className='gridDireitoLoja'>
                    <div className='conteudoDireitoLoja'>
                        <div className='camposDireitoLoja'>
                            <div className="formItens">
                                <CampoTexto
                                    textBoxProps={{
                                        name: "Email",
                                        tooltip: "digite seu e-mail",
                                        label: "email*",
                                        value: email,
                                        type: 'text',
                                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)
                                    }}
                                />
                            </div>

                            <div className="formItens-drop">
                                <Dropdown
                                    dropProps={{
                                        name: "TipoLoja",
                                        itens: persistirProps.selectItems,
                                        label: "Tipo de Loja*",
                                        selectedId: tipoLojaId?.toString() || '',
                                        onChange: handleDropdownChange,
                                    }}
                                />
                            </div>

                            <div className='formItens'>
                                <div className='botao'>
                                    <Botao botaoProps={botaoProps} />
                                </div>
                            </div>
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
        </form>
    </>
}
export default SalaoPersistir;