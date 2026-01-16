
import React, { useState, useCallback } from "react";
import { UrlLoja } from '../../constants/Loja/lojaConstant';
import { Grid } from '@mui/material';
import { PersistirItens } from "../../Interfaces/shared/persistirItens";
import { BotaoItens } from '../../Interfaces/Botao/botao';
import { foneMaskConst, cnpjMaskConst } from '../../utils/mascaras';
import { MensagemItens } from "../../Interfaces/Mensagens/MensagemItens";
import { LojaItens } from "../../Interfaces/Loja/lojaItens";
import { PostService } from '../../services/shared/postService';
import { RetornarMessageService } from '../../services/shared/retornarMessageService';
import { SelectChangeEvent } from '@mui/material/Select';
import { FaSave } from 'react-icons/fa';
import { ErroItem } from '../../Interfaces/shared/erroItem';
import { useFormErros } from '../../hooks/useFormErros';
import { API_BASE_AGENDA_URL } from "../../config/apiConfig";
import { FaRegTrashAlt } from "react-icons/fa";
import { Tooltip } from '@mui/material';
import Mensagem from '../../components/mensagem';
import BotaoSubmit from '../../components/submitButton';
import Dropdown from "../../components/dropdown";
import CampoTexto from '../../components/textbox';
import updatePersistirPrev from "../../hooks/useUpdatePersistirPrev";


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
    const [erros, setErros] = useState<ErroItem[]>([]);
    const [erroTrigger, setErroTrigger] = useState(0);

    useFormErros(erros, erroTrigger);

    const fetchLojaData = useCallback(async () => {
        if (!persistirProps.item) return;
        setId(persistirProps.item.id);
        setTipoLojaId(persistirProps.item.tipoLojaId);
        setRazaoSocial(persistirProps.item.razaoSocial ?? '');
        setCnpj(persistirProps.item.cnpj ?? '');
        setEmail(persistirProps.item.email ?? '');
        setTelefone(persistirProps.item.telefone ?? '');
    }, [persistirProps]);


    updatePersistirPrev(fetchLojaData, undefined, persistirProps.item);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        const loja: LojaItens = {
            id: id || 0,
            razaoSocial: razaoSocial || '',
            cnpj: cnpj || '',
            telefone: telefone || '',
            email: email || '',
            tipoLojaId: Number(tipoLojaId) || 0
        }
        const retorno = await PostService(loja, `${API_BASE_AGENDA_URL}${UrlLoja}`);

        if (!retorno?.notifications || retorno?.notifications?.length === 0) {
            const messageRetorno = await RetornarMessageService(true, true, [])
            setMessageItens(messageRetorno)
            persistirProps.onSave?.();
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
        tooltip: 'Salvar',
        isLoading: isLoading,
        icon: FaSave,
        marginLeft: '4px',
        marginRight: '4px'

    };

    const handleDropdownChange = (e: SelectChangeEvent<string>) => {
        setTipoLojaId(Number(e.target.value));
    };

    const handleButtonClickLimpar = async () => {
        limparItens();
    }

    const limparItens = () => {
        setIsLoading(false);
        setId(0);
        setCnpj('');
        setRazaoSocial('');
        setEmail('')
        setTelefone('')
        setTipoLojaId(0)
    }

    return <>

        <div className='messageTextLoja'>
            <Mensagem mensagemProps={messageProps ?? {}} />
        </div>
        <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown} id="frmLoja">
            <Grid container spacing={2} className="ContainerGrid">
                <div className='conteudo'>
                    <fieldset className='icone-box icone-box-form'>
                        <legend>Loja</legend>

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
                            <div className='conteudoEsquerdoLoja conteudoMenorEsquerdo'>
                                <div className="formItens">
                                    <CampoTexto
                                        textBoxProps={{
                                            name: "RazaoSocial",
                                            tooltip: "digite a razão social",
                                            label: "razão social*",
                                            value: razaoSocial,
                                            type: 'text',
                                            maxLength: 250,
                                            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setRazaoSocial(e.target.value),
                                            erroSession:"RazaoSocial"
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
                                            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCnpj(e.target.value),
                                            erroSession:"CNPJ"
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
                                            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setTelefone(e.target.value),
                                            erroSession:"Telefone"
                                        }}
                                    />
                                </div>
                            </div>
                        </Grid>
                        <div className="separador"></div>
                        <Grid item md={6} xs={12} className='gridDireito'>

                            <div className='conteudoDireitoLoja conteudoMenorDireito'>
                                <div className="formItens">
                                    <CampoTexto
                                        textBoxProps={{
                                            name: "Email",
                                            tooltip: "digite seu e-mail",
                                            label: "email*",
                                            value: email,
                                            type: 'text',
                                            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
                                            erroSession:"Email"
                                        }}
                                    />
                                </div>

                                <div className="formItens">
                                    <Dropdown
                                        dropProps={{
                                            name: "TipoLoja",
                                            itens: persistirProps.selectItems,
                                            label: "Tipo de Loja*",
                                            selectedId: tipoLojaId?.toString() || '',
                                            onChange: handleDropdownChange,
                                            erroSession :"TipoLoja"
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
                    </fieldset>
                </div>
            </Grid >
        </form >
    </>
}
export default SalaoPersistir;