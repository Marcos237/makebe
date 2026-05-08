import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { Box, Grid } from '@mui/material';
import { RecuperaText, UrlEsqueciSenha } from '../../constants/Usuario/autenticacaoConstant'
import { BotaoItens } from '../../Interfaces/Botao/botao';
import { PutService } from '../../services/shared/putService';
import { API_BASE_URL } from '../../config/apiConfig';
import { RecuperaSenhaItens } from '../../Interfaces/Usuario/RecuperaSenhaItens';
import { UsuarioLoginItens } from '../../Interfaces/Usuario/UsuarioLoginItens';
import { FaLock } from 'react-icons/fa';
import { ErroItem } from '../../Interfaces/shared/erroItem';
import { useFormErros } from '../../hooks/useFormErros';
import { useUsuarioLogado } from "../../hooks/useUsuarioLogado";
import BotaoSubmit from '../../components/submitButton';
import RecaptchaComponent from '../../components/recaptcha';
import Banner from '../../components/banner';
import Footer from '../../components/footer';
import CampoTexto from '../../components/textbox';
import { RECAPTCHA_SITE_KEY } from '../../config/apiConfig'



import '../../assets/styles/Perfil/recuperasenha.css'

const RecuperaSenha: React.FC = () => {
    const navigate = useNavigate();
    const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
    const [senha, setSenha] = useState<string>('');
    const [confirmacaoSenha, setConfirmacaoSenha] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [useUsuarioLogadoItem, setUsuarioLogado] = useState<UsuarioLoginItens>();
    const [erros, setErros] = useState<ErroItem[]>([]);
    const [erroTrigger, setErroTrigger] = useState(0);

    useFormErros(erros, erroTrigger);

    const { fetchUsuarioLogado } = useUsuarioLogado();

    useEffect(() => {
        const carregarUsuario = async () => {
            const usuario = await fetchUsuarioLogado();
            setUsuarioLogado(usuario);
        };

        carregarUsuario();
    }, [fetchUsuarioLogado]);
    const { chave } = useParams();
    const handleSubmit = async (event: React.FormEvent) => {

        event.preventDefault();
        setIsLoading(true);
        const recuperaItens: RecuperaSenhaItens = {
            id: chave ?? '',
            senha: senha ?? '',
            confirmaSenha: confirmacaoSenha ?? '',
            recaptcha: recaptchaValue ?? ''
        }
        const retorno = await PutService(recuperaItens, `${API_BASE_URL}${UrlEsqueciSenha}`);
        if (!retorno?.notifications || retorno?.notifications?.length === 0) {
            navigate('/login', { state: { retorno } });
        } else {
            const errosConvertidos: ErroItem[] = retorno.notifications.map((n) => ({
                Key: n.notificationProps?.Key ?? '',
                Mensagem: n.notificationProps?.Message ?? '',
                erroSession: n.notificationProps?.Key ?? ''
            }));

            setErros(errosConvertidos);
            setErroTrigger(prev => prev + 1);
            setIsLoading(false);
        }
    };

    const handleRecaptchaChange = (value: string | null) => {
        setRecaptchaValue(value);
    };

    const handleFormKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {

        if (event.key === 'Enter') {
            handleSubmit(event);
        }
    };


    const botaoProps: BotaoItens = {
        tooltip: 'Enviar',
        isLoading: isLoading,
        icon: FaLock,
        marginLeft: '4px',
        marginRight: '4px'

    };
    return (
        <>
            <div className='banner'>
                <Banner usuarioLogado={useUsuarioLogadoItem} />
            </div>
            <div className="form-persitir">
                <Grid container spacing={2} className="ContainerGrid">
                    <div className="conteudo">
                        <fieldset
                            className={'icone-box icone-box-form expandido'}>
                            <legend>Cadastrar Nova Senha</legend>
                            <form id='frmRecuperarSenha' onSubmit={handleSubmit} onKeyDown={handleFormKeyDown}>
                                <Grid item md={6} xs={12} className='gridEsquerdo hiddenTelaPequena'>
                                    <div className='conteudoEsquedoRecupera'>
                                        <h2>Por favor!</h2>
                                        <p>{RecuperaText}</p>

                                    </div>
                                </Grid>
                                <div className="separador"></div>
                                <Grid item md={6} xs={12} className='gridDireito'>
                                    <div className='conteudoDireitoRecupera'>

                                        <div className="formItensRecupera">
                                            <CampoTexto
                                                textBoxProps={{
                                                    name: "Senha",
                                                    tooltip: "digite sua senha",
                                                    label: "Senha",
                                                    type: "password",
                                                    value: senha,
                                                    erroSession: 'Senha',
                                                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setSenha(e.target.value)
                                                }}
                                            />
                                        </div>
                                        <div className="formItensRecupera">
                                            <CampoTexto
                                                textBoxProps={{
                                                    name: "ConfirmacaoSenha",
                                                    tooltip: "Confirme sua Senha",
                                                    label: "Confirma Senha*",
                                                    value: confirmacaoSenha,
                                                    type: 'password',
                                                    erroSession: 'ConfirmacaoSenha',
                                                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setConfirmacaoSenha(e.target.value)
                                                }}
                                            />
                                        </div>

                                        <div className='recaptcha'>
                                            <RecaptchaComponent siteKey={RECAPTCHA_SITE_KEY} onChange={handleRecaptchaChange} />
                                        </div>

                                        <div className='formItens'>
                                            <div className='botao botao-salvar'>
                                                <BotaoSubmit botaoProps={botaoProps} />
                                            </div>
                                        </div>
                                    </div>
                                </Grid>
                            </form>
                        </fieldset>
                    </div>
                </Grid>
            </div>

            <div>
                <Footer />
            </div>
        </>
    );
};

export default RecuperaSenha;
