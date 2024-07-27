import * as React from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { BotaoItens } from '../Interfaces/Botao/botao';

const Botao: React.FC<{ botaoProps: BotaoItens }> = ({ botaoProps }) => {
    const { name, tooltip, label, onIconClick, onKeyDown, icon: Icon, color, width, isLoading, isDisable } = botaoProps;

    return (
        <Button
            variant="contained"
            color={color}
            title={tooltip}
            aria-label={label}
            onClick={onIconClick}
            onKeyDown={onKeyDown}
            style={{ width: width }}
            disabled={isLoading}
        >
            {isLoading && !isDisable? (
                <CircularProgress size={24} color="primary" />
            ) : (
                <>
                    {Icon && <Icon />}
                    {name}
                </>
            )}
        </Button>
    );
};

export default Botao;
