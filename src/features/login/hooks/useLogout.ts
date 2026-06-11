import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { loginService } from "../services/loginService";
import { removeTokenFromLocalStorage } from "../../../config/ArmazenaToken";

export const useLogout = () => {
    const navigate = useNavigate();
    const isCalled = useRef(false);

    useEffect(() => {
        if (!isCalled.current) {
            isCalled.current = true;
            const deslogar = async () => {
                await loginService.logout();
                removeTokenFromLocalStorage();
                navigate("/");
            };
            deslogar();
        }
    }, [navigate]);
};
