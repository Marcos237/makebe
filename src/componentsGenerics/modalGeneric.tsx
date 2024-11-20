import { useState, useCallback, FC, useEffect, useMemo } from "react";
import { ModalItem } from "../Interfaces/shared/modalItem";
import { BotaoItens } from "../Interfaces/Botao/botao";
import Botao from "../components/button";
import ModalCuston from "../components/modal";

const ModalGeneric: FC<{ modalProps: ModalItem }> = ({ modalProps }) => {
    const [modalItem, setModalItem] = useState<ModalItem>();

    const handleModalClose = useCallback(() => {
        setModalItem(undefined);
    }, []);

    const modalButtonConfirmar = useMemo(() => ({
        name: 'Confirmar',
        tooltip: 'Confirmar',
        label: 'Confirmar',
        width: '140px',
        color: 'primary',
        isLoading: false,
        onIconClick: () => {
            modalProps.onClose?.();
            handleModalClose();
        }
    }), [handleModalClose, modalProps]);
    
    const modalButtonCancelar = useMemo(() => ({
        name: 'Cancelar',
        tooltip: 'Cancelar',
        label: 'Cancelar',
        width: '140px',
        color: 'error',
        isLoading: false,
        onIconClick: handleModalClose
    }), [handleModalClose])
    const modalActions = useMemo(() => {
        return [
            <div className="botao" key="confirmar">
                <Botao botaoProps={modalButtonConfirmar as BotaoItens} />
            </div>,
            <div className="botao" key="cancelar">
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
            bgcolor: "black",
            color: "white",
            boxShadow: 24,
            pt: 2,
            px: 4,
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