import React from "react";
import { Tooltip } from "@mui/material";
import { FaThList } from "react-icons/fa";
import { FaShop } from "react-icons/fa6";
import Banner from "../../../components/banner";
import Footer from "../../../components/footer";
import GridViewLista from "../../../components/gridview";
import ModalGeneric from "../../../componentsGenerics/modalGeneric";
import { useLojaPage } from "../hooks/useLojaPage";
import LojaForm from "./LojaForm";
import LojaSearch from "./LojaSearch";
import styles from "./Loja.module.css";

const LojaPage: React.FC = () => {
    const { gridViewItens, handleButtonClickListar, handleButtonClickSalvar, handleResultadosBusca, lojaItem, modalOpen, persistirItens, usuarioLogadoItem } = useLojaPage();

    return (
        <div className={styles.root}>
            <div className={styles.banner}><Banner usuarioLogado={usuarioLogadoItem} /></div>
            <div className={styles.pageContent}>
                <div className={`persistir ${styles.section}`}>
                    <div className={styles.actionBar}>
                        <button onClick={handleButtonClickListar} className={styles.actionButton} type="button">
                            <Tooltip title="listar">
                                <span
                                    style={{
                                        display: "inline-flex", alignItems: "center", gap: "6px"
                                    }}><FaThList /></span></Tooltip>
                        </button>
                    </div>

                    <div className={styles.sectionBody}>
                        <LojaForm persistirProps={{ ...persistirItens, item: lojaItem }} />
                    </div>
                </div>

                <div className={`lista ${styles.section}`}>
                    <div className={styles.actionBar}>
                        <button onClick={handleButtonClickSalvar} className={styles.openButton}
                            type="button">
                            <Tooltip title="novo">
                                <span style={{
                                    display: "inline-flex", alignItems:
                                        "center", gap: "6px"
                                }}><FaShop />
                                </span></Tooltip>
                        </button>
                    </div>
                    <div className={styles.sectionBody}>
                        <LojaSearch selectItens={persistirItens?.selectItems ?? []} onResultadosBusca={handleResultadosBusca} />
                    </div>
                    <div className={styles.sectionBody}>

                        <div className={styles.listHeader}>
                            <h2>Lista</h2>
                            <p>Visualize e gerencie as lojas cadastradas</p>
                        </div>
                        <div className={styles.gridWrapper}>
                            <GridViewLista gridviewProps={gridViewItens ?? {}} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal">{modalOpen && <ModalGeneric modalProps={modalOpen} />}</div>
            <div className={styles.footer}><Footer /></div>
        </div>
    );
};

export default LojaPage;
