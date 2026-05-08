import React from "react";
import { FaLock } from "react-icons/fa";
import Banner from "../../../components/banner";
import BotaoSubmit from "../../../components/submitButton";
import CampoTexto from "../../../components/textbox";
import Footer from "../../../components/footer";
import RecaptchaComponent from "../../../components/recaptcha";
import { RECAPTCHA_SITE_KEY } from "../../../config/apiConfig";
import { EsqueciText } from "../../../constants/Usuario/autenticacaoConstant";
import { BotaoItens } from "../../../Interfaces/Botao/botao";
import { useAlteraSenha } from "../hooks/useAlteraSenha";
import styles from "./AlteraSenhaPage.module.css";

const AlteraSenhaPage: React.FC = () => {
    const {
        envioItemText,
        handleFormKeyDown,
        handleRecaptchaChange,
        handleSubmit,
        isDiseble,
        isEnviaText,
        isLoading,
        isVisibleLogin,
        setValue,
        usuarioLogado,
        value,
    } = useAlteraSenha();

    const botaoProps: BotaoItens = {
        tooltip: "Enviar Email",
        isLoading,
        isDisable: isDiseble,
        icon: FaLock,
        marginLeft: "4px",
        marginRight: "4px",
    };

    return (
        <div className={styles.container}>
            <div className={styles.banner}>
                <Banner usuarioLogado={usuarioLogado} />
            </div>

            <div className={styles.formPersistir}>
                <div className={styles.card}>
                    <div className={styles.header}>
                        <h2>Alterar Senha</h2>
                        <p>Atualize sua senha</p>
                    </div>

                    <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown} id="frmAlterarSenha" className={styles.form}>
                        <div className={styles.campos}>
                            <div className={styles.info}>
                                {isVisibleLogin && (
                                    <p>{envioItemText} <a className={styles.link} href="/login">Login</a></p>
                                )}
                                {isEnviaText && (<p>{EsqueciText}</p>)}
                            </div>

                            <CampoTexto
                                textBoxProps={{
                                    name: "CPFEmail",
                                    tooltip: "digite seu CPF ou Email",
                                    label: "CPF ou Email*",
                                    value,
                                    type: "text",
                                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value),
                                    erroSession: "CPFEmail",
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

export default AlteraSenhaPage;
