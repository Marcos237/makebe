import React, { FC, useState, useEffect } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { SessaoItens } from '../Interfaces/shared/sessaoItens';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import '../assets/styles/shared/sessao.css';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const Sessao: FC<{ sessaoProps: SessaoItens[], isOpen: number }> = ({ sessaoProps, isOpen }) => {
    const [expanded, setExpanded] = useState<string | false>(false);
    useEffect(() => {
        if (isOpen > 0) {
            setExpanded(`panel0`);
        } else {
            setExpanded(false);
        }
    }, [isOpen]);

    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <div className='sessaoItem'>
                {sessaoProps.map((sessao, index) => (
                    <Accordion
                        key={index}
                        expanded={expanded === `panel${index}`}
                        onChange={handleChange(`panel${index}`)}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`panel${index}-content`}
                            id={`panel${index}-header`}
                        >
                            <Typography>{sessao.nome}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {sessao.conteudo}
                        </AccordionDetails>
                    </Accordion>
                ))}
            </div>
        </ThemeProvider>
    );
};

export default Sessao;
