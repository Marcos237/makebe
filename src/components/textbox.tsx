import * as React from 'react';
import { TextBoxItens } from '../Interfaces/TextBox/TextboxItens';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import CustomMaskedInput from './maskaras';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-input': {
            color: '#F5F5F5', 
            caretColor: '#F5F5F5', 
            fontFamily: '"Josefin Sans", sans-serif', 
            '&:read-only': {
              backgroundColor: 'transparent', 
              cursor: 'not-allowed', 
            },
          },
        },
      },
    },
  },
});

const CampoTexto: React.FC<TextBoxItens> = ({ textBoxProps }) => {
  const {
    name,
    tooltip,
    label,
    onChange,
    multiline,
    rows,
    value,
    icon,
    onIconClick,
    type,
    mask,
    readonly,
    maxLength,
  } = textBoxProps;

  const inputProps = mask && mask.length > 0 ? {
    inputComponent: CustomMaskedInput as any,
    inputProps: { mask },
  } : {};

  return (
    <ThemeProvider theme={darkTheme}>
      {textBoxProps && (
        <div className='textBox'>
          <Box component="form" noValidate autoComplete="off">
            <TextField
              id={name}
              multiline={multiline}
              rows={rows || 4}
              label={label}
              placeholder={tooltip}
              value={value}
              onChange={onChange}
              variant="outlined"
              type={type}
              InputProps={{
                ...inputProps,
                endAdornment: (
                  <InputAdornment position="end">
                    {icon && (
                      <IconButton onClick={onIconClick}>
                        {icon}
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
                readOnly: readonly,
              }}
              inputProps={{ maxLength: maxLength || 100 }}
              sx={{
                width: '100%',
              }}
            />
          </Box>
        </div>
      )}
    </ThemeProvider>
  );
};

export default CampoTexto;
