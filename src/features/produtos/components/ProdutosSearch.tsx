import React, { useState } from "react";
import { PaginacaoItens } from "../../../Interfaces/shared/PaginacaoItens";
import { ServicosItens } from "../../../Interfaces/Produto/servicosItens";
import { GetPaginadoService } from "../../../services/shared/getPaginadoService";
import { API_BASE_AGENDA_URL } from "../../../config/apiConfig";
import { UrlBuscarPaginado } from "../../../constants/Servicos/servicoConstant";
import { paginar } from "../../../functions/paginacao";
import { moneyMaskConst } from "../../../utils/mascaras";
import { PeriodoServico } from "../../../constants/Servicos/servicoConstant";
import { Tooltip } from "@mui/material";
import { FaFilter, FaSearch } from "react-icons/fa";
import CampoTexto from "../../../components/textbox";
import RefreshIcon from "@mui/icons-material/Refresh";
import HoraPicker from "../../../components/horaPicker";
import styles from "./Produtos.module.css";

const ServicoBusca: React.FC<{
    onResultadosBusca: (
        resultados: PaginacaoItens<ServicosItens>) => void
}> = ({ onResultadosBusca }) => {
    const [descricaoBusca, setDescricaoBusca] = useState<string>("");
    const [periodoBusca, setPeriodo] = useState<number>(0);
    const [valorBusca, setValor] = useState<number>(0);
    const [mostrarFiltros, setMostrarFiltros] = useState(false);

    const handleButtonClick = () => {
        const fakeEvent = {
            preventDefault: () => { }
        } as React.FormEvent;
        handleSubmit(fakeEvent);
        setMostrarFiltros(false);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const colaborador: ServicosItens = {
            descricao: descricaoBusca || "",
            valor: valorBusca ?? 0,
            periodo: periodoBusca ?? 0
        };
        const paginacao = paginar(colaborador, 1);
        const colaboradorResponse = await GetPaginadoService(paginacao, `${API_BASE_AGENDA_URL}${UrlBuscarPaginado}`);
        onResultadosBusca(colaboradorResponse ?? {});
    };

    const handleButtonClickLimpar = async () => {
        limparItens();
        const servico: ServicosItens = {
            descricao: "",
        };
        const paginacao = paginar(servico, 1);
        const colaboradorService = await GetPaginadoService(paginacao ?? {}, `${API_BASE_AGENDA_URL}${UrlBuscarPaginado}`);
        onResultadosBusca(colaboradorService ?? {});
        setMostrarFiltros(false);
    };

    const limparItens = () => {
        setDescricaoBusca("");
        setPeriodo(0);
        setValor(0);
    };

    const handlePeriodoChange = (valor: number) => {
        setPeriodo(valor);
    };

    return (
        <div className={styles.searchPanel}>
            <div className={styles.form}>
                <div className={styles.formActions}>
                    <button type="button" className={styles.filterButton} onClick={() => setMostrarFiltros(prev => !prev)}>
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
                                        name: "Descrição",
                                        tooltip: "digite a Descrição",
                                        label: "Descrição*",
                                        value: descricaoBusca,
                                        type: "text",
                                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setDescricaoBusca(e.target.value)
                                    }}
                                />
                            </div>

                            <div className={styles.formItens}>
                                <CampoTexto
                                    textBoxProps={{
                                        name: "Valor",
                                        tooltip: "Digite o valor",
                                        label: "Valor",
                                        value: moneyMaskConst(valorBusca),
                                        type: "text",
                                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                                            const rawValue = e.target.value.replace(/\D/g, "");
                                            setValor(rawValue === "" ? 0 : Number(rawValue) / 100);
                                        },
                                    }}
                                />
                            </div>
                        </div>

                        <div className={styles.separador}></div>

                        <div className={`${styles.coluna} ${styles.campos}`}>
                            <div className={styles.formItens}>
                                <HoraPicker
                                    label={PeriodoServico}
                                    value={periodoBusca}
                                    onChange={handlePeriodoChange}
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

export default ServicoBusca;
