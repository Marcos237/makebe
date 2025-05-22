import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export const formatarHoraComData = (hora: string | Dayjs | null | undefined): string => {

  if (!hora || hora === '') {
    return '';
  }

  if (typeof hora === 'string') {
    const data = dayjs(hora, "DD/MM/YYYY HH:mm:ss", true);
    if (data.isValid()) {
      return data.format("DD/MM/YYYY HH:mm:ss");
    }
  }

  if (dayjs.isDayjs(hora)) {
    if (!hora.isValid()) {
      console.error("Objeto dayjs inválido:", hora.toString());
      return '';
    }
    return hora.format("DD/MM/YYYY HH:mm:ss");
  }

  const tentativa = dayjs(hora);
  if (tentativa.isValid()) {
    return tentativa.format("DD/MM/YYYY HH:mm:ss");
  }

  console.error("Data/hora inválida:", hora);
  return '';
};

export const formatarHora = (dataHora: string | null | undefined): Dayjs | null => {
  if (!dataHora || dataHora === '') {
    return null;
  }

  const dataFormat = dayjs(dataHora, 'DD/MM/YYYY HH:mm:ss', true);
  return dataFormat.isValid() ? dataFormat : null;
};
