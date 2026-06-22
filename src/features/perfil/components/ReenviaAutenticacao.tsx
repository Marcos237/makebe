import React, { useState } from "react";
import { FaLock } from "react-icons/fa";
import Banner from "../../../components/banner";
import BotaoSubmit from "../../../components/submitButton";
import CampoTexto from "../../../components/textbox";
import Footer from "../../../components/footer";
import Mensagem from "../../../components/mensagem";
import RecaptchaComponent from "../../../components/recaptcha";
import { RECAPTCHA_SITE_KEY } from "../../../config/apiConfig";
import { ReenviatText, SucessText, UrlReenviaEmail } from "../../../constants/Usuario/autenticacaoConstant";
import { API_BASE_URL } from "../../../config/apiConfig";
import { useFormErros } from "../../../hooks/useFormErros";
import { BotaoItens } from "../../../Interfaces/Botao/botao";
import { MensagemItens } from "../../../Interfaces/Mensagens/MensagemItens";
import { ErroItem } from "../../../Interfaces/shared/erroItem";
import { ReenviaItens } from "../../../Interfaces/Usuario/ReenviaItens";
import { PostService } from "../../../services/shared/postService";
import { mapNotificationErrors } from "../../../utils/mapNotificationErrors";
import styles from "./ReenviaAutenticacao.module.css";

const ReenviaAutenticacao: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [isMessage, setMessage] = useState<boolean>(false);
    const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
    const [erros, setErros] = useState<ErroItem[]>([]);
    const [erroTrigger, setErroTrigger] = useState(0);
    const [recaptchaRenderKey, setRecaptchaRenderKey] = useState(0);

    useFormErros(erros, erroTrigger);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        const reenviaItens: ReenviaItens = {
            usuarioId: "",
            email,
            recaptcha: recaptchaValue ?? "",
        };
        const response = await PostService(reenviaItens, `${API_BASE_URL}${UrlReenviaEmail}`);

        if (response?.notifications && response.notifications.length > 0) {
            const errosConvertidos: ErroItem[] = mapNotificationErrors(response.notifications);
            setErros(errosConvertidos);
            setErroTrigger((prev) => prev + 1);
            setRecaptchaValue(null);
            setRecaptchaRenderKey((prev) => prev + 1);
            setIsLoading(false);
            setMessage(false);
        } else {
            setEmail("");
            setMessage(true);
        }
        setIsLoading(false);
    };

    const handleFormKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
        if (event.key === "Enter") {
            handleSubmit(event);
        }
    };

    const botaoProps: BotaoItens = {
        tooltip: "Enviar",
        isLoading,
        icon: FaLock,
        marginLeft: "4px",
        marginRight: "4px",
        classIcone: styles.iconeRotacionado,
        className: styles.botaoCustom,
        variantStyle: 'primary',
        name: 'Enviar'
    };

    const messageProps: MensagemItens = {
        texto: SucessText,
        cor: "#A3E4D7",
        onClick: () => setMessage(false),
    };

    return (
        <div className={styles.container}>
            <div className={styles.banner}>
                <Banner />
            </div>
            <div className={styles.formPersistir}>
                <div className={styles.card}>
                    <div className={styles.header}>
                        <h2>Reenviar Autenticacao</h2>
                        <p>Solicite um novo codigo</p>
                    </div>

                    <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown} id="frmReenvia" className={styles.form}>
                        <div className={styles.messageTextReenvia}>
                            {isMessage && (<Mensagem mensagemProps={messageProps} />)}
                        </div>

                        <div className={styles.itemReenvia}>
                            <div className={styles.textoReenvia}>
                                <p>{ReenviatText}</p>
                            </div>
                        </div>

                        <div className={styles.campoArea}>
                            <CampoTexto
                                textBoxProps={{
                                    name: "Email",
                                    tooltip: "digite seu Email",
                                    label: "Email*",
                                    value: email,
                                    type: "text",
                                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
                                    erroSession: "Email",
                                }}
                            />
                        </div>

                        <div className={styles.recaptcha}>
                            <RecaptchaComponent key={recaptchaRenderKey} siteKey={RECAPTCHA_SITE_KEY} onChange={setRecaptchaValue} />
                        </div>

                        <div className={styles.botaoArea}>
                            <BotaoSubmit botaoProps={botaoProps} />
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

export default ReenviaAutenticacao;
