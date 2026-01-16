import React from 'react';
import '../assets/styles/shared/icone.css';

import { IconeItens } from '../Interfaces/Icone/icone';

const Icone: React.FC<{ iconeProps: IconeItens }> = ({ iconeProps }) => {
  const { icone, dialogo, cor } = iconeProps;

  return (
    <div className="placeholder">
      {icone && (
        <span className="icone" style={{ color: cor }}>
          {icone}
        </span>
      )}
      {dialogo && <div className="dialog-box">{dialogo}</div>}
    </div>
  );
};

export default Icone;
