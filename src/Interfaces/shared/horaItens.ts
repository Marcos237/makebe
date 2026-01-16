import dayjs, { Dayjs } from "dayjs";

export interface HoraItens {
    label?: string;
    value?: number;
    onChange: (valor: number) => void; 
    name?:string;
    erroSession?: string;
  }
