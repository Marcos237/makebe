import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import { BotaoItens } from "../Interfaces/Botao/botao";

const BotaoSubmit: React.FC<{ botaoProps: BotaoItens }> = ({ botaoProps }) => {

  const {
    name,
    tooltip,
    label,
    icon: Icon,
    width,
    isLoading = false,
    isDisable = false,
    classIcone,
    className,
    marginRight,
    marginLeft,
    form
  } = botaoProps;

  const isDisabled = isLoading || isDisable;

  const btn = (
    <button
      type="submit"
      form={form}
      disabled={isDisabled}
      aria-label={label || name}
      aria-busy={isLoading || undefined}
      className={className}
      style={{
        width: width || "100%",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {isLoading ? (
        <CircularProgress
          size={20}
          sx={{ color: "#fff" }}
        />
      ) : (
        <>
          {Icon ? (
            <Icon
              className={classIcone}
              style={{ marginRight, marginLeft }}
            />
          ) : null}

          {name}
        </>
      )}
    </button>
  );

  return tooltip ? (
    <Tooltip title={tooltip}>
      <span style={{ display: "flex", width: width || "100%" }}>
        {btn}
      </span>
    </Tooltip>
  ) : (
    btn
  );
};

export default BotaoSubmit;
