import * as React from 'react';
import { Box } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DateTimePickerItens } from '../Interfaces/shared/dateTimePickerItens';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import 'dayjs/locale/pt-br';

const DateTimerPicker: React.FC<DateTimePickerItens> = ({
  name,
  erroSession,
  label,
  value,
  onChange,
  tipo = 'data',
  isLeituraOnly
}) => {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  const pickerCommonProps = {
    name,
    label,
    value,
    onChange,
    InputProps: {
      readOnly: isLeituraOnly ?? false,
    },
    slotProps: {
      textField: {
        size: 'medium' as const,
        fullWidth: true,
        sx: {
          width: {
            xs: '100%',
            sm: '100%',
          },
        },
      },
    },
  };


  const renderPicker = () => {
    switch (tipo) {
      case 'hora':
        return <TimePicker {...pickerCommonProps} />;
      case 'datahora':
        return <DateTimePicker {...pickerCommonProps} />;
      default:
        return <DatePicker {...pickerCommonProps} />;
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
        <Box>
          <div className={`erroSession_${erroSession}`}></div>
          {renderPicker()}
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default DateTimerPicker;
