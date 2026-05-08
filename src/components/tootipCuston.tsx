// TooltipCustom.tsx
import React from "react";
import Tooltip, { TooltipProps } from "@mui/material/Tooltip";
import type { TooltipItem } from "../Interfaces/shared/tooltipItem";




const TooltipCustom: React.FC<{ TooltipItem: TooltipItem }> = ({ TooltipItem }) => {
  const {
    title,
    icon,
    label,
    gap = 6,
    color,         
    textColor,      
    arrow = true,
    placement = "bottom",
    wrapperProps,
    ...rest         
  } = TooltipItem;


  const bg  = color && color.trim() ? color : "#ed145b";
  const fg  = textColor && textColor.trim() ? textColor : "#fff";

  const iconNode = React.isValidElement(icon)
    ? icon
    : icon
      ? React.createElement(icon as React.ElementType)
      : null;

  const slotProps: NonNullable<TooltipProps["slotProps"]> = {
    tooltip: { sx: { bgcolor: bg, color: fg } } as any,
    arrow:   { sx: { color: bg } } as any,
  };

  return (
    <Tooltip
      title={title}
      arrow={arrow}
      placement={placement}
      slotProps={slotProps}
      {...rest}
    >
      <span
        style={{ display: "inline-flex", alignItems: "center", gap }}
        {...wrapperProps}
      >
        {iconNode}
        {label ? <span>{label}</span> : null}
      </span>
    </Tooltip>
  );
};

export default TooltipCustom;
