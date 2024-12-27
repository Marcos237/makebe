import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { DropDownItens } from '../Interfaces/DropDown/dropdownItens';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const Dropdown: React.FC<{ dropProps: DropDownItens }> = ({ dropProps }) => {
  const handleChange = (event: SelectChangeEvent<string>) => {
    if (dropProps.onChange) {
      dropProps.onChange(event);
    }
  };

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <FormControl fullWidth>
        <InputLabel>{dropProps.label}</InputLabel>
        <Select
          value={dropProps.selectedId?.toString() ?? '0'}
          onChange={handleChange}
          label={dropProps.label}
        >
          <MenuItem value="0">
            {dropProps.placeholder || 'Selecione...'}
          </MenuItem>
          {dropProps.itens &&
            Array.isArray(dropProps.itens) &&
            dropProps.itens.map((item) => (
              <MenuItem key={item.key} value={item.key}>
                {item.value}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </ThemeProvider>
  );
};

export default Dropdown;
