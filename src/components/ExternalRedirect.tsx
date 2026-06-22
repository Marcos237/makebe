import React, { useEffect } from 'react';
import { buscarUsuarioLogadoHome } from '../features/home/services/homeService';

const VITRINE_URL = 'https://www.makebeapp.com.br/vitrine/';

const ExternalRedirect: React.FC = () => {
  useEffect(() => {
    const redirectToInitialUrl = async () => {
      const sessao = await buscarUsuarioLogadoHome();
      const usuarioLogado = sessao?.data;
      const hasSession = Boolean(usuarioLogado);
      const targetUrl = hasSession
        ? (
            usuarioLogado?.urlInicial ||
            usuarioLogado?.menus?.find(menu => menu.menuDescricao?.toLowerCase() === 'home')?.menuUrl ||
            VITRINE_URL
          )
        : VITRINE_URL;

      window.location.href = targetUrl;
    };

    redirectToInitialUrl();
  }, []);

  return null;
};

export default ExternalRedirect;
