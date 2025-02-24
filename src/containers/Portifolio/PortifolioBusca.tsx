import React, { useState } from "react";
import { PaginacaoItens } from "../../Interfaces/shared/PaginacaoItens";
import { PortifolioItem } from "../../Interfaces/Portifolio/portifolioItem";
import { Grid } from "@mui/material";
import { BotaoItens } from '../../Interfaces/Botao/botao';
import { SelectChangeEvent } from '@mui/material/Select';
import { PersistirItens } from "../../Interfaces/shared/persistirItens";
import { GetPaginadoService } from "../../services/shared/getPaginadoService";
import { API_BASE_AGENDA_URL } from "../../config/apiConfig";
import { UrlBuscarPaginado } from "../../constants/Portifolio/PortifolioConstant";
import { TipoUsuarioLojaId, TipoUsuarioColaboradorId } from '../../constants/Usuario/usuarioConstant';
import CampoTexto from "../../components/textbox";
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import Botao from '../../components/button';
import Dropdown from "../../components/dropdown";


const PortifolioBusca: React.FC<{
    selectItens: Array<PersistirItens<PortifolioItem>>,
    tipoUsuarioId: string,
    onResultadosBusca: (resultado: PaginacaoItens<PortifolioItem>) => void
}> =
    ({ selectItens, tipoUsuarioId, onResultadosBusca }) => {
        const [titulo, setTitulo] = useState<string>('');
        const [subTitulo, setSubTitulo] = useState<string>('');
        const [isLoading, setIsLoading] = useState<boolean>(false);
        const [lojaId, setLojaId] = useState<number>();
        const [colaborador, setColaborador] = useState<string>('');
        const [loja, setLoja] = useState<string>('');
        const [colaboradorId, setColaboradorId] = useState<number>();
        const colaboradorProps = selectItens.find((item) => item.name === "colaborador")?.selectItems ?? [];
        const lojaProps = selectItens.find((item) => item.name === "loja")?.selectItems ?? [];

        const handleButtonClick = () => {
            const fakeEvent = {
                preventDefault: () => { }
            } as React.FormEvent;
            handleSubmit(fakeEvent);
        };


        const handleSubmit = async (event: React.FormEvent) => {
            event.preventDefault();
            setIsLoading(true);
            const portifolio: PortifolioItem = {
                nomeColaborador: tipoUsuarioId === TipoUsuarioColaboradorId ? colaborador ?? "" : "",
                razaoSocial: tipoUsuarioId === TipoUsuarioLojaId ? loja ?? "" : "",
                titulo: titulo || '',
                subTitulo: subTitulo || '',
                lojaId: tipoUsuarioId === TipoUsuarioLojaId ? lojaId ?? 0 : 0,
                colaboradorId: tipoUsuarioId === TipoUsuarioColaboradorId ? colaboradorId ?? 0 : 0,
                tipoUsuarioId : Number(tipoUsuarioId) ?? 0
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
            setIsLoading(false);
        }

        const handleButtonClickLimpar = async () => {
            limparItens();
            const portifolio: PortifolioItem = {
                nomeColaborador:  "",
                razaoSocial: "",
                titulo: '',
                subTitulo: '',
                lojaId: lojaId,
                colaboradorId: colaboradorId,
                tipoUsuarioId : Number(tipoUsuarioId) ?? 0
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

        const handleDropdownChange = (e: SelectChangeEvent<string>, tipo: string) => {
            const selectedKey = e.target.value;
            const selectedItem = getSelectedItemByTipo(tipo, selectedKey);
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

        return (
            <>
                <div className="conteudoBusca">
                    <div className="titulobusca">
                        <h4>Buscar</h4>
                    </div>
                    <Grid container spacing={3}>
                        <Grid item xs={11} md={4}>
                            <div className="formItens formItemMenor">
                                {tipoUsuarioId?.toString() === TipoUsuarioLojaId && (
                                    <div className="formItens">
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
                </div>
            </>
        );
    }
export default PortifolioBusca