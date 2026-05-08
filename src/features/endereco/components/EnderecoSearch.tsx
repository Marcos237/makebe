import React, { useState } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Tooltip } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { FaFilter, FaSearch } from "react-icons/fa";
import Dropdown from "../../../components/dropdown";
import CampoTexto from "../../../components/textbox";
import { TipoUsuarioColaboradorId, TipoUsuarioLojaId } from "../../../constants/Usuario/usuarioConstant";
import { paginar } from "../../../functions/paginacao";
import { getSelectedItemByTipo } from "../../../functions/tipoSelectedFunction";
import { EnderecoItens } from "../../../Interfaces/Endereco/enderecoItens";
import { PaginacaoItens } from "../../../Interfaces/shared/PaginacaoItens";
import { PersistirItens } from "../../../Interfaces/shared/persistirItens";
import { buscarEnderecosPaginado } from "../services/enderecoService";
import styles from "./Endereco.module.css";

const EnderecoSearch: React.FC<{
    selectItens: Array<PersistirItens<EnderecoItens>>;
    tipoUsuarioId: string;
    page: number;
    onResultadosBusca: (resultados: PaginacaoItens<EnderecoItens>) => void;
}> = ({ selectItens, tipoUsuarioId, onResultadosBusca, page }) => {
    const [lojaIdBusca, setLojaBusca] = useState<number>();
    const [colaboradorId, setColaboradorId] = useState<number>();
    const [logradouro, setLogradouro] = useState<string>("");
    const [colaborador, setColaborador] = useState<string>("");
    const [loja, setLoja] = useState<string>("");
    const [mostrarFiltros, setMostrarFiltros] = useState(false);

    const colaboradorProps = selectItens.find((item) => item.name === "colaborador")?.selectItems ?? [];
    const lojaProps = selectItens.find((item) => item.name === "loja")?.selectItems ?? [];

    const handleSearch = async (event: React.FormEvent) => {
        event.preventDefault();
        const endereco: EnderecoItens = {
            logradouro: logradouro ?? "",
            lojaId: lojaIdBusca,
            nomeColaborador: tipoUsuarioId === TipoUsuarioColaboradorId ? colaborador ?? "" : "",
            razaoSocial: tipoUsuarioId === TipoUsuarioLojaId ? loja ?? "" : "",
            tipoUsuarioId: Number(tipoUsuarioId) ?? 0,
        };
        const paginacao = paginar(endereco, page);
        const enderecoService = await buscarEnderecosPaginado(paginacao ?? {});
        onResultadosBusca(enderecoService ?? {});
    };

    const handleButtonClick = () => {
        const fakeEvent = { preventDefault: () => { } } as React.FormEvent;
        handleSearch(fakeEvent);
        setMostrarFiltros(false);
    };

    const handleButtonClickLimpar = async () => {
        setLogradouro("");
        setColaborador("");
        if (tipoUsuarioId === TipoUsuarioLojaId) {
            setLojaBusca(0);
        }
        if (tipoUsuarioId === TipoUsuarioColaboradorId) {
            setColaboradorId(0);
        }

        const endereco: EnderecoItens = {
            tipoUsuarioId: Number(tipoUsuarioId),
        };
        const paginacao = paginar(endereco, 1);
        const enderecoService = await buscarEnderecosPaginado(paginacao ?? {});
        onResultadosBusca(enderecoService ?? {});
    };

    const handleDropdownChange = (e: SelectChangeEvent<string>, tipo: string) => {
        const selectedKey = e.target.value;
        const selectedItem = getSelectedItemByTipo(tipo, selectedKey, colaboradorProps, lojaProps);
        const selectedValue = selectedItem?.value || "";

        switch (tipo) {
            case "colaborador":
                setColaboradorId(Number(selectedKey));
                setColaborador(selectedValue);
                setLojaBusca(Number(0));
                setLoja("");
                break;
            case "loja":
                setLojaBusca(Number(selectedKey));
                setLoja(selectedValue);
                setColaboradorId(0);
                setColaborador("");
                break;
            default:
                return null;
        }
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
                            {tipoUsuarioId?.toString() === TipoUsuarioLojaId && (
                                <div className={styles.formItens}>
                                    <Dropdown
                                        dropProps={{
                                            name: "Loja",
                                            label: "Loja*",
                                            itens: lojaProps ?? [],
                                            selectedId: lojaIdBusca?.toString() || "",
                                            onChange: (e: SelectChangeEvent<string>) => handleDropdownChange(e, "loja"),
                                        }}
                                    />
                                </div>
                            )}
                            {tipoUsuarioId?.toString() === TipoUsuarioColaboradorId && (
                                <div className={styles.formItens}>
                                    <Dropdown
                                        dropProps={{
                                            name: "Colaborador",
                                            label: "Colaborador*",
                                            itens: colaboradorProps,
                                            selectedId: colaboradorId || "0",
                                            onChange: (e: SelectChangeEvent<string>) => handleDropdownChange(e, "colaborador"),
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        <div className={styles.separador}></div>

                        <div className={`${styles.coluna} ${styles.campos}`}>

                            <div className={styles.formItens}>
                                <CampoTexto
                                    textBoxProps={{
                                        name: "Logradouro",
                                        tooltip: "Digite seu logradouro",
                                        label: "Logradouro*",
                                        type: "text",
                                        value: logradouro,
                                        readonly: false,
                                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setLogradouro(e.target.value),
                                    }}
                                />
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

export default EnderecoSearch;
