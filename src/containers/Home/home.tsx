import React, { useState, useEffect } from 'react';
import Banner from '../../components/banner';
import Carroussel from '../../components/slider';
import Footer from '../../components/footer';
import { Box, Grid } from '@mui/material';
import { UsuarioLogadoService } from '../../services/Perfil/usuarioLogadoService';
import { UsuarioLogadoItens } from '../../Interfaces/Usuario/UsuarioLogadoItens';
import { VitrineService } from '../../services/Vitrine/vitrineService';
import { VitrineItem } from '../../Interfaces/Vitrine/vitrineItem';


import '../../assets/styles/Conteudo/conteudo.css';

const Home: React.FC = () => {
  const [useVritrine, setVitrine] = useState<VitrineItem>();
  const [useUsuarioLogado, setUsuarioLogado] = useState<UsuarioLogadoItens>();


  const fetchVitrineData = async () => {
      const data = await VitrineService();
      setVitrine(data); 
      const sessao = await UsuarioLogadoService();
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
                <p>{useVritrine?.descricao}</p>
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
