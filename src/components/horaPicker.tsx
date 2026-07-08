import { Grid } from "@mui/material";
import { SelectChangeEvent } from '@mui/material/Select';
import { SelectItens } from "../Interfaces/shared/selectItens";
import { useCallback, useEffect, useState } from "react";
import { HoraItens } from '../Interfaces/shared/horaItens';
import Dropdown from "./dropdown";

const HoraPicker = (horaProps: HoraItens) => {
  const [hora, setHora] = useState<string>("0");
  const [minuto, setMinuto] = useState<string>("0");

  const fetchHora = useCallback(() => {
    if (horaProps.value) {
      const valorString = horaProps.value.toString();
      const [horaParte, minutoParte] = valorString.split(".");
      setHora(String(Number(horaParte || "0")));

      const minutoNormalizado = (minutoParte || "").padEnd(2, "0").slice(0, 2);
      setMinuto(String(Number(minutoNormalizado || "0")));
    } else {
      setHora("0");
      setMinuto("0");
    }
  }, [horaProps.value]);

  useEffect(() => {
    fetchHora();
  }, [fetchHora]);

  const horas: SelectItens[] = Array.from({ length: 101 }, (_, i) => ({
    key: i,
    value: String(i).padStart(2, "0"), 
  }));

  const minutos: SelectItens[] = Array.from({ length: 60 }, (_, i) => ({
    key: i,
    value: String(i).padStart(2, "0"), 
  }));
  
  const handleDropdownChange = (e: SelectChangeEvent<string>, tipo: string) => {
    let novaHora = hora;
    let novoMinuto = minuto;

    if (tipo === "hora") {
      novaHora = e.target.value;
      setHora(novaHora);
    }
    if (tipo === "minuto") {
      novoMinuto = e.target.value;
      setMinuto(novoMinuto);
    }

    const valorHora = Number(novaHora) || 0;
    const valorMinuto = Number(novoMinuto) || 0;
    const valorTotal = parseFloat(`${valorHora}.${valorMinuto.toString().padStart(2, "0")}`);

    horaProps.onChange(Number(valorTotal.toFixed(2)));
  };

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12}>
        <div className='nameLabel'>
          <label>{horaProps.label}</label>
        </div>
      </Grid>
      <Grid item xs={6}>
        <Dropdown
          dropProps={{
            name: "Periodo",
            label: "Horas*",
            id:"hora",
            itens: horas ?? [],
            selectedId: hora,
            onChange: (e: SelectChangeEvent<string>) => handleDropdownChange(e, "hora"),
            erroSession:"Periodo"
          }}
        />
      </Grid>

      <Grid item xs={6}>
        <Dropdown
          dropProps={{
            name: "Periodo",
            id:"minuto",
            label: "Minutos*",
            itens: minutos ?? [],
            selectedId: minuto,
            onChange: (e: SelectChangeEvent<string>) => handleDropdownChange(e, "minuto"),
            erroSession:"Periodo"
          }}
        />
      </Grid>
    </Grid>
  );
};

export default HoraPicker;
