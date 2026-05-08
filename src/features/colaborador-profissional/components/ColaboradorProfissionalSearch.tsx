import React, { useState } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Tooltip } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { FaFilter, FaSearch } from "react-icons/fa";
import Dropdown from "../../../components/dropdown";
import CampoTexto from "../../../components/textbox";
import { paginar } from "../../../functions/paginacao";
import { ColaboradorProfissionalItem } from "../../../Interfaces/ColaboradorProfissional/colaboradorProfissionalItem";
import { PaginacaoItens } from "../../../Interfaces/shared/PaginacaoItens";
import { PersistirItens } from "../../../Interfaces/shared/persistirItens";
import { buscarColaboradoresProfissionaisPaginado } from "../services/colaboradorProfissionalService";
import styles from "./ColaboradorProfissional.module.css";

const ColaboradorProfissionalSearch: React.FC<{
    selectItens: Array<PersistirItens<ColaboradorProfissionalItem>>;
    onResultadosBusca: (resultados: PaginacaoItens<ColaboradorProfissionalItem>) => void;
}> = ({ selectItens, onResultadosBusca }) => {
    const [idcolaboradorBusca, setIdcolaboradorBusca] = useState<number>(0);
    const [idLojaBusca, setIdLojaBusca] = useState<number>(0);
    const [idServicoBusca, setServicoBusca] = useState<number>(0);
    const [colaborador, setColaborador] = useState<string>("");
    const [loja, setLoja] = useState<string>("");
    const [servico, setServico] = useState<string>("");
    const [descricaoBusca, setDescricaoBusca] = useState<string>("");
    const [mostrarFiltros, setMostrarFiltros] = useState(false);

    const colaboradorProps = selectItens.find((item) => item.name === "colaborador")?.selectItems ?? [];
    const lojaProps = selectItens.find((item) => item.name === "loja")?.selectItems ?? [];
    const servicoProps = selectItens.find((item) => item.name === "servico")?.selectItems ?? [];

    const getSelectedItemByTipo = (tipo: string, selectedKey: string) => {
        switch (tipo) {
            case "colaborador":
                return colaboradorProps.find((item) => item.key === selectedKey);
            case "loja":
                return lojaProps.find((item) => item.key === selectedKey);
            case "servico":
                return servicoProps.find((item) => item.key === selectedKey);
            default:
                return null;
        }
    };

    const handleDropdownChange = (e: SelectChangeEvent<string>, tipo: string) => {
        const selectedKey = e.target.value;
        const selectedItem = getSelectedItemByTipo(tipo, selectedKey);
        const selectedValue = selectedItem?.value || "";

        switch (tipo) {
            case "colaborador":
                setIdcolaboradorBusca(Number(selectedKey));
                setColaborador(selectedValue);
                break;
            case "loja":
                setIdLojaBusca(Number(selectedKey));
                setLoja(selectedValue);
                break;
            case "servico":
                setServicoBusca(Number(selectedKey));
                setServico(selectedValue);
                break;
            default:
                return null;
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const colaboradorProfissional: ColaboradorProfissionalItem = {
            nomeColaborador: colaborador ?? "",
            razaoSocial: loja ?? "",
            descricaoServico: servico ?? "",
            descricao: descricaoBusca ?? "",
        };
        const paginacao = paginar(colaboradorProfissional, 1);
        const colaboradorProfissionalResponse = await buscarColaboradoresProfissionaisPaginado(paginacao);
        onResultadosBusca(colaboradorProfissionalResponse ?? {});
    };

    const handleButtonClick = () => {
        const fakeEvent = { preventDefault: () => { } } as React.FormEvent;
        handleSubmit(fakeEvent);
        setMostrarFiltros(false);
    };

    const limparItens = () => {
        setIdcolaboradorBusca(0);
        setIdLojaBusca(0);
        setServicoBusca(0);
        setDescricaoBusca("");
        setColaborador("");
        setLoja("");
        setServico("");
    };

    const handleButtonClickLimpar = async () => {
        limparItens();
        const colaboradorProfissional: ColaboradorProfissionalItem = {};
        const paginacao = paginar(colaboradorProfissional, 1);
        const colaboradorService = await buscarColaboradoresProfissionaisPaginado(paginacao ?? {});
        onResultadosBusca(colaboradorService ?? {});
        setMostrarFiltros(false);
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
                                <Dropdown
                                    dropProps={{
                                        name: "Colaborador",
                                        label: "Colaborador*",
                                        itens: colaboradorProps,
                                        selectedId: idcolaboradorBusca || "0",
                                        onChange: (e: SelectChangeEvent<string>) => handleDropdownChange(e, "colaborador"),
                                    }}
                                />
                            </div>
                            <div className={styles.formItens}>
                                <Dropdown
                                    dropProps={{
                                        name: "Loja",
                                        label: "Loja*",
                                        itens: lojaProps,
                                        selectedId: idLojaBusca || "0",
                                        onChange: (e: SelectChangeEvent<string>) => handleDropdownChange(e, "loja"),
                                    }}
                                />
                            </div>
                        </div>

                        <div className={styles.separador}></div>

                        <div className={`${styles.coluna} ${styles.campos}`}>
                            <div className={styles.formItens}>
                                <Dropdown
                                    dropProps={{
                                        name: "Servico",
                                        label: "Serviço*",
                                        itens: servicoProps,
                                        selectedId: idServicoBusca || "0",
                                        onChange: (e: SelectChangeEvent<string>) => handleDropdownChange(e, "servico"),
                                    }}
                                />
                            </div>
                            <div className={styles.formItens}>
                                <CampoTexto
                                    textBoxProps={{
                                        name: "Descricao",
                                        tooltip: "Descrição",
                                        label: "Descrição",
                                        value: descricaoBusca,
                                        type: "text",
                                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setDescricaoBusca(e.target.value),
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

export default ColaboradorProfissionalSearch;
