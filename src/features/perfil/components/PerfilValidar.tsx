import React from 'react';
import Banner from '../../../components/banner';
import Footer from '../../../components/footer';
import { MensagemCadastro } from '../../../constants/Usuario/usuarioConstant';
import styles from './PerfilValidar.module.css';

const PerfilValidar: React.FC = () => {
    return (
        <div className={styles.container}>
            <div className={styles.banner}>
                <Banner />
            </div>
            <div className={styles.formPersistir}>
                <div className={styles.card}>
                    <div className={styles.header}>
                        <h2>Validar Perfil</h2>
                        <p>Confirme suas informacoes</p>
                    </div>

                    <div className={styles.form}>
                        <fieldset className={styles.messageBox}>
                            <legend>Obrigado por cadastrar!</legend>
                            <p>{MensagemCadastro}</p>
                            <a className={styles.link} href='/login'>clique aqui para fazer o login</a>
                        </fieldset>
                    </div>
                </div>
            </div>
            <div className={styles.footer}>
                <Footer />
            </div>
        </div>
    );
};
export default PerfilValidar;
