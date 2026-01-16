import type { TooltipProps as MuiTooltipProps } from "@mui/material/Tooltip";
import type { ReactNode, ElementType, HTMLAttributes } from "react";

export interface TooltipItem
  extends Omit<MuiTooltipProps, "title" | "children" | "componentsProps" | "slotProps"> {
  title?: string;
  icon?: ElementType | ReactNode;
  label?: ReactNode;
  color?: string;
  textColor?: string;
  gap?: number;
  wrapperProps?: HTMLAttributes<HTMLSpanElement>;
}
