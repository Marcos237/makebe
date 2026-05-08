import { useEffect, useState } from "react";
import { UsuarioLoginItens } from "../../../Interfaces/Usuario/UsuarioLoginItens";
import { buscarUsuarioLogadoHome } from "../services/homeService";

export const useHome = () => {
    const [usuarioLogado, setUsuarioLogado] = useState<UsuarioLoginItens>();

    useEffect(() => {
        const fetchVitrineData = async () => {
            const sessao = await buscarUsuarioLogadoHome();
            setUsuarioLogado(sessao);
        };

        fetchVitrineData();
    }, []);

    return { usuarioLogado };
};
