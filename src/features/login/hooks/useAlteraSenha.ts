import { useCallback, useEffect, useState } from "react";
import { EnvioItemText } from "../../../constants/Usuario/autenticacaoConstant";
import { useFormErros } from "../../../hooks/useFormErros";
import { ErroItem } from "../../../Interfaces/shared/erroItem";
import { UsuarioLoginItens } from "../../../Interfaces/Usuario/UsuarioLoginItens";
import { EsqueciSenhaItens } from "../types";
import { loginService } from "../services/loginService";

export const useAlteraSenha = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [value, setValue] = useState<string>("");
    const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
    const [isVisibleLogin, setIsVisibleLogin] = useState(false);
    const [isEnviaText, setIsEnviaText] = useState(true);
    const [usuarioLogado, setUsuarioLogado] = useState<UsuarioLoginItens>();
    const [isDiseble, setIsDiseble] = useState<boolean>();
    const [isEnviado, setIsEnviado] = useState<boolean>();
    const [erros, setErros] = useState<ErroItem[]>([]);
    const [erroTrigger, setErroTrigger] = useState(0);

    useFormErros(erros, erroTrigger);

    const fetchData = useCallback(async () => {
        const sessao = await loginService.getUsuarioLogado();
        setUsuarioLogado(sessao);
        if (isEnviado) {
            setIsLoading(false);
            setIsDiseble(true);
        }
    }, [isEnviado]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleRecaptchaChange = (recaptcha: string | null) => {
        setRecaptchaValue(recaptcha);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        const reenviaItens: EsqueciSenhaItens = {
            usuarioId: "",
            value,
            recaptcha: recaptchaValue ?? "",
        };
        const response = await loginService.solicitarAlteracaoSenha(reenviaItens);
        if (response?.notifications && response.notifications.length > 0) {
            setIsVisibleLogin(false);
            const errosConvertidos: ErroItem[] = response.notifications.map((n: any) => ({
                Key: "CPFEmail",
                Mensagem: n.notificationProps?.Message ?? "",
            }));
            setErros(errosConvertidos);
            setErroTrigger((prev) => prev + 1);
            setValue("");
        } else {
            setIsEnviado(true);
            setValue("");
            setIsEnviaText(false);
            setIsVisibleLogin(true);
        }

        setIsLoading(false);
    };

    const handleFormKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
        if (event.key === "Enter") {
            handleSubmit(event);
        }
    };

    return {
        envioItemText: EnvioItemText,
        handleFormKeyDown,
        handleRecaptchaChange,
        handleSubmit,
        isDiseble,
        isEnviaText,
        isLoading,
        isVisibleLogin,
        setValue,
        usuarioLogado,
        value,
    };
};
