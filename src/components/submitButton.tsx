import * as React from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import { BotaoItens } from "../Interfaces/Botao/botao";

const BotaoSubmit: React.FC<{ botaoProps: BotaoItens }> = ({ botaoProps }) => {
  const {
    name,
    tooltip,
    label,
    icon: Icon,
    color = "primary",
    width,
    isLoading = false,
    isDisable = false,
    classIcone,
    marginRight,
    marginLeft,
    form 
  } = botaoProps;

  const isDisabled = isLoading || isDisable;

  const btn = (
    <Button
      type="submit"
      form={form}
      variant="contained"
      color={color}
      disabled={isDisabled}
      aria-label={label || name}
      aria-busy={isLoading || undefined}
      disableElevation
      style={{ width }}
      startIcon={
        !isLoading && Icon ? (
          <Icon
            className={classIcone}
            style={{ marginRight, marginLeft }}
          />
        ) : undefined
      }
      sx={{
        "&.Mui-disabled": {
          backgroundColor: "#34495e",
          border: "2px solid #21618c",
          opacity: 1,
          color: "#ffffff",
        },
      }}
    >
      {isLoading ? <CircularProgress size={20} color="inherit" /> : name}
    </Button>
  );

  return tooltip ? (
    <Tooltip title={tooltip}>
      <span>{btn}</span>
    </Tooltip>
  ) : (
    btn
  );
};

export default BotaoSubmit;
