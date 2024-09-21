import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { DropDownItens } from '../Interfaces/DropDown/dropdownItens';

const Dropdown: React.FC<{ dropProps: DropDownItens }> = ({ dropProps }) => {
  return (
    <div className="drop-down">
      <FormControl
        fullWidth
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
      >
        <InputLabel>{dropProps.label}</InputLabel>
        <Select
          value={dropProps.name}
          label={dropProps.label}
        >
          <MenuItem value="" >
            {dropProps.placeholder || 'Selecione...'}
          </MenuItem>
          {dropProps.itens &&
            Array.isArray(dropProps.itens) &&
            dropProps.itens.map((item) => (
              <MenuItem key={item.key} value={item.value}>
                {item.value}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default Dropdown;
