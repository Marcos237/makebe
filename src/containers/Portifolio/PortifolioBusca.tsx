import React, { useState } from "react";
import { PaginacaoItens } from "../../Interfaces/shared/PaginacaoItens";
import { PortifolioItem } from "../../Interfaces/Portifolio/portifolioItem";
import { Grid } from "@mui/material";
import { SelectChangeEvent } from '@mui/material/Select';
import { PersistirItens } from "../../Interfaces/shared/persistirItens";
import { GetPaginadoService } from "../../services/shared/getPaginadoService";
import { API_BASE_AGENDA_URL } from "../../config/apiConfig";
import { UrlBuscarPaginado } from "../../constants/Portifolio/PortifolioConstant";
import { TipoUsuarioLojaId, TipoUsuarioColaboradorId } from '../../constants/Usuario/usuarioConstant';
import { getSelectedItemByTipo } from '../../functions/tipoSelectedFunction';
import { Tooltip } from '@mui/material';
import { FaSearch } from "react-icons/fa";
import { FaFilter } from "react-icons/fa";
import CampoTexto from "../../components/textbox";
import RefreshIcon from '@mui/icons-material/Refresh';
import Dropdown from "../../components/dropdown";


const PortifolioBusca: React.FC<{
    selectItens: Array<PersistirItens<PortifolioItem>>,
    tipoUsuarioId: string,
    onResultadosBusca: (resultado: PaginacaoItens<PortifolioItem>) => void
}> =
    ({ selectItens, tipoUsuarioId, onResultadosBusca }) => {
        const [titulo, setTitulo] = useState<string>('');
        const [subTitulo, setSubTitulo] = useState<string>('');
        const [lojaId, setLojaId] = useState<number>(0);
        const [colaborador, setColaborador] = useState<string>('');
        const [loja, setLoja] = useState<string>('');
        const [colaboradorId, setColaboradorId] = useState<number>(0);
        const colaboradorProps = selectItens.find((item) => item.name === "colaborador")?.selectItems ?? [];
        const lojaProps = selectItens.find((item) => item.name === "loja")?.selectItems ?? [];
        const [mostrarFiltros, setMostrarFiltros] = useState(false);

        const handleButtonClick = () => {
            const fakeEvent = {
                preventDefault: () => { }
            } as React.FormEvent;
            handleSubmit(fakeEvent);
            setMostrarFiltros(false);
        };


        const handleSubmit = async (event: React.FormEvent) => {
            event.preventDefault();
            const portifolio: PortifolioItem = {
                nomeColaborador: tipoUsuarioId === TipoUsuarioColaboradorId ? colaborador ?? "" : "",
                razaoSocial: tipoUsuarioId === TipoUsuarioLojaId ? loja ?? "" : "",
                titulo: titulo || '',
                subTitulo: subTitulo || '',
                lojaId: tipoUsuarioId === TipoUsuarioLojaId ? lojaId ?? 0 : 0,
                colaboradorId: tipoUsuarioId === TipoUsuarioColaboradorId ? colaboradorId ?? 0 : 0,
                tipoUsuarioId: Number(tipoUsuarioId) ?? 0
            }
            buscarPaginado(portifolio);
        }

        const buscarPaginado = async (objeto?: PortifolioItem) => {
            const paginacao: PaginacaoItens<PortifolioItem> = {
                quantidadePagina: 6,
                paginaAtual: 1,
                totalPaginas: 1,
                total: 0,
                objetoPesquisa: objeto ?? {},
                objetos: []
            };
            const response = await GetPaginadoService(paginacao ?? {}, `${API_BASE_AGENDA_URL}${UrlBuscarPaginado}`)
            onResultadosBusca(response ?? {});
        }

        const handleButtonClickLimpar = async () => {
            limparItens();
            const portifolio: PortifolioItem = {
                nomeColaborador: "",
                razaoSocial: "",
                titulo: '',
                subTitulo: '',
                lojaId: lojaId,
                colaboradorId: colaboradorId,
                tipoUsuarioId: Number(tipoUsuarioId) ?? 0
            }
            buscarPaginado(portifolio)
        };
        const limparItens = () => {
            setLojaId(0);
            setColaboradorId(0);
            setLoja("");
            setColaborador("");
            setTitulo('');
            setSubTitulo('');
        }

        const handleDropdownChange = (e: SelectChangeEvent<string>, tipo: string) => {
            const selectedKey = e.target.value;
            const selectedItem = getSelectedItemByTipo(tipo, selectedKey, colaboradorProps, lojaProps);
            const selectedValue = selectedItem?.value || '';

            switch (tipo) {
                case "colaborador":
                    setColaboradorId(Number(selectedKey));
                    setColaborador(selectedValue);
                    setLojaId(Number(0));
                    setLoja('');
                    break;
                case "loja":
                    setLojaId(Number(selectedKey));
                    setLoja(selectedValue);
                    setColaboradorId(0);
                    setColaborador('');
                    break;
                default:
                    return null;
            }
        };

        return (
            <>
                <Grid container spacing={2} className="ContainerGrid">
                    <div className="conteudo">
                        <fieldset
                            className={`icone-box icone-box-form ${mostrarFiltros ? 'expandido' : 'fechado'
                                }`}
                        >
                            <legend>Pesquisar</legend>

                            <Grid container spacing={2}>
                                <Grid item xs={12} className="filtro-toggle">


                                    <button
                                        type="button"
                                        className="btn-filtros"
                                        onClick={() => setMostrarFiltros(prev => !prev)}
                                    >
                                        <Tooltip title="Filtros">
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                                Filtros
                                                <FaFilter />
                                            </span>
                                        </Tooltip>
                                    </button>
                                </Grid>
                                {mostrarFiltros && (
                                    <>
                                        {tipoUsuarioId?.toString() === TipoUsuarioLojaId && (
                                            <Grid item xs={12} md={4}>
                                                <div className="formItens-drop">
                                                    <Dropdown
                                                        dropProps={{
                                                            name: "Loja",
                                                            label: "Loja*",
                                                            itens: lojaProps ?? [],
                                                            selectedId: lojaId?.toString() || '',
                                                            onChange: (e: SelectChangeEvent<string>) => handleDropdownChange(e, "loja")
                                                        }}
                                                    />
                                                </div>
                                            </Grid>
                                        )}
                                        {tipoUsuarioId?.toString() === TipoUsuarioColaboradorId && (
                                            <Grid item xs={12} md={4}>
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
                                            </Grid>
                                        )}

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

                                        <Grid item xs={12}>
                                            <div className='botaoBuscar'>
                                                <div className="link-busca">
                                                    <button onClick={handleButtonClick} className="btn-busca">
                                                        <Tooltip title="buscar">
                                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                                                <FaSearch />
                                                            </span>
                                                        </Tooltip>
                                                    </button>
                                                    <button onClick={handleButtonClickLimpar} className="btn-limpar">
                                                        <Tooltip title="limpar">
                                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                                                <RefreshIcon />
                                                            </span>
                                                        </Tooltip>
                                                    </button>
                                                </div>
                                            </div>
                                        </Grid>
                                    </>
                                )}
                            </Grid>
                        </fieldset>
                    </div>
                </Grid>
            </>
        );
    }
export default PortifolioBusca