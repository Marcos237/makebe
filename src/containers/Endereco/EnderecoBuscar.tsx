import React, { useState } from "react";
import Dropdown from "../../components/dropdown";
import CampoTexto from "../../components/textbox";
import Botao from '../../components/button';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import { SelectChangeEvent } from '@mui/material/Select';
import { Grid } from '@mui/material';
import { BotaoItens } from '../../Interfaces/Botao/botao';
import { SelectItens } from '../../Interfaces/shared/selectItens';
import { PaginacaoItens } from "../../Interfaces/shared/PaginacaoItens";
import { EnderecoItens } from "../../Interfaces/Endereco/enderecoItens";
import { GetPaginadoService } from '../../services/shared/getPaginadoService';
import { API_BASE_AGENDA_URL } from "../../config/apiConfig";
import { UrlBuscarPaginado } from "../../constants/Endereco/enderecoConstants";

import '../../assets/styles/Endereco/enderecoBuscar.css';


const EnderecoBuscar: React.FC<{ selectItens: SelectItens[], onResultadosBusca: (resultados: PaginacaoItens<EnderecoItens>) => void }> = 
    ({ selectItens, onResultadosBusca }) => {
        const [LojaIdBusca, setLojaBusca] = useState<number>();
        const [logradouro, setLogradouro] = useState<string>('');
        const [isLoading, setIsLoading] = useState<boolean>(false);

        const handleButtonClick = () => {
            const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
            handleSearch(fakeEvent);
        };

        const handleSearch = async (event: React.FormEvent) => {
            event.preventDefault();
            setIsLoading(true);

            const loja: EnderecoItens = {
                logradouro: logradouro,
                lojaId: LojaIdBusca
            };
            const paginacao: PaginacaoItens<EnderecoItens> = {
                quantidadePagina: 6,
                paginaAtual: 1,
                totalPaginas: 1,
                total: 0,
                objetoPesquisa: loja,
                objetos: []
            };
            const enderecoService = await GetPaginadoService(paginacao ?? {}, `${API_BASE_AGENDA_URL}${UrlBuscarPaginado}` );
            onResultadosBusca(enderecoService ?? {});
            setIsLoading(false);
        };

        const handleButtonClickLimpar = async () => {
            setLogradouro('');
            setLojaBusca(0);
            setIsLoading(true);
            const paginacao: PaginacaoItens<EnderecoItens> = {
                quantidadePagina: 6,
                paginaAtual: 1,
                totalPaginas: 1,
                total: 0,
                objetoPesquisa: {},
                objetos: []
            };
            const enderecoService = await GetPaginadoService(paginacao ?? {}, `${API_BASE_AGENDA_URL}${UrlBuscarPaginado}` );
            onResultadosBusca(enderecoService ?? {});
            setIsLoading(false);
        };

        const handleDropdownChange = (e: SelectChangeEvent<string>) => {
            setLojaBusca(Number(e.target.value));
        };

        const botaoProps: BotaoItens = {
            tooltip: 'Buscar',
            width: '20px',
            onIconClick: handleButtonClick,
            isLoading: isLoading,
            color: 'success',
            icon: SearchIcon
        };

        const botaoLimparProps: BotaoItens = {
            tooltip: 'Limpar',
            width: '20px',
            color: 'info',
            icon: RefreshIcon,
            onIconClick: handleButtonClickLimpar
        };

        return (
            <div className="enderecoBuscarConteudo">
                <div className="gridBuscarEndereco">
                    <div className="titulobusca">
                        <h4>Buscar</h4>
                    </div>

                    <Grid container spacing={2} className="formItensBusca ">
                        <Grid item md={6} xs={11}>
                            <div className="formItens-drop formItemMenor">
                                <Dropdown
                                    dropProps={{
                                        name: "Loja",
                                        label: "Loja*",
                                        itens: selectItens,
                                        selectedId: LojaIdBusca?.toString() || '',
                                        onChange: handleDropdownChange,
                                    }}
                                />
                            </div>
                        </Grid>

                        <Grid item md={6} xs={11} className='gridBuscarDireitoEndereco'>
                            <div className="formItens formItemMenor">
                                <CampoTexto
                                    textBoxProps={{
                                        name: "Logradouro",
                                        tooltip: "Digite seu logradouro",
                                        label: "Logradouro*",
                                        type: 'text',
                                        readonly: false,
                                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setLogradouro(e.target.value)
                                    }}
                                />
                            </div>

                            <Grid container item xs={11} justifyContent="flex-end" spacing={2}>
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
                    </Grid>
                </div>
            </div>
        );
    };

export default EnderecoBuscar;
