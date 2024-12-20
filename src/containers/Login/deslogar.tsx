import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DeslogarService } from '../../services/Login/deslogarService';

const Deslogar: React.FC = () => {
    const navigate = useNavigate();
    const isCalled = useRef(false);

    useEffect(() => {
        if (!isCalled.current) {
            isCalled.current = true;
            const deslogar = async () => {
                    await DeslogarService();
                    navigate('/Home');
            };
            deslogar();
        }
    }, [navigate]);

    return null;
};

export default Deslogar;
