import React, { useState } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Tooltip } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import dayjs from "dayjs";
import { FaFilter, FaSearch, FaTrash } from "react-icons/fa";
import DateTimerPicker from "../../../components/dateTimerPicker";
import Dropdown from "../../../components/dropdown";
import IconButton from '@mui/material/IconButton';
import {
    DataLabelAgendaAberta,
    DataLabelAgendaFechada,
    DataLabelBloqueioAberto,
    DataLabelBloqueioFechado,
    TipoColaborador,
    TipoLoja,
} from "../../../constants/Agenda/agendaConstant";
import { TipoUsuarioColaboradorId, TipoUsuarioLojaId } from "../../../constants/Usuario/usuarioConstant";
import { formatarHoraComData } from "../../../functions/formatDataHora";
import { paginar } from "../../../functions/paginacao";
import { getSelectedItemByTipo } from "../../../functions/tipoSelectedFunction";
import { AgendaItens } from "../../../Interfaces/Agenda/AgendaItens";
import { PaginacaoItens } from "../../../Interfaces/shared/PaginacaoItens";
import { PersistirItens } from "../../../Interfaces/shared/persistirItens";
import { buscarAgendaPaginada } from "../services/agendaService";
import styles from "./Agenda.module.css";

const AgendaSearch: React.FC<{
    selectItens: Array<PersistirItens<AgendaItens>>;
    tipoItem: number;
    page: number;
    onResultadosBusca: (resultados: PaginacaoItens<AgendaItens>) => void;
}> = ({ selectItens, tipoItem, onResultadosBusca, page }) => {
    const [idLoja, setLojaId] = useState<number>();
    const [idColaborador, setColaboradorId] = useState<number>();
    const [colaborador, setColaborador] = useState<string>("");
    const [idAgendaSemanaInicio, setAgendaSemanaInicio] = useState<number>(0);
    const [idAgendaSemanaFim, setAgendaSemanaFim] = useState<number>(0);
    const [agendaAbertaInicio, setAgendaAbertaInicio] = useState<string>("");
    const [agendaAbertaFim, setAgendaAbertaFim] = useState<string>("");
    const [agendaBloqueadaInicio, setAgendaBloqueadaInicio] = useState<string>("");
    const [agendaBloqueadaFim, setAgendaBloqueadaFim] = useState<string>("");
    const [loja, setLoja] = useState<string>("");
    const [mostrarFiltros, setMostrarFiltros] = useState(false);

    const lojaProps = selectItens.find((item) => item.name === "loja")?.selectItems ?? [];
    const semanaProps = selectItens.find((item) => item.name === "semana")?.selectItems ?? [];
    const colaboradorProps = selectItens.find((item) => item.name === "colaborador")?.selectItems ?? [];

    const handleSearch = async (event: React.FormEvent) => {
        event.preventDefault();

        const agenda: AgendaItens = {
            idLoja: idLoja ?? 0,
            idColaborador: idColaborador ?? 0,
            idAgendaSemanaInicio: idAgendaSemanaInicio ?? 0,
            idAgendaSemanaFim: idAgendaSemanaFim ?? 0,
            agendaAbertaInicio: formatarHoraComData(agendaAbertaInicio ?? ""),
            agendaAbertaFim: formatarHoraComData(agendaAbertaFim ?? ""),
            agendaBloqueadaInicio: formatarHoraComData(agendaBloqueadaInicio ?? ""),
            agendaBloqueadaFim: formatarHoraComData(agendaBloqueadaFim ?? ""),
            nome: tipoItem?.toString() === TipoUsuarioColaboradorId ? colaborador ?? "" : "",
            razaoSocial: tipoItem?.toString() === TipoUsuarioLojaId ? loja ?? "" : "",
            tipo: Number(tipoItem) ?? 0,
        };

        const paginacao = paginar(agenda, page);
        paginacao.paginaAtual = 1;
        const agendaService = await buscarAgendaPaginada(paginacao ?? {});
        onResultadosBusca(agendaService ?? {});
    };

    const handleButtonClick = () => {
        const fakeEvent = { preventDefault: () => { } } as React.FormEvent;
        handleSearch(fakeEvent);
        setMostrarFiltros(false);
    };

    const handleDropdownChange = (e: SelectChangeEvent<string>, tipo: string) => {
        const selectedKey = e.target.value;
        const selectedItem = getSelectedItemByTipo(tipo, selectedKey, colaboradorProps, lojaProps);
        const selectedValue = selectedItem?.value || "";

        switch (tipo) {
            case "colaborador":
                setLojaId(Number(0));
                setLoja("");
                setColaboradorId(Number(selectedKey));
                setColaborador(selectedValue);
                break;
            case "loja":
                setColaboradorId(Number(0));
                setColaborador("");
                setLojaId(Number(selectedKey));
                setLoja(selectedValue);
                break;
            case "semanaInicio":
                setAgendaSemanaInicio(Number(selectedKey));
                break;
            case "semanaFim":
                setAgendaSemanaFim(Number(selectedKey));
                break;
            default:
                return null;
        }
    };

    const limparItens = () => {
        setAgendaSemanaInicio(0);
        setAgendaSemanaFim(0);
        setAgendaAbertaInicio("");
        setAgendaAbertaFim("");
        setAgendaBloqueadaInicio("");
        setAgendaBloqueadaFim("");
        setColaborador("");
        setColaboradorId(0);
        setLoja("");
        setLojaId(0);
    };

    const handleButtonClickLimpar = async () => {
        limparItens();
        const agenda: AgendaItens = {
            id: 0,
            razaoSocial: "",
            nome: "",
            descricao: "",
            agendaAbertaInicio: "",
            agendaAbertaFim: "",
            bloqueado: false,
            isTodoDia: false,
            idAgendaSemanaInicio: 0,
            idAgendaSemanaFim: 0,
            agendaBloqueadaInicio: "",
            agendaBloqueadaFim: "",
            diaInicioSemana: "",
            diaSemanaFim: "",
            idLoja: 0,
            idColaborador: 0,
            tipo: Number(tipoItem) ?? 0,
        };

        const paginacao = paginar(agenda, 1);
        const agendaService = await buscarAgendaPaginada(paginacao ?? {});
        onResultadosBusca(agendaService ?? {});
        setMostrarFiltros(false);
    };

    const handleIconClick = (tipo: string) => {
        if (tipo === "agendaAberta") {
            setAgendaAbertaInicio("");
        }
        if (tipo === "agendaFechada") {
            setAgendaAbertaFim("");
        }
        if (tipo === "bloquadaInicio") {
            setAgendaBloqueadaInicio("");
        }
        if (tipo === "bloquadaFim") {
            setAgendaBloqueadaFim("");
        }
    };

    const renderTrashButton = (tipo: string) => (
<Tooltip title="limpar">

    <IconButton
        aria-label="limpar"
        className={styles.trashInlineButton}
        onClick={() => handleIconClick(tipo)}
    >
        <FaTrash />
    </IconButton>

</Tooltip>
    );

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
                            {tipoItem?.toString() === TipoLoja && (
                                <div className={styles.formItens}>
                                    <Dropdown
                                        dropProps={{
                                            name: "Loja",
                                            label: "Loja*",
                                            itens: lojaProps ?? [],
                                            selectedId: idLoja?.toString() || "",
                                            onChange: (e: SelectChangeEvent<string>) => handleDropdownChange(e, "loja"),
                                        }}
                                    />
                                </div>
                            )}
                            {tipoItem?.toString() === TipoColaborador && (
                                <div className={styles.formItens}>
                                    <Dropdown
                                        dropProps={{
                                            name: "Colaborador",
                                            label: "Colaborador*",
                                            itens: colaboradorProps,
                                            selectedId: idColaborador || "0",
                                            onChange: (e: SelectChangeEvent<string>) => handleDropdownChange(e, "colaborador"),
                                        }}
                                    />
                                </div>
                            )}
                            <div className={styles.formItens}>
                                <Dropdown
                                    dropProps={{
                                        name: "Dia",
                                        label: "Dia da semana Início",
                                        itens: semanaProps,
                                        selectedId: idAgendaSemanaInicio || "0",
                                        onChange: (e: SelectChangeEvent<string>) => handleDropdownChange(e, "semanaInicio"),
                                    }}
                                />
                            </div>
                            <div className={styles.formItens}>
                                <Dropdown
                                    dropProps={{
                                        name: "Dia",
                                        label: "Dia da semana Fim",
                                        itens: semanaProps,
                                        selectedId: idAgendaSemanaFim || "0",
                                        onChange: (e: SelectChangeEvent<string>) => handleDropdownChange(e, "semanaFim"),
                                    }}
                                />
                            </div>
                        </div>

                        <div className={styles.separador}></div>

                        <div className={`${styles.coluna} ${styles.campos}`}>
                            <div className={styles.pickerGroup}>
                                <div className={styles.pickerWithAction}>
                                    <div className={styles.pickerField}>
                                        <DateTimerPicker
                                            label={DataLabelAgendaAberta}
                                            value={agendaAbertaInicio ? dayjs(agendaAbertaInicio) : null}
                                            onChange={setAgendaAbertaInicio}
                                            tipo="data"
                                        />
                                    </div>
                                    {renderTrashButton("agendaAberta")}
                                </div>
                                <div className={styles.pickerWithAction}>
                                    <div className={styles.pickerField}>
                                        <DateTimerPicker
                                            label={DataLabelAgendaFechada}
                                            value={agendaAbertaFim ? dayjs(agendaAbertaFim) : null}
                                            onChange={setAgendaAbertaFim}
                                            tipo="data"
                                        />
                                    </div>
                                    {renderTrashButton("agendaFechada")}
                                </div>
                                <div className={styles.pickerWithAction}>
                                    <div className={styles.pickerField}>
                                        <DateTimerPicker
                                            label={DataLabelBloqueioAberto}
                                            value={agendaBloqueadaInicio ? dayjs(agendaBloqueadaInicio) : null}
                                            onChange={setAgendaBloqueadaInicio}
                                            tipo="hora"
                                        />
                                    </div>
                                    {renderTrashButton("bloquadaInicio")}
                                </div>
                                <div className={styles.pickerWithAction}>
                                    <div className={styles.pickerField}>
                                        <DateTimerPicker
                                            label={DataLabelBloqueioFechado}
                                            value={agendaBloqueadaFim ? dayjs(agendaBloqueadaFim) : null}
                                            onChange={setAgendaBloqueadaFim}
                                            tipo="hora"
                                        />
                                    </div>
                                    {renderTrashButton("bloquadaFim")}
                                </div>
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

export default AgendaSearch;
