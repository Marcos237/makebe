import React, { useState } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Tooltip } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { FaFilter, FaSearch } from "react-icons/fa";
import Dropdown from "../../../components/dropdown";
import CampoTexto from "../../../components/textbox";
import { paginar } from "../../../functions/paginacao";
import { LojaItens } from "../../../Interfaces/Loja/lojaItens";
import { PaginacaoItens } from "../../../Interfaces/shared/PaginacaoItens";
import { SelectItens } from "../../../Interfaces/shared/selectItens";
import { cnpjMaskConst } from "../../../utils/mascaras";
import { buscarLojasPaginado } from "../services/lojaService";
import styles from "./Loja.module.css";

const LojaSearch: React.FC<{ selectItens: SelectItens[]; onResultadosBusca: (resultados: PaginacaoItens<LojaItens>) => void }> = ({ selectItens, onResultadosBusca }) => {
    const [tipoLojaIdBusca, setTipoLojaBusca] = useState<number>(0);
    const [razaoSocialBusca, setRazaoSocialBusca] = useState<string>("");
    const [cnpjBusca, setCnpjBusca] = useState<string>("");
    const [emailBusca, setEmailBusca] = useState<string>("");
    const [telefoneBusca, setTelefoneBusca] = useState<string>("");
    const [mostrarFiltros, setMostrarFiltros] = useState(false);

    const descerTela = (valor: number) => window.scrollTo({ top: valor, behavior: "smooth" });

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const loja: LojaItens = {
            razaoSocial: razaoSocialBusca || "",
            cnpj: cnpjBusca || "",
            telefone: telefoneBusca || "",
            email: emailBusca || "",
            tipoLojaId: Number(tipoLojaIdBusca) || 0,
        };
        const paginacao: PaginacaoItens<LojaItens> = { quantidadePagina: 6, paginaAtual: 1, totalPaginas: 1, total: 0, objetoPesquisa: loja, objetos: [] };
        const lojaResponse = await buscarLojasPaginado(paginacao);
        onResultadosBusca(lojaResponse ?? {});
    };

    const handleButtonClick = () => {
        const fakeEvent = { preventDefault: () => { } } as React.FormEvent;
        descerTela(820);
        handleSubmit(fakeEvent);
        setMostrarFiltros(false);
    };

    const handleButtonClickLimpar = async () => {
        setRazaoSocialBusca("");
        setCnpjBusca("");
        setTelefoneBusca("");
        setEmailBusca("");
        setTipoLojaBusca(0);
        const paginacao = paginar({} as LojaItens, 1);
        const lojaResponseItem = await buscarLojasPaginado(paginacao ?? {});
        onResultadosBusca(lojaResponseItem ?? {});
        descerTela(120);
    };

    return (
        <div className={styles.searchPanel}>
            <div className={styles.form}>
                <div className={styles.formActions}>
                    <button type="button" className={styles.filterButton} onClick={() => setMostrarFiltros((prev) => !prev)}>
                        <Tooltip title="Filtros">
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                <FaFilter />
                            </span>
                        </Tooltip>
                    </button>
                </div>

                {mostrarFiltros && (
                    <div className={styles.camposLayout}>
                        <div className={`${styles.coluna} ${styles.campos}`}>
                            <div className={styles.formItens}>
                                <CampoTexto textBoxProps={{ name: "RazÃ£o Social", tooltip: "digite a razão social", label: "razão social*", value: razaoSocialBusca, type: "text", onChange: (e: React.ChangeEvent<HTMLInputElement>) => setRazaoSocialBusca(e.target.value) }} />
                            </div>
                            <div className={styles.formItens}>
                                <CampoTexto textBoxProps={{ name: "CNPJ", tooltip: "digite seu cnpj", label: "cnpj*", value: cnpjBusca, type: "text", mask: cnpjMaskConst, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCnpjBusca(e.target.value) }} />
                            </div>
                            <div className={styles.formItens}>
                                <CampoTexto textBoxProps={{ name: "Email", tooltip: "digite seu email", label: "email*", value: emailBusca, type: "email", onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEmailBusca(e.target.value) }} />
                            </div>
                        </div>

                        <div className={styles.separador}></div>

                        <div className={`${styles.coluna} ${styles.campos}`}>
                            <div className={styles.formItens}>
                                <CampoTexto textBoxProps={{ name: "Telefone", tooltip: "digite seu telefone", label: "telefone*", value: telefoneBusca, type: "text", onChange: (e: React.ChangeEvent<HTMLInputElement>) => setTelefoneBusca(e.target.value) }} />
                            </div>
                            <div className={styles.formItens}>
                                <Dropdown dropProps={{ name: "TipoLoja", itens: selectItens, label: "Tipo de Loja*", selectedId: tipoLojaIdBusca?.toString() || "", onChange: (e: SelectChangeEvent<string>) => setTipoLojaBusca(Number(e.target.value)) }} />
                            </div>
                            <div className={styles.searchActions}>
                                <button onClick={handleButtonClick} className={styles.searchButton}>
                                    <Tooltip title="buscar"><span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><FaSearch /></span></Tooltip>
                                </button>
                                <button onClick={handleButtonClickLimpar} className={styles.clearButton}>
                                    <Tooltip title="limpar"><span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><RefreshIcon /></span></Tooltip>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LojaSearch;
