import React, { useState } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Tooltip } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { FaFilter, FaSearch } from "react-icons/fa";
import Dropdown from "../../../components/dropdown";
import SwitchButton from "../../../components/switchButton";
import CampoTexto from "../../../components/textbox";
import { paginar } from "../../../functions/paginacao";
import { ColaboradorItens } from "../../../Interfaces/Colaborador/colaboradorItem";
import { PaginacaoItens } from "../../../Interfaces/shared/PaginacaoItens";
import { SelectItens } from "../../../Interfaces/shared/selectItens";
import { SwitchButtonItem } from "../../../Interfaces/shared/switchButtonItem";
import { cpfMaskConst } from "../../../utils/mascaras";
import { buscarColaboradoresPaginado } from "../services/colaboradorService";
import styles from "./Colaborador.module.css";

const ColaboradorSearch: React.FC<{
    selectItens: SelectItens[];
    onResultadosBusca: (resultados: PaginacaoItens<ColaboradorItens>) => void;
}> = ({ selectItens, onResultadosBusca }) => {
    const [nomeBusca, setNomeBusca] = useState<string>("");
    const [cpfBusca, setCpfBusca] = useState<string>("");
    const [emailBusca, setEmailBusca] = useState<string>("");
    const [permissaoIdBusca, setPermissaoIdBusca] = useState<string>("");
    const [statusBusca, setStatusBusca] = useState<boolean>(true);
    const [mostrarFiltros, setMostrarFiltros] = useState(false);

    const handleDropdownChange = (e: SelectChangeEvent<string>, tipo: string) => {
        if (tipo === "permissao") {
            setPermissaoIdBusca(e.target.value);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const colaborador: ColaboradorItens = {
            nome: nomeBusca || "",
            cpf: cpfBusca || "",
            email: emailBusca || "",
            permissaoId: permissaoIdBusca || "",
            status: statusBusca || false,
        };
        const paginacao = paginar(colaborador, 1);
        const colaboradorResponse = await buscarColaboradoresPaginado(paginacao);
        onResultadosBusca(colaboradorResponse ?? {});
    };

    const handleButtonClick = () => {
        const fakeEvent = { preventDefault: () => { } } as React.FormEvent;
        handleSubmit(fakeEvent);
        setMostrarFiltros(false);
    };

    const limparItens = () => {
        setNomeBusca("");
        setCpfBusca("");
        setEmailBusca("");
        setPermissaoIdBusca("");
        setStatusBusca(true);
    };

    const handleButtonClickLimpar = async () => {
        limparItens();
        const colaborador: ColaboradorItens = {
            nome: "",
            cpf: "",
            email: "",
            permissaoId: "",
            status: true,
        };
        const paginacao = paginar(colaborador, 1);
        const colaboradorService = await buscarColaboradoresPaginado(paginacao ?? {});
        onResultadosBusca(colaboradorService ?? {});
    };

    const switchButton: SwitchButtonItem = {
        label: "Status : ",
        checked: statusBusca,
        handleChange: () => setStatusBusca(!statusBusca),
    };

    return (
        <div className={styles.searchPanel}>
            <div className={`${styles.form}`}>
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
                                <CampoTexto
                                    textBoxProps={{
                                        name: "Nome",
                                        tooltip: "digite o nome",
                                        label: "nome*",
                                        value: nomeBusca,
                                        type: "text",
                                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setNomeBusca(e.target.value),
                                    }}
                                />
                            </div>
                            <div className={styles.formItens}>
                                <CampoTexto
                                    textBoxProps={{
                                        name: "CPF",
                                        tooltip: "digite o CPF",
                                        label: "CPF*",
                                        value: cpfBusca,
                                        type: "text",
                                        mask: cpfMaskConst,
                                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCpfBusca(e.target.value),
                                    }}
                                />
                            </div>
                            <div className={styles.formItens}>
                                <CampoTexto
                                    textBoxProps={{
                                        name: "Email",
                                        tooltip: "digite o Email",
                                        label: "Email*",
                                        value: emailBusca,
                                        type: "text",
                                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEmailBusca(e.target.value),
                                    }}
                                />
                            </div>
                        </div>

                        <div className={styles.separador}></div>

                        <div className={`${styles.coluna} ${styles.campos}`}>
                            <div className={styles.formItens}>
                                <Dropdown
                                    dropProps={{
                                        name: "Permissao",
                                        label: "Permissão*",
                                        itens: selectItens ?? [],
                                        selectedId: permissaoIdBusca || "",
                                        onChange: (e: SelectChangeEvent<string>) => handleDropdownChange(e, "permissao"),
                                    }}
                                />
                            </div>
                            <div className={styles.switchWrapper}>
                                <SwitchButton switchProps={switchButton} />
                            </div>
                            <div className={styles.searchActions}>
                                <button onClick={handleButtonClick} className={styles.searchButton}>
                                    <Tooltip title="buscar">
                                        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                            <FaSearch />
                                        </span>
                                    </Tooltip>
                                </button>
                                <button onClick={handleButtonClickLimpar} className={styles.clearButton}>
                                    <Tooltip title="limpar">
                                        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                            <RefreshIcon />
                                        </span>
                                    </Tooltip>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ColaboradorSearch;
