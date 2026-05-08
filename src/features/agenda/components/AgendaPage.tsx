import React from "react";
import { Tooltip } from "@mui/material";
import { TfiAgenda, TfiLayersAlt } from "react-icons/tfi";
import Banner from "../../../components/banner";
import Footer from "../../../components/footer";
import GridViewLista from "../../../components/gridview";
import ModalGeneric from "../../../componentsGenerics/modalGeneric";
import { useAgendaPage } from "../hooks/useAgendaPage";
import AgendaForm from "./AgendaForm";
import AgendaSearch from "./AgendaSearch";
import styles from "./Agenda.module.css";

const AgendaPage: React.FC = () => {
    const {
        agendaItem,
        gridViewItens,
        handleButtonClickListar,
        handleButtonClickSalvar,
        handleSaveSuccess,
        handleResultadosBusca,
        modalOpen,
        persistirItensList,
        resultadosBusca,
        tipoItem,
        usuarioLogado,
    } = useAgendaPage();

    return (
        <div className={styles.root}>
            <div className={styles.banner}>
                <Banner usuarioLogado={usuarioLogado} />
            </div>

            <div className={styles.pageContent}>
                <div className={`persistir ${styles.section}`}>
                    <div className={styles.actionBar}>
                        <button onClick={handleButtonClickListar} className={styles.actionButton} type="button">
                            <Tooltip title="listar">
                                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                    <TfiLayersAlt />
                                </span>
                            </Tooltip>
                        </button>
                    </div>

                    <div className={styles.sectionBody}>
                        <AgendaForm
                            persistirProps={{
                                item: agendaItem,
                                onSave: handleSaveSuccess,
                            }}
                            persistirDropProps={persistirItensList ?? []}
                            tipoItem={Number(tipoItem)}
                        />
                    </div>
                </div>

                <div className={`lista ${styles.section}`}>
                    <div className={styles.actionBar}>
                        <button onClick={handleButtonClickSalvar} className={styles.openButton} type="button">
                            <Tooltip title="novo">
                                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                    <TfiAgenda />
                                </span>
                            </Tooltip>
                        </button>
                    </div>

                    <div className={styles.sectionBody}>
                        <AgendaSearch
                            selectItens={persistirItensList ?? []}
                            tipoItem={Number(tipoItem)}
                            onResultadosBusca={handleResultadosBusca}
                            page={resultadosBusca?.paginaAtual ?? 1}
                        />
                    </div>

                    <div className={styles.sectionBody}>
                        <div className={styles.listHeader}>
                            <h2>Lista</h2>
                            <p>Visualize e gerencie as agendas cadastradas</p>
                        </div>
                        <div className={styles.gridWrapper}>
                            <GridViewLista gridviewProps={gridViewItens ?? {}} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal">
                {modalOpen && <ModalGeneric modalProps={modalOpen} />}
            </div>

            <div className={styles.footer}>
                <Footer />
            </div>
        </div>
    );
};

export default AgendaPage;
