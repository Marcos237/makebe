import * as React from 'react';
import { TextBoxItens } from '../Interfaces/TextBox/TextboxItens';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import CustomMaskedInput from './maskaras';
import '../assets/styles/shared/campos.css'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0d0d0d',
      paper: '#1a1a1a',
    },
    text: {
      primary: '#f0f0f0',
      secondary: '#ccc',
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          '& fieldset': {
            borderColor: '#333',
          },
          '&:hover fieldset': {
            borderColor: '#555',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#007bff',
            boxShadow: '0 0 0 2px rgba(0, 123, 255, 0.2)',
          },
        },
        input: {
          color: '#f0f0f0',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#aaa',
          '&.Mui-focused': {
            color: '#007bff',
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
    maxLength
  } = textBoxProps;

  const inputProps = mask && mask.length > 0 ? {
    inputComponent: CustomMaskedInput as any,
    inputProps: { mask },
  } : {};
  return (
    <ThemeProvider theme={darkTheme}>
      {textBoxProps && (
        <div className='textBox'>
          <Box component="div" >
            <div className={`erroSession_${textBoxProps.erroSession}`}>

            </div>
            <TextField
              id={name}
              name={name}
              multiline={multiline}
              rows={multiline ? rows || 4 : undefined}
              label={label}
              placeholder={tooltip}
              value={value}
              onChange={onChange}
              variant="outlined"
              type={type}
              className={textBoxProps.errorClass}
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
