import React from "react";
import { Tooltip } from "@mui/material";
import { FaUserPlus, FaUsers } from "react-icons/fa";
import Banner from "../../../components/banner";
import Footer from "../../../components/footer";
import GridViewLista from "../../../components/gridview";
import { useColaboradorPage } from "../hooks/useColaboradorPage";
import ColaboradorForm from "./ColaboradorForm";
import ColaboradorSearch from "./ColaboradorSearch";
import styles from "./Colaborador.module.css";

const ColaboradorPage: React.FC = () => {
    const {
        colaboradorItem,
        gridViewItens,
        handleButtonClickListar,
        handleButtonClickSalvar,
        handleResultadosBusca,
        persistirItens,
        readOnly,
        tipoItem,
        usuarioLogado,
    } = useColaboradorPage();

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
                        <ColaboradorForm
                            persistirProps={{
                                ...persistirItens,
                                item: colaboradorItem,
                            }}
                            readOnly={readOnly}
                            tipoItem={Number(tipoItem)}
                        />
                    </div>
                </div>

                <div className={`lista ${styles.section}`}>
                    <div className={styles.actionBar}>
                        <button onClick={handleButtonClickSalvar} className={styles.openButton} type="button">
                            <Tooltip title="novo">
                                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                    <FaUserPlus />
                                </span>
                            </Tooltip>
                        </button>
                    </div>

                    <div className={styles.sectionBody}>
                        <ColaboradorSearch
                            selectItens={persistirItens?.selectItems || []}
                            onResultadosBusca={handleResultadosBusca}
                        />
                    </div>

                    <div className={styles.sectionBody}>
                        <div className={styles.listHeader}>
                            <h2>Lista</h2>
                            <p>Visualize e gerencie os colaboradores cadastrados</p>
                        </div>
                        <div className={styles.gridWrapper}>
                            <GridViewLista gridviewProps={gridViewItens ?? {}} />
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

export default ColaboradorPage;
