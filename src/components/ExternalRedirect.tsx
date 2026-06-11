import React, { useEffect } from 'react';
import { buscarUsuarioLogadoHome } from '../features/home/services/homeService';

const ExternalRedirect: React.FC = () => {
  useEffect(() => {
    const redirectToInitialUrl = async () => {
      const sessao = await buscarUsuarioLogadoHome();
      const usuarioLogado = sessao?.data;
      const targetUrl =
        usuarioLogado?.urlInicial ||
        usuarioLogado?.menus?.find(menu => menu.menuDescricao?.toLowerCase() === 'home')?.menuUrl ||
        '/vitrine';

      window.location.href = targetUrl;
    };

    redirectToInitialUrl();
  }, []);

  return null;
};

export default ExternalRedirect;
