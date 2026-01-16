import React, { useState, useEffect } from 'react';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Avatar from '@mui/material/Avatar';
import { Stack, Box } from "@mui/material";
import { DropDownItens } from '../Interfaces/DropDown/dropdownItens';
import { SelectItens } from '../Interfaces/shared/selectItens';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import '../assets/styles/shared/campos.css'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const Dropdown: React.FC<{ dropProps: DropDownItens }> = ({ dropProps }) => {
  const [inputValue, setInputValue] = useState('');
  const [wasPrefilled, setWasPrefilled] = useState(false);
  const [selected, setSelected] = useState<SelectItens | null>(null);
  const [isUpdate, setIsUpdate] = useState<boolean>(true);

  useEffect(() => {

    if (!isUpdate) {
      return;
    }
    const match =
      dropProps.itens?.find(i => i.key.toString() === dropProps.selectedId?.toString()) || null;

    setSelected(match);

    if (match) {
      setInputValue(match.value ?? '');
      setWasPrefilled(false);
    } else if (typeof dropProps.value === 'string' && dropProps.value) {
      setInputValue(dropProps.value);
      setWasPrefilled(true);
    } else {
      setInputValue('');
      setWasPrefilled(false);
    }
  }, [dropProps.selectedId, dropProps.itens, dropProps.value, isUpdate]);

  const handleChange = (event: SelectChangeEvent<string>) => {
    dropProps.onChange?.(event);
    dropProps.onChangeItem?.(event.target.value);
  };

  const clearSelection = () => {
    setSelected(null);
    setInputValue('');
    setWasPrefilled(false);
    dropProps.onChange?.({ target: { value: '0' } } as any);
    dropProps.onChangeItem?.('0');
    dropProps.onInputChange?.('');
    setIsUpdate(false);
  };

  const handleAutoCompleteChange = (
    _event: React.SyntheticEvent,
    newValue: SelectItens | null,
    reason: string
  ) => {
    if (reason === 'clear' || newValue === null) {
      clearSelection();
      return;
    }
    setSelected(newValue);
    setInputValue(newValue.value ?? '');
    setWasPrefilled(false);
    dropProps.onChange?.({ target: { value: newValue.key } } as any);
    dropProps.onChangeItem?.(String(newValue.key));
    setIsUpdate(false);
  };

  const handleAutoCompleteInputChange = (
    _event: React.SyntheticEvent,
    newInput: string,
    reason: string
  ) => {
    if (reason === 'clear') {
      clearSelection();
      return;
    }
    if (reason === 'input' && (wasPrefilled || selected)) {
      setSelected(null);
      setWasPrefilled(false);
      dropProps.onChange?.({ target: { value: '0' } } as any);
      dropProps.onChangeItem?.('0');
    }

    setInputValue(newInput);
    dropProps.onInputChange?.(newInput);
    setIsUpdate(false);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={`erroSession_${dropProps.erroSession}`}></div>

      <div className='textBox'>
        {dropProps.isTextRead ? (
          <Autocomplete<SelectItens>
            disablePortal
            options={dropProps.itens || []}
            value={selected}
            inputValue={inputValue}
            getOptionLabel={(option) => option?.value || ""}
            isOptionEqualToValue={(opt, val) => opt?.key === val?.key}
            onChange={handleAutoCompleteChange}
            onInputChange={handleAutoCompleteInputChange}
            clearOnBlur={false}
            filterSelectedOptions
            disabled={dropProps.isLeitura ?? false}
            filterOptions={(options) => options}
            disableClearable={false}

            renderInput={(params) => (
              <TextField
                {...params}
                label={dropProps.label}
                name={dropProps.name}
                placeholder={dropProps.placeholder}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      {selected?.isAvatar && (
                        <Box sx={{ ml: 1, display: "inline-flex", alignItems: "center" }}>
                          <Avatar src={selected.urlImagem} sx={{ width: 24, height: 24, mr: 1 }}>
                            {(selected.value ?? "").charAt(0)}
                          </Avatar>
                        </Box>
                      )}
                      {params.InputProps.startAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        ) : (
          <FormControl fullWidth>
            <InputLabel>{dropProps.label}</InputLabel>
            <Select
              value={dropProps.selectedId?.toString() ?? '0'}
              onChange={handleChange}
              label={dropProps.label}
              disabled={dropProps.isLeitura ?? false}
              name={dropProps.name}
              id={dropProps.id}
            >
              <MenuItem value="0">
                {dropProps.placeholder || 'Selecione...'}
              </MenuItem>
              {dropProps.itens?.map((item) => (
                <MenuItem key={item.key} value={item.key}>
                  {item.isAvatar ? (
                    <Stack direction="row" alignItems="center" gap={1}>
                      <Avatar src={item.urlImagem} sx={{ width: 28, height: 28 }}>
                        {(item.value ?? "").charAt(0)}
                      </Avatar>
                      <span>{item.value}</span>
                    </Stack>
                  ) : (
                    <span>{item.value}</span>
                  )}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </div>
    </ThemeProvider>
  );
};

export default Dropdown;
