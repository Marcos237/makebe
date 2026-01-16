import { ButtonProps } from '@mui/material/Button';
import { ComponentType } from 'react';

export interface BotaoItens {
  name?: string;
  tooltip?: string;
  label?: string;
  onIconClick?: () => void;
  onKeyDown?: () => React.KeyboardEvent<HTMLDivElement>;
  icon?: ComponentType<any>; 
  width?: string;
  color?: ButtonProps['color'];
  isLoading?: boolean;
  isDisable?: boolean;
  classIcone?: string;
  marginRight?: string;
  marginLeft?: string;
  type?: string;
  form?: string;
}
