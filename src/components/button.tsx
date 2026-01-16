import * as React from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { BotaoItens } from '../Interfaces/Botao/botao';
import { Tooltip } from '@mui/material';

const Botao: React.FC<{ botaoProps: BotaoItens }> = ({ botaoProps }) => {
    const {
        name,
        tooltip,
        label,
        onIconClick,
        onKeyDown,
        icon: Icon,
        color = 'primary',
        width,
        isLoading,
        isDisable,
        classIcone,
        marginRight,
        marginLeft,
    } = botaoProps;


    return (
        <>
            <Tooltip title={tooltip}>
                <Button
                    variant="contained" 
                    color={color}
                    aria-label={label}
                    startIcon={
                        !isLoading && Icon ? (
                            <Icon
                                onClick={onIconClick}
                                className={classIcone}
                                style={{ marginRight: { marginRight }, marginLeft: { marginLeft } }}
                            />
                        ) : null
                    }
                    onClick={onIconClick}
                    onKeyDown={onKeyDown}
                    style={{ width }}
                    disabled={isLoading || isDisable}
                    sx={{
                        '&.Mui-disabled': {
                            backgroundColor: '#34495e',
                            border: '2px solid #21618c',
                            opacity: 1,
                            color: '#ffffff',
                        },
                    }}
                >
                    {isLoading && !isDisable ? (
                        <CircularProgress size={20} color="inherit" className='botao-wait' />
                    ) : (
                        name
                    )}
                </Button>
            </Tooltip>
        </>
    );
};

export default Botao;
