import React, { useMemo, useState, useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar, PickersDay, PickersDayProps } from "@mui/x-date-pickers";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Grid, Box } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from "@mui/material/Tooltip";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { CalendarioItem } from "../Interfaces/shared/calendarioItem";
import HoraAgendada from "./horaAgendada";

import "dayjs/locale/pt-br";
import "../assets/styles/shared/calendario.css";

dayjs.extend(customParseFormat);
dayjs.locale("pt-br");

const Calendario: React.FC<{ calendarioItem: CalendarioItem }> = ({ calendarioItem }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingDay, setLoadingDay] = useState<Dayjs | null>(null);
  const [currentYear, setCurrentYear] = useState<number>(calendarioItem.year ?? dayjs().year());
  const leitura = !!calendarioItem?.isReadOnly;
  const [version, setVersion] = useState(0);

  const COR_MAGENTA = "#ed145b";
  const COR_HOJE = "#3ba9ff";
  const today = useMemo(() => dayjs().startOf("day"), []);


  const months = useMemo(
    () => Array.from({ length: 12 }, (_, i) => dayjs(new Date(currentYear, i, 1))),
    [currentYear]
  );

  const darkTheme = createTheme({ palette: { mode: "dark" } });
  const diasSemana = ["D", "S", "T", "Q", "Q", "S", "S"];
  const mesIndex = Number(calendarioItem?.mes ?? 1) - 1;


  const handleChange = async (date: Dayjs | null) => {
    if (!date || isLoading) return;

    setIsLoading(true);
    setLoadingDay(date.startOf("day"));

    try {

      await new Promise(requestAnimationFrame);
      await new Promise<void>((r) => setTimeout(r, 0));
      await Promise.resolve(calendarioItem.onDayClick?.(date));

    } finally {
      setIsLoading(false);
      setLoadingDay(null);
    }
  };
  useEffect(() => {
    const y = Number(calendarioItem.year);
    const next = (Number.isFinite(y) && y !== 0) ? y : dayjs().year();
    setCurrentYear(next);
    setVersion(v => v + 1);
  }, [calendarioItem.year, leitura, calendarioItem.agendamentos]);

  const datasMarcadas = useMemo(() => {
    const set = new Set<string>();
    for (const a of calendarioItem.agendamentos ?? []) {
      if (!a?.data) continue;
      const d = dayjs(a.data, "DD/MM/YYYY", true);
      if (d.isValid() && d.year() === currentYear) {
        set.add(d.format("YYYY-MM-DD"));
      }
    }
    return set;
  }, [calendarioItem.agendamentos, currentYear]);

  return (
    <ThemeProvider theme={darkTheme}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
        <Grid container spacing={2} className="calendario-grid">
          {months.map((month, idx) => {
            const min = month.startOf("month");
            const max = month.endOf("month");


            return (
              <Grid item xs={12} sm={6} md={4} key={idx} className="calendario-grid-item">
                <Box className="calendario">
                  <DateCalendar
                    key={`cal-${idx}-${version}`}
                    onChange={handleChange}
                    value={null}
                    referenceDate={month}
                    minDate={min}
                    maxDate={max}
                    reduceAnimations
                    readOnly={leitura}
                    disabled={leitura}
                    showDaysOutsideCurrentMonth={false}
                    disableHighlightToday
                    dayOfWeekFormatter={(d: Dayjs) => diasSemana[d.day()]}
                    slots={{
                      day: (props: PickersDayProps<Dayjs>) => {
                        if (props.outsideCurrentMonth) return <PickersDay {...props} />;

                        const key = props.day.format("YYYY-MM-DD");
                        const isMarcado = datasMarcadas.has(key);
                        const isHere = isLoading && !!loadingDay && props.day.isSame(loadingDay, "day");
                        const isHojeNaoMarcado = !isMarcado && props.day.isSame(today, "day");

                        return (
                          <Tooltip title={isMarcado ? "editar" : "agendar"} arrow disableInteractive>
                            <Box sx={{ position: "relative" }}>
                              <PickersDay
                                {...props}
                                sx={{
                                  ...(isMarcado && {
                                    bgcolor: COR_MAGENTA,
                                    color: "#fff",
                                    borderRadius: "8px",
                                    "&:hover, &:focus": { bgcolor: COR_MAGENTA },
                                  }),
                                  ...(isHojeNaoMarcado && {
                                    bgcolor: COR_HOJE,
                                    color: "#000",
                                    borderRadius: "8px",
                                    "&:hover, &:focus": { bgcolor: COR_HOJE },
                                  }),
                                  ...(isHere && { visibility: "hidden" }),
                                }}
                              />
                              {isHere && (
                                <Box sx={{
                                  position: "absolute", inset: 0, display: "grid", placeItems: "center",
                                  borderRadius: 1, pointerEvents: "none",
                                }}>
                                  <Box sx={{ color: COR_MAGENTA }}>
                                    <CircularProgress size={28} thickness={4} disableShrink color="inherit" />
                                  </Box>
                                </Box>
                              )}
                            </Box>
                          </Tooltip>
                        );
                      },
                    }}
                    slotProps={{
                      calendarHeader: {
                        sx: {
                          "& .MuiPickersArrowSwitcher-root": { display: "none" },
                          "& .MuiPickersCalendarHeader-switchViewButton": { display: "none" },
                          "& .MuiPickersCalendarHeader-label": { pointerEvents: "none" },
                        },
                      },
                    }}
                    sx={{ maxWidth: "100%" }}
                  />
                  <div className="calendario-dias">
                    {calendarioItem.isHoraOpen && idx === mesIndex && (
                      <HoraAgendada
                        horaAgendadaItem={calendarioItem.agendamentos}
                        diaISO={calendarioItem.diaISO}
                        onCloseClick={calendarioItem.onCloseClick}
                        onUpdateClick={calendarioItem.onUpdateClick}
                        onDeleteClick={calendarioItem.onDeleteClick}
                        onNewClick={calendarioItem.onNewClick}
                      />
                    )}
                  </div>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default Calendario;
