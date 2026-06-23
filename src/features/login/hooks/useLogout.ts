import { useEffect, useRef } from "react";
import { loginService } from "../services/loginService";
import { removeTokenFromLocalStorage } from "../../../config/ArmazenaToken";

export const useLogout = () => {
    const isCalled = useRef(false);

    useEffect(() => {
        if (!isCalled.current) {
            isCalled.current = true;
            const deslogar = async () => {
                await loginService.logout();
                removeTokenFromLocalStorage();
            };
            deslogar();
        }
    }, []);
};
