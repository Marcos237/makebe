import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { useParams } from "react-router-dom";
import {
    propertyLabels,
    TipoCliente,
    TipoColaborador,
} from "../../../constants/Colaborador/colaboradorConstant";
import { mapToSelectItens } from "../../../functions/mapToSelectItens";
import { paginar } from "../../../functions/paginacao";
import { useHiddenItem } from "../../../hooks/useHiddenItem";
import useFetchTipo from "../../../hooks/useFetchTipo";
import useUpdateFetch from "../../../hooks/useUpdateFetch";
import useUpdateGrid from "../../../hooks/useUpdateGrid";
import { ColaboradorItens } from "../../../Interfaces/Colaborador/colaboradorItem";
import { GrigViewItens } from "../../../Interfaces/shared/gridviewItens";
import { PaginacaoItens } from "../../../Interfaces/shared/PaginacaoItens";
import { PersistirItens } from "../../../Interfaces/shared/persistirItens";
import { UsuarioLoginItens } from "../../../Interfaces/Usuario/UsuarioLoginItens";
import {
    buscarColaboradorPorUsuarioId,
    buscarColaboradoresPaginado,
    buscarPermissoesColaborador,
    buscarUsuarioLogadoColaborador,
} from "../services/colaboradorService";

export const useColaboradorPage = () => {
    const [colaboradorItem, setColaborador] = useState<ColaboradorItens>();
    const [usuarioLogado, setUsuarioLogado] = useState<UsuarioLoginItens>();
    const [persistirItens, setPersistirItens] = useState<PersistirItens<ColaboradorItens>>();
    const [resultadosBusca, setResultadosBusca] = useState<PaginacaoItens<ColaboradorItens>>();
    const [gridViewItens, setGridView] = useState<GrigViewItens<ColaboradorItens>>();
    const [readOnly, setReadOnly] = useState<boolean>(false);
    const [isHiddenItem, setIsHiddenItem] = useState(false);
    const ultimaPaginacaoRef = useRef<PaginacaoItens<ColaboradorItens>>();
    const { urlParametro } = useParams();

    const tipoItem = urlParametro === "CadastroCliente" ? TipoCliente : urlParametro === "CadastroColaborador" ? TipoColaborador : 0;

    useEffect(() => {
        if (tipoItem === "3") {
            setIsHiddenItem(true);
        }
    }, [tipoItem]);

    useHiddenItem("persistir", "lista", isHiddenItem);

    const fetchColaboradorData = useCallback(async (tipoUsuario?: string, page: number = 1) => {
        const colaboradorDefault: ColaboradorItens = {
            id: "",
            usuarioId: "",
            nome: "",
            cpf: "",
            email: "",
            telefone: "",
            permissaoId: "",
            descricaoPermissao: "",
            nomeImagem: "",
            urlImagem: "",
            status: true,
            instagram: "",
            descricaoStatus: "",
            tipo: Number(tipoUsuario),
        };

        const basePaginacao = ultimaPaginacaoRef.current ?? resultadosBusca;
        const paginacao = paginar(basePaginacao, page);

        paginacao.objetoPesquisa = basePaginacao?.objetoPesquisa ?? colaboradorDefault;
        paginacao.objetos = [];

        if (paginacao.objetoPesquisa) {
            paginacao.objetoPesquisa.tipo = Number(tipoUsuario);
        }

        ultimaPaginacaoRef.current = paginacao;

        const colaboradorReponse = await buscarColaboradoresPaginado(paginacao);
        if (colaboradorReponse) {
            setResultadosBusca(colaboradorReponse);
        }
    }, [resultadosBusca]);

    const usuarioData = useCallback(async () => {
        const sessao = await buscarUsuarioLogadoColaborador();
        setUsuarioLogado(sessao);
    }, []);

    const handleSaveSuccess = useCallback(() => {
        setPersistirItens((prev) => ({
            ...prev,
            isSave: true,
        }));
        setIsHiddenItem(false);
        setReadOnly(false);
    }, []);

    const fetchPermissaoData = useCallback(async () => {
        const permissaoResponse = await buscarPermissoesColaborador();
        const itensSelect = mapToSelectItens(permissaoResponse?.datas, "id", "descricao");

        const persistirProps: PersistirItens<ColaboradorItens> = {
            selectItems: itensSelect,
            onSave: handleSaveSuccess,
        };

        setPersistirItens(persistirProps);
    }, [handleSaveSuccess]);

    const handleScrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleButtonClickSalvar = () => {
        setIsHiddenItem(true);
    };

    const handleButtonClickListar = () => {
        setIsHiddenItem(false);
    };

    const handleUpdateClick = useCallback(async (event: React.MouseEvent, colaborador?: ColaboradorItens) => {
        event.preventDefault();

        const colaboradorId = colaborador?.usuarioId ?? "";
        const retorno = await buscarColaboradorPorUsuarioId(colaboradorId);
        setColaborador(retorno?.data ?? undefined);
        handleScrollToTop();
        handleButtonClickSalvar();
        setReadOnly(true);
    }, []);

    const actionButtons = useMemo(() => ([
        {
            id: 1,
            label: "Edit",
            icon: React.createElement(EditRoundedIcon),
            href: "#",
            class: "btn-busca",
            onClick: handleUpdateClick,
        },
    ]), [handleUpdateClick]);

    const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, page: number) => {
        fetchColaboradorData(tipoItem.toString(), page);
    }, [fetchColaboradorData, tipoItem]);

    const gridViewItensMemo = useMemo(() => {
        if (resultadosBusca) {
            return {
                paginacao: resultadosBusca,
                propertyLabels,
                actionButtons,
                onPageChange: handlePageChange,
            } as GrigViewItens<ColaboradorItens>;
        }

        return undefined;
    }, [resultadosBusca, actionButtons, handlePageChange]);

    useUpdateFetch([() => usuarioData(), () => fetchPermissaoData(), () => fetchColaboradorData(tipoItem.toString())], [tipoItem]);
    useFetchTipo(urlParametro ?? "", [() => fetchColaboradorData(tipoItem.toString())], TipoCliente, TipoColaborador);

    useUpdateGrid(gridViewItensMemo, setGridView, [persistirItens], () => {
        if (persistirItens?.isSave) {
            setPersistirItens((prev) => ({
                ...prev,
                isSave: false,
            }));
            fetchColaboradorData(tipoItem.toString());
        }
    });

    const handleResultadosBusca = (resultados: PaginacaoItens<ColaboradorItens>) => {
        ultimaPaginacaoRef.current = paginar(resultados, resultados?.paginaAtual ?? 1);
        ultimaPaginacaoRef.current.objetoPesquisa = resultados?.objetoPesquisa;
        ultimaPaginacaoRef.current.objetos = [];
        setResultadosBusca(resultados);
    };

    return {
        colaboradorItem,
        gridViewItens,
        handleButtonClickListar,
        handleButtonClickSalvar,
        handleResultadosBusca,
        persistirItens,
        readOnly,
        tipoItem,
        usuarioLogado,
    };
};
