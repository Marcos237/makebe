
import React from "react";
import { SxProps } from "@mui/material";

export interface ModalItem {
    open: boolean;
    onClose?: () => void;
    title?: string;
    texto?: string;
    children?: React.ReactNode;
    actions?: React.ReactNode[];
    style?: SxProps;
}
