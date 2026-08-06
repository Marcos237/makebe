import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";
import {
  hasValidTokenInLocalStorage,
  removeTokenFromLocalStorage,
} from "../config/ArmazenaToken";
import { UrlUsuarioLogado } from "../constants/Usuario/usuarioConstant";
import { buildRequestConfig } from "../services/shared/apiSecurityHeaders";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;

    const validarSessao = async () => {
      if (!hasValidTokenInLocalStorage()) {
        if (isMounted) {
          setIsAuthorized(false);
        }
        return;
      }

      try {
        const url = `${API_BASE_URL}${UrlUsuarioLogado}`;
        const config = buildRequestConfig(url);

        await axios.get(url, config);
        if (isMounted) {
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error(error);
        removeTokenFromLocalStorage();

        if (isMounted) {
          setIsAuthorized(false);
        }
      }
    };

    validarSessao();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (isAuthorized === false) {
    }
  }, [isAuthorized]);

  if (isAuthorized === null) {
    return null;
  }

  if (!isAuthorized) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
