import * as React from 'react';
import { TextBoxItens } from '../Interfaces/TextBox/TextboxItens';
import Box from '@mui/material/Box';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import CustomMaskedInput from './maskaras';  

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
    readonly
  } = textBoxProps;

  const inputProps = mask && mask.length > 0 ? {
    inputComponent: CustomMaskedInput as any,
    inputProps: { mask }
  } : {};

  return (
    <>
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
              disabled={readonly}
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
              }}
              sx={{
                width: '100%',
                '@media (min-width: 600px)': {
                  width: '100%',
                },
                '@media (min-width: 960px)': {
                  width: '100%',
                },
                '@media (min-width: 1280px)': {
                  width: '98%',
                },
              }}
            />
          </Box>
        </div>
      )}
    </>
  );
};

export default CampoTexto;
