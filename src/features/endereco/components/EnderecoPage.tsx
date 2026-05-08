import React from "react";
import { Tooltip } from "@mui/material";
import { FaThList } from "react-icons/fa";
import { FaMapLocationDot } from "react-icons/fa6";
import Banner from "../../../components/banner";
import Footer from "../../../components/footer";
import GridViewLista from "../../../components/gridview";
import ModalGeneric from "../../../componentsGenerics/modalGeneric";
import { useEnderecoPage } from "../hooks/useEnderecoPage";
import EnderecoForm from "./EnderecoForm";
import styles from "./Endereco.module.css";
import EnderecoSearch from "./EnderecoSearch";

const EnderecoPage: React.FC = () => {
    const {
        enderecoItem,
        gridViewItens,
        handleButtonClickListar,
        handleButtonClickSalvar,
        handleSaveSuccess,
        handleResultadosBusca,
        modalOpen,
        persistirItensList,
        resultadosBusca,
        tipoUsuarioId,
        usuarioLogadoItem,
    } = useEnderecoPage();

    return (
        <div className={styles.root}>
            <div className={styles.banner}><Banner usuarioLogado={usuarioLogadoItem} /></div>
            <div className={styles.pageContent}>
                <div className={`persistir ${styles.section}`}>
                    <div className={styles.actionBar}>
                        <button onClick={handleButtonClickListar} className={styles.actionButton} type="button">
                            <Tooltip title="listar">
                                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                    <FaThList />
                                </span>
                            </Tooltip>
                        </button>
                    </div>

                    <div className={styles.sectionBody}>
                        <EnderecoForm persistirProps={{ item: enderecoItem, onSave: handleSaveSuccess }} persistirDropProps={persistirItensList} tipoUsuario={tipoUsuarioId} />
                    </div>
                </div>

                <div className={`lista ${styles.section}`}>
                    <div className={styles.actionBar}>
                        <button onClick={handleButtonClickSalvar} className={styles.openButton} type="button">
                            <Tooltip title="novo">
                                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                    <FaMapLocationDot />
                                </span>
                            </Tooltip>
                        </button>
                    </div>

                    <div className={styles.sectionBody}>
                        <EnderecoSearch
                            selectItens={persistirItensList ?? []}
                            tipoUsuarioId={tipoUsuarioId}
                            onResultadosBusca={handleResultadosBusca}
                            page={resultadosBusca?.paginaAtual ?? 1}
                        />
                    </div>

                    <div className={styles.sectionBody}>
                        <div className={styles.listHeader}>
                            <h2>Lista</h2>
                            <p>Visualize e gerencie os endereços cadastrados</p>
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

export default EnderecoPage;
