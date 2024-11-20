import { ModalItem } from "./modalItem";

export interface ModalGenericItem {
    modalProps: ModalItem;
    onClick: (event: React.MouseEvent, item?: any) => void;
}