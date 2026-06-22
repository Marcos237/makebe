import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Grid } from '@mui/material';
import { RecuperaText, UrlEsqueciSenha } from '../../../constants/Usuario/autenticacaoConstant';
import { BotaoItens } from '../../../Interfaces/Botao/botao';
import { PutService } from '../../../services/shared/putService';
import { API_BASE_URL, RECAPTCHA_SITE_KEY } from '../../../config/apiConfig';
import { RecuperaSenhaItens } from '../../../Interfaces/Usuario/RecuperaSenhaItens';
import { UsuarioLoginItens } from '../../../Interfaces/Usuario/UsuarioLoginItens';
import { FaLock } from 'react-icons/fa';
import { ErroItem } from '../../../Interfaces/shared/erroItem';
import { useFormErros } from '../../../hooks/useFormErros';
import { useUsuarioLogado } from "../../../hooks/useUsuarioLogado";
import BotaoSubmit from '../../../components/submitButton';
import RecaptchaComponent from '../../../components/recaptcha';
import Banner from '../../../components/banner';
import Footer from '../../../components/footer';
import CampoTexto from '../../../components/textbox';
import { mapNotificationErrors } from '../../../utils/mapNotificationErrors';
import styles from './RecuperaSenha.module.css';

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
        };
        const retorno = await PutService(recuperaItens, `${API_BASE_URL}${UrlEsqueciSenha}`);
        if (!retorno?.notifications || retorno?.notifications?.length === 0) {
            navigate('/login', { state: { retorno } });
        } else {
            const errosConvertidos: ErroItem[] = mapNotificationErrors(retorno.notifications);
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
        <div className={styles.container}>
            <div className={styles.banner}>
                <Banner usuarioLogado={useUsuarioLogadoItem} />
            </div>

            <div className={styles.formPersistir}>
                <div className={styles.card}>
                    <div className={styles.header}>
                        <h2>Cadastrar Nova Senha</h2>
                        <p>Defina sua nova senha para continuar</p>
                    </div>

                    <form id='frmRecuperarSenha' onSubmit={handleSubmit} onKeyDown={handleFormKeyDown} className={styles.form}>
                        <div className={styles.formLayout}>
                            <Grid item md={6} xs={12} className={`${styles.gridEsquerdo} hiddenTelaPequena`}>
                                <div className={styles.conteudoEsquedoRecupera}>
                                    <h2>Por favor!</h2>
                                    <p>{RecuperaText}</p>
                                </div>
                            </Grid>

                            <div className={styles.separador}></div>

                            <Grid item md={6} xs={12} className={styles.gridDireito}>
                                <div className={styles.conteudoDireitoRecupera}>
                                    <div className={styles.formItensRecupera}>
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
                                    <div className={styles.formItensRecupera}>
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
                                    <div className={styles.recaptcha}>
                                        <RecaptchaComponent siteKey={RECAPTCHA_SITE_KEY} onChange={handleRecaptchaChange} />
                                    </div>
                                    <div className={styles.formItens}>
                                        <div className={styles.botao}>
                                            <BotaoSubmit botaoProps={botaoProps} />
                                        </div>
                                    </div>
                                </div>
                            </Grid>
                        </div>
                    </form>
                </div>
            </div>

            <div className={styles.footer}>
                <Footer />
            </div>
        </div>
    );
};

export default RecuperaSenha;
