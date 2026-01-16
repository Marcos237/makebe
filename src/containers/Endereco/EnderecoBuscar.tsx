import { paginar } from "../../functions/paginacao";
import { SelectChangeEvent } from '@mui/material/Select';
import { PersistirItens } from "../../Interfaces/shared/persistirItens";
import { TipoUsuarioLojaId, TipoUsuarioColaboradorId } from '../../constants/Usuario/usuarioConstant';
import { Grid } from '@mui/material';
import { PaginacaoItens } from "../../Interfaces/shared/PaginacaoItens";
import { EnderecoItens } from "../../Interfaces/Endereco/enderecoItens";
import { GetPaginadoService } from '../../services/shared/getPaginadoService';
import { API_BASE_AGENDA_URL } from "../../config/apiConfig";
import { UrlBuscarPaginado } from "../../constants/Endereco/enderecoConstants";
import { getSelectedItemByTipo } from '../../functions/tipoSelectedFunction';
import React, { useState } from "react";
import { Tooltip } from '@mui/material';
import { FaSearch } from "react-icons/fa";
import Dropdown from "../../components/dropdown";
import CampoTexto from "../../components/textbox";
import RefreshIcon from '@mui/icons-material/Refresh';


const EnderecoBuscar: React.FC<{
    selectItens: Array<PersistirItens<EnderecoItens>>,
    tipoUsuarioId: string,
    page: number,
    onResultadosBusca: (resultados: PaginacaoItens<EnderecoItens>) => void
}> =
    ({ selectItens, tipoUsuarioId, onResultadosBusca, page }) => {
        const [LojaIdBusca, setLojaBusca] = useState<number>();
        const [colaboradorId, setColaboradorId] = useState<number>();
        const [logradouro, setLogradouro] = useState<string>('');
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

            const endereco: EnderecoItens = {
                tipoUsuarioId: Number(tipoUsuarioId)
            };
            const paginacao = paginar(endereco, 1)
            const enderecoService = await GetPaginadoService(paginacao ?? {}, `${API_BASE_AGENDA_URL}${UrlBuscarPaginado}`);
            onResultadosBusca(enderecoService ?? {});
        };

        const handleDropdownChange = (e: SelectChangeEvent<string>, tipo: string) => {
            const selectedKey = e.target.value;
            const selectedItem = getSelectedItemByTipo(tipo, selectedKey, colaboradorProps, lojaProps);
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

        return (
            <Grid container spacing={2} className="ContainerGrid">
                <div className="conteudo">
                    <fieldset className='icone-box icone-box-form'>
                        <legend>Pesquisar</legend>
                        <div className="conteudoPesquisa">
                            <Grid container spacing={2}>
                                <Grid item xs={10} md={4}>

                                    {tipoUsuarioId?.toString() === TipoUsuarioLojaId && (
                                        <div className="formItens-drop">
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
                                </Grid>
                                <Grid item xs={10} md={4}>
                                    <div className="formItens">
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
                                </Grid>
                                <Grid container item xs={11} justifyContent="flex-end" spacing={2}>
                                    <Grid item>
                                        <div className='botaoBuscar'>
                                            <div className="link-busca">
                                                <button onClick={handleButtonClick} className="botao-link">
                                                    <Tooltip title="buscar">
                                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                                            <FaSearch />
                                                        </span>
                                                    </Tooltip>
                                                </button>
                                                <button onClick={handleButtonClickLimpar} className="botao-link">
                                                    <Tooltip title="limpar">
                                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                                            <RefreshIcon />
                                                        </span>
                                                    </Tooltip>
                                                </button>
                                            </div>
                                        </div>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </div>
                    </fieldset>
                </div>
            </Grid>
        );
    };

export default EnderecoBuscar;
