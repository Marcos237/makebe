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
  label,
  value,
  width = '300px',
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
            xs: '80%',
            sm: '80%',
            md: width,
            lg: width,
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
        <Box>{renderPicker()}</Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default DateTimerPicker;
