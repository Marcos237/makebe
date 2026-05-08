import { FaSave } from 'react-icons/fa';
import { usePerfil } from '../hooks/usePerfil';
import { cpfMaskConst, foneMaskConst } from '../../../utils/mascaras';
import { RECAPTCHA_SITE_KEY } from '../../../config/apiConfig';
import Banner from '../../../components/banner';
import Footer from '../../../components/footer';
import RecaptchaComponent from '../../../components/recaptcha';
import Upload from '../../../components/upload';
import BotaoSubmit from '../../../components/submitButton';
import CampoTexto from '../../../components/textbox';
import { BotaoItens } from '../types';
import styles from './PerfilForm.module.css';

const PerfilForm: React.FC = () => {
    const {
        nome, setNome,
        cpf, setCpf,
        email, setEmail,
        telefone, setTelefone,
        instagram, setInstagram,
        senha, setSenha,
        confirmacaoSenha, setConfirmacaoSenha,
        isLoading,
        uploadItem,
        isLogado,
        useUsuarioLogadoItem,
        handleRecaptchaChange,
        handleImageUpload,
        handleSubmit,
        handleFormKeyDown,
    } = usePerfil();

    const botaoProps: BotaoItens = {
        tooltip: 'Salvar',
        isLoading: isLoading,
        icon: FaSave,
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
                        <h2>Perfil</h2>
                        <p>Gerencie seus dados</p>
                    </div>

                    <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown} id="frmPerfil" className={styles.form}>
                        <div className={styles.camposLayout}>
                            <div className={`${styles.coluna} ${styles.campos}`}>
                                <div className={styles.formItensImagem}>
                                    <Upload
                                        uploadProps={{
                                            ...uploadItem.uploadProps,
                                            id: uploadItem.uploadProps.id || 'perfil-imagem',
                                            name: uploadItem.uploadProps.name || 'perfilImagem',
                                            tituloImagem: uploadItem.uploadProps.tituloImagem || 'Foto de perfil',
                                        }}
                                        onUpload={handleImageUpload}
                                    />
                                </div>
                                <div className={styles.formItens}>
                                    <CampoTexto
                                        textBoxProps={{
                                            name: "Nome",
                                            tooltip: "digite seu nome",
                                            label: "Nome*",
                                            value: nome,
                                            type: 'text',
                                            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setNome(e.target.value),
                                            erroSession: "Nome"
                                        }}
                                    />
                                </div>
                                <div className={styles.formItens}>
                                    <CampoTexto
                                        textBoxProps={{
                                            name: "Cpf",
                                            tooltip: "digite seu CPF",
                                            label: "CPF*",
                                            value: cpf,
                                            type: 'text',
                                            mask: cpfMaskConst,
                                            readonly: isLogado,
                                            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCpf(e.target.value),
                                            erroSession: "CPF"
                                        }}
                                    />
                                </div>
                                <div className={styles.formItens}>
                                    <CampoTexto
                                        textBoxProps={{
                                            name: "Telefone",
                                            tooltip: "digite seu Telefone",
                                            label: "Telefone*",
                                            value: telefone,
                                            type: 'text',
                                            mask: foneMaskConst(telefone),
                                            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setTelefone(e.target.value),
                                            erroSession: "Telefone"
                                        }}
                                    />
                                </div>
                                <div className={styles.formItens}>
                                    <CampoTexto
                                        textBoxProps={{
                                            name: "Email",
                                            tooltip: "digite seu Email",
                                            label: "Email*",
                                            value: email,
                                            type: 'text',
                                            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
                                            erroSession: "Email"
                                        }}
                                    />
                                </div>
                            </div>

                            <div className={styles.separador}></div>

                            <div className={`${styles.coluna} ${styles.campos}`}>
                                <div className={styles.formItens}>
                                    <CampoTexto
                                        textBoxProps={{
                                            name: "Instagram",
                                            tooltip: "digite seu Instagram",
                                            label: "Instagram",
                                            value: instagram,
                                            type: 'text',
                                            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setInstagram(e.target.value)
                                        }}
                                    />
                                </div>

                                {!isLogado && (
                                    <>
                                        <div className={styles.formItens}>
                                            <CampoTexto
                                                textBoxProps={{
                                                    name: "Senha",
                                                    tooltip: "digite sua senha",
                                                    label: "Senha",
                                                    value: senha,
                                                    type: 'password',
                                                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setSenha(e.target.value),
                                                    erroSession: "Senha"
                                                }}
                                            />
                                        </div>
                                        <div className={styles.formItens}>
                                            <CampoTexto
                                                textBoxProps={{
                                                    name: "ConfirmaSenha",
                                                    tooltip: "digite sua confirmação de senha",
                                                    label: "confirmação da senha",
                                                    value: confirmacaoSenha,
                                                    type: 'password',
                                                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setConfirmacaoSenha(e.target.value),
                                                    erroSession: "ConfirmaSenha"
                                                }}
                                            />
                                        </div>
                                    </>
                                )}

                                <div className={styles.recaptcha}>
                                    <RecaptchaComponent siteKey={RECAPTCHA_SITE_KEY} onChange={handleRecaptchaChange} />
                                </div>

                                <div className={styles.botaoArea}>
                                    <BotaoSubmit botaoProps={botaoProps} />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div className={styles.footerCustom}>
                <Footer />
            </div>
        </div>
    );
};

export default PerfilForm;
