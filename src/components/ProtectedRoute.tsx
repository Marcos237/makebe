import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";
import {
  getTokenFromLocalStorage,
  hasValidTokenInLocalStorage,
  removeTokenFromLocalStorage,
} from "../config/ArmazenaToken";
import { UrlUsuarioLogado } from "../constants/Usuario/usuarioConstant";
import ExternalRedirect from "./ExternalRedirect";

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
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
        const token = getTokenFromLocalStorage();
        await axios.get(`${API_BASE_URL}${UrlUsuarioLogado}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (isMounted) {
          setIsAuthorized(true);
        }
      } catch {
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

  if (isAuthorized === null) {
    return null;
  }

  if (!isAuthorized) {
    return <ExternalRedirect />;
  }

  return children;
};

export default ProtectedRoute;
