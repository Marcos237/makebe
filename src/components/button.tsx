import * as React from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { Tooltip } from '@mui/material';
import { BotaoItens } from '../Interfaces/Botao/botao';

const Botao: React.FC<{ botaoProps: BotaoItens }> = ({ botaoProps }) => {
    const {
        className,
        name,
        tooltip,
        onIconClick,
        onKeyDown,
        icon: Icon,
        isLoading,
        isDisable,
        classIcone,
        variantStyle = 'primary',
        backgroundColor// 👈 fallback
    } = botaoProps;


    const getBackground = () => {
        switch (variantStyle) {
            case 'success':
                return 'var(--gradient-success)';
            case 'danger':
                return 'var(--gradient-danger)';
            default:
                return 'var(--gradient-primary)';
        }
    };

    return (
        <Tooltip title={tooltip || ''}>
            <Button
                className={className}
                variant="contained"
                disableElevation
                onClick={onIconClick}
                onKeyDown={onKeyDown}
                disabled={isLoading || isDisable}
                startIcon={
                    !isLoading && Icon ? (
                        <Icon className={classIcone} />
                    ) : null
                }
                sx={{
                    textTransform: 'none',
                    fontFamily: 'inherit',
                    width: '100%',
                    maxWidth: '260px',
                    padding: '14px 24px',
                    borderRadius: '999px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
                    transition: 'all 0.25s ease',
                    background: backgroundColor || getBackground(),

                    '&:hover': {
                        background: `${backgroundColor || getBackground()} !important`,
                        transform: 'translateY(-2px)',
                        opacity: 0.96,
                        boxShadow: '0 14px 36px rgba(0,0,0,0.7)',
                        filter: 'none !important',
                    },

                    '&:active': {
                        transform: 'scale(0.97)',
                    },

                    '&.Mui-disabled': {
                        background: 'var(--glass-bg)',
                        color: 'var(--text-secondary)',
                        boxShadow: 'none',
                        cursor: 'not-allowed',
                    }
                }}
            >
                {isLoading ? (
                    <CircularProgress size={20} color="inherit" />
                ) : (
                    name
                )}
            </Button>
        </Tooltip>
    );
};

export default Botao;
