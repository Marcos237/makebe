import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { loginService } from "../services/loginService";

export const useLogout = () => {
    const navigate = useNavigate();
    const isCalled = useRef(false);

    useEffect(() => {
        if (!isCalled.current) {
            isCalled.current = true;
            const deslogar = async () => {
                await loginService.logout();
                navigate("/Home");
            };
            deslogar();
        }
    }, [navigate]);
};
