import React, { useState, useEffect } from 'react';
import Banner from '../../components/banner';
import Carroussel from '../../components/slider';
import Footer from '../../components/footer';
import { Box, Grid } from '@mui/material';
import { GetAllService } from '../../services/shared/getAllService';
import { API_BASE_URL } from '../../config/apiConfig';
import { UrlUsuarioLogado } from '../../constants/Usuario/usuarioConstant';
import { UsuarioLoginItens } from '../../Interfaces/Usuario/UsuarioLoginItens';
import { ResponseItem } from '../../Interfaces/shared/ResponseItem';

import '../../assets/styles/Conteudo/conteudo.css';

const Home: React.FC = () => {

  const [useUsuarioLogado, setUsuarioLogado] = useState<UsuarioLoginItens>();


  const fetchVitrineData = async () => {
    const [sessao] = await Promise.all([
      GetAllService(`${API_BASE_URL}${UrlUsuarioLogado}`) as ResponseItem<UsuarioLoginItens>
    ]);

    setUsuarioLogado(sessao);
  };

  useEffect(() => {
    fetchVitrineData();
  }, []);

  return (
    <>
      <div className='banner'>
        <Banner usuarioLogado={useUsuarioLogado} />
      </div>
      <div>
        <Carroussel />
      </div>
      <div>
        <Box className='conteudo'>
          <Grid container spacing={2} className='gridConteudo' >
            <Grid item xs={6} className='lado-direito'>
              <div className='conteudo-direito'>
                <h2>direito</h2>
                {/* <p>{useVritrine?.descricao}</p> */}
              </div>
            </Grid>
            <Grid item xs={6} className='lado-esquerdo'>
              <div className='conteudo-esquerdo'>
                <h2>esquerdo</h2>
              </div>
            </Grid>
          </Grid>
        </Box>
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
};

export default Home;
