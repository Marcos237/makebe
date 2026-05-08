import React from 'react';
import Banner from '../../components/banner';
import Footer from '../../components/footer';
import { MensagemCadastro } from '../../constants/Usuario/usuarioConstant';
import { Grid } from '@mui/material';
import '../../assets/styles/Perfil/perfilValidar.css'

const PerfilValidar: React.FC = () => {
    return <>
        <div className='banner'>
            <Banner />
        </div>

        <div className="form-persitir form-custom">
            <Grid container spacing={2} className="ContainerGrid grid-custom">
                <div className="conteudo">
                    <fieldset
                        className={'icone-box icone-box-form expandido'}>
                        <legend>Obrigado por cadastrar!</legend>

                        <p>{MensagemCadastro}</p>
                        <a className='link' href='/login'> clique aqui para fazer o login</a>
                    </fieldset>
                </div>
            </Grid>
        </div>
        <div>
            <Footer />
        </div>
    </>

}

export default PerfilValidar;