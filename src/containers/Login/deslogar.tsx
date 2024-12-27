import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config/apiConfig';
import { GetAllService } from '../../services/shared/getAllService';
import { UrlDeslogar } from '../../constants/login/loginConstant';

const Deslogar: React.FC = () => {
    const navigate = useNavigate();
    const isCalled = useRef(false);

    useEffect(() => {
        if (!isCalled.current) {
            isCalled.current = true;
            const deslogar = async () => {
                    await GetAllService(`${API_BASE_URL}${UrlDeslogar}`);
                    navigate('/Home');
            };
            deslogar();
        }
    }, [navigate]);

    return null;
};

export default Deslogar;
