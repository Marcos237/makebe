import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { ModalItem } from "../Interfaces/shared/modalItem";

const ModalCuston: React.FC<{ modalProps: ModalItem }> = ({ modalProps }) => {
    return <>
        <Modal
            open={modalProps.open}
            onClose={modalProps.onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={modalProps.style ?? undefined}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    {modalProps.title}
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    {modalProps.texto}
                </Typography>
                {modalProps.children && (
                    <Box sx={{ mt: 2 }}>
                        {modalProps.children}
                    </Box>
                )}

                {modalProps.actions && modalProps.actions.length > 0 && (
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2, flexWrap: 'wrap' }}>
                        {modalProps.actions.map((action, index) => (
                            <React.Fragment key={index}>
                                {action}
                            </React.Fragment>
                        ))}
                    </Box>
                )}
            </Box>
        </Modal>
    </>
}
export default ModalCuston;
