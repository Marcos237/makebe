import React from "react";
import { Tooltip } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { TfiAgenda } from "react-icons/tfi";
import Banner from "../../../components/banner";
import Calendario from "../../../components/calendario";
import Dropdown from "../../../components/dropdown";
import Footer from "../../../components/footer";
import { useAgendamentoPage } from "../hooks/useAgendamentoPage";
import AgendamentoForm from "./AgendamentoForm";
import styles from "./Agendamento.module.css";

const AgendamentoPage: React.FC = () => {
    const {
        agendamentoItem,
        anoItem,
        anos,
        calendarioItem,
        colaboradores,
        colaboradorId,
        currentYear,
        handleSaveSuccess,
        handleButtonClickListar,
        handleDayClick,
        handleDropdownChange,
        horasAgendadas,
        isHoraOpen,
        isLeitura,
        usuarioLogado,
    } = useAgendamentoPage();

    return (
        <div className={styles.root}>
            <div className={styles.banner}>
                <Banner usuarioLogado={usuarioLogado} />
            </div>

            <div className={styles.pageContent}>
                <div className={`persistir ${styles.section}`}>
                    <div className={styles.actionBar}>
                        <button onClick={handleButtonClickListar} className={styles.actionButton} type="button">
                            <Tooltip title="calendário">
                                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                    <TfiAgenda />
                                </span>
                            </Tooltip>
                        </button>
                    </div>

                    <div className={styles.sectionBody}>
                        <AgendamentoForm
                            persistirProps={{
                                item: agendamentoItem,
                                onSave: handleSaveSuccess,
                            }}
                            onDayClick={handleDayClick}
                            horasAgendadas={horasAgendadas}
                        />
                    </div>
                </div>

                <div className={`lista ${styles.section}`}>
                    <div className={styles.sectionBody}>
                        <div className={styles.formPersistir}>
                            <div className={styles.card}>
                                <div className={styles.header}>
                                    <h2>Calendário</h2>
                                    <p>Visualize horários e gerencie os agendamentos</p>
                                </div>

                                <div className={styles.calendarControls}>
                                    <div className={styles.calendarItem}>
                                        <Dropdown
                                            dropProps={{
                                                name: "ColaboradorId",
                                                label: "Colaborador*",
                                                itens: colaboradores,
                                                selectedId: colaboradorId?.toString() || "0",
                                                onChange: (e: SelectChangeEvent<string>) => handleDropdownChange(e, "colaborador"),
                                                erroSession: "ColaboradorId",
                                            }}
                                        />
                                    </div>
                                    <div className={styles.calendarItem}>
                                        <Dropdown
                                            dropProps={{
                                                name: "Ano",
                                                label: "Ano*",
                                                itens: anos,
                                                selectedId: anoItem?.toString(),
                                                isLeitura,
                                                placeholder: currentYear.toString() ?? "",
                                                onChange: (e: SelectChangeEvent<string>) => handleDropdownChange(e, "ano"),
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className={styles.calendarWrapper}>
                                    <Calendario
                                        key={String(isHoraOpen)}
                                        calendarioItem={{ ...calendarioItem, isHoraOpen }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.footer}>
                <Footer />
            </div>
        </div>
    );
};

export default AgendamentoPage;
