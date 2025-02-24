import React, { useState } from "react";
import Dropdown from "../../components/dropdown";
import CampoTexto from "../../components/textbox";
import Botao from '../../components/button';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import { paginar } from "../../functions/paginacao";
import { SelectChangeEvent } from '@mui/material/Select';
import { PersistirItens } from "../../Interfaces/shared/persistirItens";
import { TipoUsuarioLojaId, TipoUsuarioColaboradorId } from '../../constants/Usuario/usuarioConstant';
import { Grid } from '@mui/material';
import { BotaoItens } from '../../Interfaces/Botao/botao';
import { PaginacaoItens } from "../../Interfaces/shared/PaginacaoItens";
import { EnderecoItens } from "../../Interfaces/Endereco/enderecoItens";
import { GetPaginadoService } from '../../services/shared/getPaginadoService';
import { API_BASE_AGENDA_URL } from "../../config/apiConfig";
import { UrlBuscarPaginado } from "../../constants/Endereco/enderecoConstants";

import '../../assets/styles/Endereco/enderecoBuscar.css';


const EnderecoBuscar: React.FC<{
    selectItens: Array<PersistirItens<EnderecoItens>>,
    tipoUsuarioId: string,
    page:  number,
    onResultadosBusca: (resultados: PaginacaoItens<EnderecoItens>) => void
}> =
    ({ selectItens, tipoUsuarioId, onResultadosBusca, page }) => {
        const [LojaIdBusca, setLojaBusca] = useState<number>();
        const [colaboradorId, setColaboradorId] = useState<number>();
        const [logradouro, setLogradouro] = useState<string>('');
        const [isLoading, setIsLoading] = useState<boolean>(false);
        const [colaborador, setColaborador] = useState<string>('');
        const [loja, setLoja] = useState<string>('');
        const colaboradorProps = selectItens.find((item) => item.name === "colaborador")?.selectItems ?? [];
        const lojaProps = selectItens.find((item) => item.name === "loja")?.selectItems ?? [];

        const handleButtonClick = () => {
            const fakeEvent = { preventDefault: () => { } } as React.FormEvent;
            handleSearch(fakeEvent);
        };
        const handleSearch = async (event: React.FormEvent) => {
            event.preventDefault();
            setIsLoading(true);

            const endereco: EnderecoItens = {
                logradouro: logradouro ?? "",
                lojaId: LojaIdBusca,
                nomeColaborador: tipoUsuarioId === TipoUsuarioColaboradorId ? colaborador ?? "" : "",
                razaoSocial: tipoUsuarioId === TipoUsuarioLojaId ? loja ?? "" : "",
                tipoUsuarioId: Number(tipoUsuarioId) ?? 0,
            };
            const paginacao = paginar(endereco, page);
            const enderecoService = await GetPaginadoService(paginacao ?? {}, `${API_BASE_AGENDA_URL}${UrlBuscarPaginado}`);
            onResultadosBusca(enderecoService ?? {});
            setIsLoading(false);
        };

        const handleButtonClickLimpar = async () => {

            setLogradouro("");
            setColaborador("");
            if (tipoUsuarioId === TipoUsuarioLojaId) {
                setLojaBusca(0);
            }
            if (tipoUsuarioId === TipoUsuarioColaboradorId) {
                setColaboradorId(0);
            }
            setIsLoading(true);

            const endereco : EnderecoItens = {
                tipoUsuarioId : Number(tipoUsuarioId)
            };
            const paginacao = paginar(endereco, 1)
            const enderecoService = await GetPaginadoService(paginacao ?? {}, `${API_BASE_AGENDA_URL}${UrlBuscarPaginado}`);
            onResultadosBusca(enderecoService ?? {});
            setIsLoading(false);
        };

        const handleDropdownChange = (e: SelectChangeEvent<string>, tipo: string) => {
            const selectedKey = e.target.value;
            const selectedItem = getSelectedItemByTipo(tipo, selectedKey);
            const selectedValue = selectedItem?.value || '';

            switch (tipo) {
                case "colaborador":
                    setColaboradorId(Number(selectedKey));
                    setColaborador(selectedValue);
                    setLojaBusca(Number(0));
                    setLoja('');
                    break;
                case "loja":
                    setLojaBusca(Number(selectedKey));
                    setLoja(selectedValue);
                    setColaboradorId(0);
                    setColaborador('');
                    break;
                default:
                    return null;
            }
        };

        const getSelectedItemByTipo = (tipo: string, selectedKey: string) => {
            switch (tipo) {
                case "colaborador":
                    return colaboradorProps.find(item => item.key === selectedKey);
                case "loja":
                    return lojaProps.find(item => item.key === selectedKey);
                default:
                    return null;
            }
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
                        <div className="formItens formItemMenor">
                                {tipoUsuarioId?.toString() === TipoUsuarioLojaId && (
                                    <div className="formItens">
                                        <Dropdown
                                            dropProps={{
                                                name: "Loja",
                                                label: "Loja*",
                                                itens: lojaProps ?? [],
                                                selectedId: LojaIdBusca?.toString() || '',
                                                onChange: (e: SelectChangeEvent<string>) => handleDropdownChange(e, "loja")
                                            }}
                                        />
                                    </div>
                                )}
                                {tipoUsuarioId?.toString() === TipoUsuarioColaboradorId && (
                                    <div className="formItens-drop">
                                        <Dropdown
                                            dropProps={{
                                                name: "Colaborador",
                                                label: "Colaborador*",
                                                itens: colaboradorProps,
                                                selectedId: colaboradorId || '0',
                                                onChange: (e: SelectChangeEvent<string>) => handleDropdownChange(e, "colaborador"),
                                            }}
                                        />
                                    </div>
                                )}
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
                                        value: logradouro,
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
