import React, { useEffect } from 'react';

const VITRINE_URL = 'https://www.makebeapp.com.br/vitrine/';

const ExternalRedirect: React.FC = () => {
  useEffect(() => {
    window.location.replace(VITRINE_URL);
  }, []);

  return null;
};

export default ExternalRedirect;
