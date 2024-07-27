import React, { useEffect, useState } from 'react';
import { MensagemItens } from '../Interfaces/Mensagens/MensagemItens';
import '../assets/styles/shared/mensagem.css';

const Mensagem: React.FC<{ mensagemProps: MensagemItens }> = ({ mensagemProps }) => {
    const { texto, cor, isVisible, onClick } = mensagemProps;
    const [visible, setVisible] = useState(isVisible);
    const estiloDoFundo = cor ? { backgroundColor: cor } : {};
    useEffect(() => {
        setVisible(isVisible);
        if (!isVisible) {
            const timer = setTimeout(() => setVisible(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [isVisible]);


    return (
        <>
            {texto && (
                <div
                    className={`mensagemRetorno ${visible ? 'visible' : ''}`}
                    style={estiloDoFundo}
                >
                    <span className='close' onClick={onClick}> x </span>
                    {texto.split('\n').map((line, index) => (
                        <div key={index}><div className='texto'>{line}</div></div>
                    ))}
                </div>
            )}
        </>
    );
};

export default Mensagem;
