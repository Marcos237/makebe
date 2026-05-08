import { useState, useCallback, FC, useEffect, useMemo } from "react";
import { ModalItem } from "../Interfaces/shared/modalItem";
import { BotaoItens } from "../Interfaces/Botao/botao";
import Botao from "../components/button";
import ModalCuston from "../components/modal";
import styles from "./modalGeneric.module.css";

const ModalGeneric: FC<{ modalProps: ModalItem }> = ({ modalProps }) => {
    const [modalItem, setModalItem] = useState<ModalItem>();

    const handleModalClose = useCallback(() => {
        setModalItem(undefined);
    }, []);

    const modalButtonConfirmar = useMemo(() => ({
        name: 'Confirmar',
        tooltip: 'Confirmar',
        label: 'Confirmar',
        width: '100%',
        color: 'primary',
        variantStyle: 'success',
        className: styles.confirmButton,
        isLoading: false,
        onIconClick: () => {
            modalProps.onClose?.();
            handleModalClose();
        },
        backgroundColor: '#4fd1c5'
    }), [handleModalClose, modalProps]);
    
    const modalButtonCancelar = useMemo(() => ({
        name: 'Cancelar',
        tooltip: 'Cancelar',
        label: 'Cancelar',
        width: '100%',
        color: 'error',
        variantStyle: 'danger',
        className: styles.cancelButton,
        isLoading: false,
        onIconClick: handleModalClose,
        backgroundColor: '#a10f3e'
    }), [handleModalClose])
    const modalActions = useMemo(() => {
        return [
            <div className="botao" key="confirmar" style={{ flex: 1, minWidth: "140px" }}>
                <Botao botaoProps={modalButtonConfirmar as BotaoItens} />
            </div>,
            <div className="botao" key="cancelar" style={{ flex: 1, minWidth: "140px" }}>
                <Botao botaoProps={modalButtonCancelar as BotaoItens} />
            </div>
        ];
    }, [modalButtonConfirmar, modalButtonCancelar]);
    const modalpropsItem = useMemo(() => ({
        open: modalProps.open,
        onClose: () => modalProps.onClose,
        title: modalProps.title,
        texto: modalProps.texto,
            style: {
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "rgba(255, 255, 255, 0.05)",
                color: "white",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.6)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(12px)",
                borderRadius: "20px",
                pt: 3,
                px: 3,
                pb: 3,
        },
        actions: modalActions,
    }), [modalProps, modalActions]);

    useEffect(() => {
        if (modalProps.open) {
            setModalItem(modalpropsItem);
        } else {
            setModalItem(undefined);
        }
    }, [modalProps, modalpropsItem]);
    return (
        <>
            <div className="modal">
                {modalItem?.open && <ModalCuston modalProps={modalItem} />}
            </div>
        </>

    )

};
export default ModalGeneric;
