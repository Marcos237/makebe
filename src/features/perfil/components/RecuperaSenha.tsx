import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
    const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
    const [senha, setSenha] = useState<string>('');
    const [confirmacaoSenha, setConfirmacaoSenha] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [useUsuarioLogadoItem, setUsuarioLogado] = useState<UsuarioLoginItens>();
    const [erros, setErros] = useState<ErroItem[]>([]);
    const [erroTrigger, setErroTrigger] = useState(0);
    useFormErros(erros, erroTrigger);
    const { fetchUsuarioLogado } = useUsuarioLogado();
    const navigate = useNavigate();

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
            setIsLoading(false);
            navigate('/login');
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
                        <div className={styles.campos}>
                            <div className={styles.info}>
                                <p>{RecuperaText}</p>
                            </div>

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
                            <div className={styles.recaptcha}>
                                <RecaptchaComponent siteKey={RECAPTCHA_SITE_KEY} onChange={handleRecaptchaChange} />
                            </div>
                            <div className={styles.botaoArea}>
                                <BotaoSubmit botaoProps={botaoProps} />
                            </div>
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
