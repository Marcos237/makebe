import React from "react";
import { Tooltip } from "@mui/material";
import { FaUsers, FaUserTie } from "react-icons/fa";
import Banner from "../../../components/banner";
import Footer from "../../../components/footer";
import GridViewLista from "../../../components/gridview";
import ModalGeneric from "../../../componentsGenerics/modalGeneric";
import { useColaboradorProfissionalPage } from "../hooks/useColaboradorProfissionalPage";
import ColaboradorProfissionalForm from "./ColaboradorProfissionalForm";
import ColaboradorProfissionalSearch from "./ColaboradorProfissionalSearch";
import styles from "./ColaboradorProfissional.module.css";

const ColaboradorProfissionalPage: React.FC = () => {
    const {
        colaboradorProfissionalItem,
        gridViewItens,
        handleButtonClickListar,
        handleButtonClickSalvar,
        handleSaveSuccess,
        handleResultadosBusca,
        modalOpen,
        persistirItensList,
        usuarioLogado,
    } = useColaboradorProfissionalPage();

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
                                    <FaUsers />
                                </span>
                            </Tooltip>
                        </button>
                    </div>

                    <div className={styles.sectionBody}>
                        <ColaboradorProfissionalForm
                            persistirProps={{
                                item: colaboradorProfissionalItem,
                                onSave: handleSaveSuccess,
                            }}
                            persistirDropProps={persistirItensList ?? []}
                        />
                    </div>
                </div>

                <div className={`lista ${styles.section}`}>
                    <div className={styles.actionBar}>
                        <button onClick={handleButtonClickSalvar} className={styles.openButton} type="button">
                            <Tooltip title="novo">
                                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                    <FaUserTie />
                                </span>
                            </Tooltip>
                        </button>
                    </div>

                    <div className={styles.sectionBody}>
                        <ColaboradorProfissionalSearch
                            selectItens={persistirItensList ?? []}
                            onResultadosBusca={handleResultadosBusca}
                        />
                    </div>

                    <div className={styles.sectionBody}>
                        <div className={styles.listHeader}>
                            <h2>Lista</h2>
                            <p>Visualize e gerencie os vínculos profissionais cadastrados</p>
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

export default ColaboradorProfissionalPage;
