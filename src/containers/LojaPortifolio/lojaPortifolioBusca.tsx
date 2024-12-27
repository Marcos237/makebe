import React, { useState } from "react";
import CampoTexto from "../../components/textbox";
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import Botao from '../../components/button';
import Dropdown from "../../components/dropdown";
import { PaginacaoItens } from "../../Interfaces/shared/PaginacaoItens";
import { LojaPortifolioItem } from "../../Interfaces/LojaPortifolio/lojaportifolioItem";
import { Grid } from "@mui/material";
import { BotaoItens } from '../../Interfaces/Botao/botao';
import { SelectChangeEvent } from '@mui/material/Select';
import { SelectItens } from "../../Interfaces/shared/selectItens";
import { GetPaginadoService } from "../../services/shared/getPaginadoService";
import { API_BASE_AGENDA_URL } from "../../config/apiConfig";
import { UrlBuscarPaginado } from "../../constants/LojaPortifolio/LojaPortifolioConstant";


const LojaPortifolioBusca: React.FC<{ selectItens: SelectItens[], onResultadosBusca: (resultado: PaginacaoItens<LojaPortifolioItem>) => void }> =
    ({ selectItens, onResultadosBusca }) => {
        const [titulo, setTitulo] = useState<string>('');
        const [subTitulo, setSubTitulo] = useState<string>('');
        const [isLoading, setIsLoading] = useState<boolean>(false);
        const [lojaId, setLojaId] = useState<number>();

        const handleButtonClick = () => {
            const fakeEvent = {
                preventDefault: () => { }
            } as React.FormEvent;
            handleSubmit(fakeEvent);
        };


        const handleSubmit = async (event: React.FormEvent) => {
            event.preventDefault();
            setIsLoading(true);
            const lojaPortifolio: LojaPortifolioItem = {
                lojaId: lojaId,
                titulo: titulo || '',
                subTitulo: subTitulo || ''
            }
            const paginacao: PaginacaoItens<LojaPortifolioItem> = {
                quantidadePagina: 6,
                paginaAtual: 1,
                totalPaginas: 1,
                total: 0,
                objetoPesquisa: lojaPortifolio,
                objetos: []
            };
            const lojaResponse = await GetPaginadoService(paginacao ?? {}, `${API_BASE_AGENDA_URL}${UrlBuscarPaginado}`)
            onResultadosBusca(lojaResponse ?? {});
            setIsLoading(false);
        }

        const handleButtonClickLimpar = async () => {
            setLojaId(0);
            setTitulo('');
            setSubTitulo('')
            setIsLoading(true);
            const paginacao: PaginacaoItens<LojaPortifolioItem> = {
                quantidadePagina: 6,
                paginaAtual: 1,
                totalPaginas: 1,
                total: 0,
                objetoPesquisa: {},
                objetos: []
            };
            const lojaResponse = await GetPaginadoService(paginacao ?? {}, `${API_BASE_AGENDA_URL}${UrlBuscarPaginado}`)
            onResultadosBusca(lojaResponse ?? {});
            setIsLoading(false);
        };

        const botaoProps: BotaoItens = {
            tooltip: 'buscar',
            width: '20px',
            onIconClick: handleButtonClick,
            color: 'success',
            isLoading: isLoading,
            icon: SearchIcon
        };

        const botaoLimparProps: BotaoItens = {
            tooltip: 'limpar',
            width: '20px',
            onIconClick: handleButtonClickLimpar,
            color: 'info',
            icon: RefreshIcon
        };

        const handleDropdownChange = (e: SelectChangeEvent<string>) => {
            setLojaId(Number(e.target.value));
        };

        return (
            <>
                <div className="conteudoBusca">
                    <div className="titulobusca">
                        <h4>Buscar</h4>
                    </div>
                    <Grid container spacing={3}>
                        <Grid item xs={11} md={4}>
                            <div className="formItens formItemMenor">
                                <Dropdown
                                    dropProps={{
                                        name: "Loja",
                                        label: "Loja*",
                                        itens: selectItens ?? [],
                                        selectedId: lojaId?.toString() || '',
                                        onChange: handleDropdownChange
                                    }}
                                />
                            </div>
                        </Grid>
                        <Grid item xs={11} md={4}>
                            <div className="formItens formItemMenor">
                                <CampoTexto
                                    textBoxProps={{
                                        name: "titulo",
                                        tooltip: "digite seu título",
                                        label: "título",
                                        value: titulo,
                                        type: 'text',
                                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setTitulo(e.target.value)
                                    }}
                                />
                            </div>
                        </Grid>

                        <Grid item xs={11} md={4}>
                            <div className="formItens formItemMenor subtitulo">
                                <CampoTexto
                                    textBoxProps={{
                                        name: "subtitulo",
                                        tooltip: "digite seu subtitulo",
                                        label: "subtitulo",
                                        value: subTitulo,
                                        type: 'text',
                                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setSubTitulo(e.target.value)
                                    }}
                                />
                            </div>
                        </Grid>
                        <Grid container item xs={12} justifyContent="flex-end" spacing={2}>
                            <Grid item>
                                <div className='botaoBuscar'>
                                    <Botao botaoProps={botaoProps} />
                                </div>
                            </Grid>
                            <Grid item>
                                <div className='botaoLimpar'>
                                    <Botao botaoProps={botaoLimparProps} />
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </>
        );
    }
export default LojaPortifolioBusca