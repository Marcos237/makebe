import React, { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import { GrigViewItens } from '../Interfaces/shared/gridviewItens';
import Pagination from '@mui/material/Pagination';
import '../assets/styles/shared/gridview.css';

const GridViewLista: React.FC<{ gridviewProps: GrigViewItens<any> }> = ({ gridviewProps }) => {

    if (!Array.isArray(gridviewProps.paginacao?.objetos) || gridviewProps.paginacao?.objetos?.length === 0) {
        return (
            <div className='lista-container'>
                <div className='texto-vazio'>
                    <p>Nenhum item encontrado...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className='grid-container'>
                <div className="grid-header">
                    {gridviewProps?.paginacao?.objetos?.length ? (
                        Object.keys(gridviewProps.paginacao.objetos[0]).map((key) => (
                            gridviewProps?.propertyLabels?.[key] && (
                                <div key={key} className="grid-column-header">
                                    <strong>{gridviewProps.propertyLabels[key]}</strong>
                                </div>
                            )
                        ))
                    ) : null}
                </div>

                {gridviewProps.paginacao?.objetos?.map((item, index) => (
                    <div key={index} className="grid-row">
                        {Object.keys(item).map((key) => (
                            <div
                                key={key}
                                className="grid-column-item"
                                style={{ display: gridviewProps?.propertyLabels?.[key] ? 'block' : 'none' }}
                            >
                                <div className="grid-text">
                                    {item[key] ? item[key] : 'Não informado'}
                                </div>
                            </div>
                        ))}

                        <div className="icons-buttons">
                            {gridviewProps.actionButtons?.map((button) => (
                                <div key={button.id} className="buttons-itens">
                                    <a href={button.href} onClick={(event) => button.onClick?.(event, item)}>
                                        <IconButton aria-label={button.label}>
                                            {button.icon}
                                        </IconButton>
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                <div className="pagination-container">
                    <Pagination
                        count={gridviewProps.paginacao?.totalPaginas}
                        page={gridviewProps.paginacao?.paginaAtual}
                        onChange={gridviewProps.onPageChange}
                        color="primary"
                        showFirstButton
                        showLastButton
                    />
                </div>
                <div className='paginacaototal'>
                    <h4>total: {gridviewProps?.paginacao?.total}</h4>
                </div>
            </div>
        </>
    );
};

export default GridViewLista;
