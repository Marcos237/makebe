import { SvgIconComponent } from '@mui/icons-material';
import { ButtonProps } from '@mui/material/Button';

export interface BotaoItens {
    name?: string;
    tooltip: string;
    label: string;
    onIconClick: () => void;
    onKeyDown?: () => React.KeyboardEvent<HTMLDivElement>;
    icon?: SvgIconComponent;
    width: string;
    color: ButtonProps['color'];
    isLoading?: boolean;
    isDisable?: boolean
}

