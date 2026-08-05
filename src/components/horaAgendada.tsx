// HoraAgendada.tsx
import React, { useCallback, useMemo, useRef, useState } from "react";
import { HoraAgendadaItem } from "../Interfaces/Agendamento/horaAgendadaItem";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Grid, IconButton, Tooltip, Box } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import CloseIcon from "@mui/icons-material/Close";
import { TfiAgenda } from "react-icons/tfi";
import { FaRegTrashAlt, FaRegCalendarAlt } from "react-icons/fa";
import dayjs from "dayjs";
import CircularProgress from '@mui/material/CircularProgress';
import useClickOutside from "../hooks/useClickOutside";
import "../assets/styles/shared/horaAgendada.css";

const HoraAgendada: React.FC<{
  horaAgendadaItem?: HoraAgendadaItem[];
  diaISO?: string;
  onCloseClick?: () => void | Promise<void>;
  onUpdateClick?: (id: number) => void | Promise<void>;
  onDeleteClick?: (id: number) => void | Promise<void>;
  onNewClick?: (data?: string, id?: number) => void | Promise<void>;
  isReadOnly?: boolean;
}> = ({ horaAgendadaItem, diaISO, onCloseClick, onUpdateClick, onDeleteClick, onNewClick, isReadOnly }) => {
  const darkTheme = createTheme({ palette: { mode: "dark" } });
  const boxRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width:820px)");
  const [closing, setClosing] = useState(false);
  const [isNovo, setIsNovo] = useState(false);
  const [isEditar, setIsEditar] = useState(false);
  const [loadingEditarId, setLoadingEditarId] = useState<number | null>(null);

  const handleOutsideClose = useCallback(() => {
    onCloseClick?.();
  }, [onCloseClick]);

  const handleClose = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (closing) return;

    setClosing(true);
    try {
      await Promise.resolve(onCloseClick?.());
    } finally {
      setClosing(false);
    }
  };

  const handleNovo = async (data: string) => {

    const idColaborador = horaAgendadaItem?.[0].idColaborador ?? 0;
    setIsNovo(true);
    try {
      await Promise.resolve(onNewClick?.(data, Number(idColaborador)));
    } finally {
      setIsNovo(false);
    }
  };


  const handleEditar = async (id: number) => {

    if (loadingEditarId === id) return;
    if (isEditar) return;
    setIsEditar(true);
    setLoadingEditarId(id);
    try {
      await Promise.resolve(onUpdateClick?.(id));
    } finally {
      setIsEditar(false);
      setLoadingEditarId(null);
    }
  }

  const handleRemover = async (id: number) => {
    if (closing) return;
    setClosing(true);
    try {
      await Promise.resolve(onDeleteClick?.(id));
    } finally {
      setClosing(false);
    }
  }

  const limparDataSelecionada = useCallback((data?: string) => {
    if (!data?.trim()) return "";

    const dataNormalizada = dayjs(data, ["YYYY-MM-DD", "YYYY-MM-DDTHH:mm:ss", "YYYY-MM-DDTHH:mm:ss.SSSZ", "DD/MM/YYYY"], true);
    return dataNormalizada.isValid() ? dataNormalizada.format("DD/MM/YYYY") : "";
  }, []);

  const dataSelecionada = useMemo(() => {
    if (diaISO) return limparDataSelecionada(diaISO);
    const item = (horaAgendadaItem ?? []).find(i => i.data?.trim());
    return limparDataSelecionada(item?.data);
  }, [horaAgendadaItem, diaISO, limparDataSelecionada]);

  const itensDoDia = useMemo(() => {
    if (!dataSelecionada) return [];
    return (horaAgendadaItem ?? []).filter(i => limparDataSelecionada(i.data) === dataSelecionada);
  }, [horaAgendadaItem, dataSelecionada, limparDataSelecionada]);

  useClickOutside(boxRef, handleOutsideClose, !isMobile);

  if (!dataSelecionada) return null;

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <Grid item md={12} xs={12} className="data-box-content">
          <div ref={boxRef} className="data-box">

            <span className="data-box-text">{dataSelecionada}</span>

            {!isReadOnly && (
              <div className="fechar-item">
                <Tooltip title="Fechar">
                  <span>
                    <IconButton
                      size="small"
                      onClick={handleClose}
                      aria-label="Fechar"
                      disabled={closing}
                      sx={{ position: "relative" }}
                    >
                      {closing ? (
                        <Box sx={{ color: "#ed145b" }}>
                          <CircularProgress
                            size={28}
                            thickness={4}
                            disableShrink
                            sx={{
                              '& .MuiCircularProgress-circle': {
                                strokeLinecap: 'round',
                                animationDuration: '1.4s',
                              },
                            }}
                            color="inherit"
                          />
                        </Box>
                      ) : (
                        <CloseIcon fontSize="large" />
                      )}
                    </IconButton>
                  </span>
                </Tooltip>
              </div>
            )}
            <div className="data-box-tittle">
              <span className="data-tittle">Início</span>
              <span className="data-tittle">Fim</span>
            </div>

            <div className="linha-horario">
              {itensDoDia.map((agendamento, i) => {
                const id = agendamento?.id ?? (horaAgendadaItem ?? []).find(it => it.id === agendamento?.id)?.id ?? 0;
                const itemAtual = (horaAgendadaItem ?? []).find(it => it.id === agendamento?.id);
                const nomeCliente = agendamento?.nomeCliente ?? agendamento?.name ?? itemAtual?.nomeCliente ?? itemAtual?.name ?? "";
                const telefoneCliente = agendamento?.telefoneCliente ?? itemAtual?.telefoneCliente ?? "";
                const temHorarioFim = Boolean(agendamento?.dataFim?.length && agendamento.dataFim.some(h => h?.trim()));
                const key = id || `${agendamento.data}-${agendamento.dataInicio}-${agendamento.dataFim}-${i}`;

                return (
                  <div key={key} className="box-item">
                    <div className="data-box-detalhes">
                      {agendamento.descricaoServico && (
                        <span className="data-box-servico">{agendamento.descricaoServico}</span>
                      )}
                      {nomeCliente && (
                        <span className="data-box-servico">Nome: {nomeCliente}</span>
                      )}
                      {telefoneCliente && (
                        <span className="data-box-servico">Telefone: {telefoneCliente}</span>
                      )}
                    </div>
                    {temHorarioFim && (
                      <div className="linha-item">
                        <span className="data-box-text hora">
                          {agendamento.dataInicio?.toString() ?? ""}
                        </span>

                        <span className="data-box-text data-box-fim hora">
                          {agendamento.dataFim?.toString() ?? ""}
                        </span>

                        <input type="hidden" name={`horaFimId[${id}]`} value={id?.toString() ?? ""} />

                        <div className="acoes">
                          {!isReadOnly && (
                            <>
                              <Tooltip title="editar">
                                {isEditar && loadingEditarId === id ? (
                                  <Box sx={{ color: "#ed145b" }}>
                                    <CircularProgress
                                      size={28}
                                      thickness={4}
                                      disableShrink
                                      sx={{
                                        '& .MuiCircularProgress-circle': {
                                          strokeLinecap: 'round',
                                          animationDuration: '1.4s',
                                        }
                                      }}
                                      color="inherit"
                                    />
                                  </Box>
                                ) : (
                                  <span className="icon-btn" onClick={() => handleEditar(Number(id))}>
                                    <TfiAgenda />
                                  </span>
                                )}
                              </Tooltip>
                              <Tooltip title="remover">
                                <span className="icon-btn" onClick={() => handleRemover(Number(id))}>
                                  <FaRegTrashAlt />
                                </span>
                              </Tooltip>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {!isReadOnly && (
              <>
                <Tooltip title="Novo">
                  <span>
                    <IconButton
                      size="large"
                      onClick={() => handleNovo(dataSelecionada)}
                      aria-label="Novo"
                      disabled={isNovo}
                      sx={{ position: "relative" }}
                    >
                      {isNovo ? (
                        <Box sx={{ color: "#ed145b" }}>
                          <CircularProgress
                            size={28}
                            thickness={4}
                            disableShrink
                            sx={{
                              '& .MuiCircularProgress-circle': {
                                strokeLinecap: 'round',
                                animationDuration: '1.4s',
                              },
                            }}
                            color="inherit"
                          />
                        </Box>
                      ) : (
                        <FaRegCalendarAlt fontSize="large" />
                      )}
                    </IconButton>
                  </span>
                </Tooltip>
              </>
            )}
          </div>
        </Grid>
      </ThemeProvider >
    </>
  );
};

export default HoraAgendada;
