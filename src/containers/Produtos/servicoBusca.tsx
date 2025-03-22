import React, { useState } from "react";
import { PaginacaoItens } from '../../Interfaces/shared/PaginacaoItens';
import { ServicosItens } from "../../Interfaces/Produto/servicosItens";
import { Grid } from '@mui/material';
import { BotaoItens } from '../../Interfaces/Botao/botao';
import { GetPaginadoService } from "../../services/shared/getPaginadoService";
import { API_BASE_AGENDA_URL } from "../../config/apiConfig";
import { UrlBuscarPaginado } from "../../constants/Servicos/servicoConstant";
import { paginar } from "../../functions/paginacao";
import { moneyMaskConst } from '../../utils/mascaras';
import { PeriodoServico } from "../../constants/Servicos/servicoConstant";
import CampoTexto from '../../components/textbox';
import Botao from '../../components/button';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import HoraPicker from '../../components/horaPicker';

const ServicoBusca: React.FC<{
    onResultadosBusca: (
        resultados: PaginacaoItens<ServicosItens>) => void
}> = ({ onResultadosBusca }) => {
    const [descricaoBusca, setDescricaoBusca] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [periodoBusca, setPeriodo] = useState<number>(0);
    const [valorBusca, setValor] = useState<number>(0);

    const handleButtonClick = () => {
        const fakeEvent = {
            preventDefault: () => { }
        } as React.FormEvent;
        handleSubmit(fakeEvent);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        const colaborador: ServicosItens = {
            descricao: descricaoBusca || '',
            valor: valorBusca ?? 0,
            periodo : periodoBusca ?? 0
        }
        const paginacao = paginar(colaborador, 1);
        const colaboradorResponse = await GetPaginadoService(paginacao, `${API_BASE_AGENDA_URL}${UrlBuscarPaginado}`);
        onResultadosBusca(colaboradorResponse ?? {});
        setIsLoading(false);
    }
    const handleButtonClickLimpar = async () => {
        limparItens();

        const servico: ServicosItens = {
            descricao: '',
        }
        const paginacao = paginar(servico, 1)
        const colaboradorService = await GetPaginadoService(paginacao ?? {}, `${API_BASE_AGENDA_URL}${UrlBuscarPaginado}`);
        onResultadosBusca(colaboradorService ?? {});
    }
    const limparItens = () => {
        setIsLoading(false);
        setDescricaoBusca('');
        setPeriodo(0);
        setValor(0);
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

    const handlePeriodoChange = (valor: number) => {
        setPeriodo(valor);
    };

    return (<>
        <div className="conteudoServico">
            <div className="titulobusca">
                <h4>Buscar</h4>
            </div>
            <Grid container spacing={2}>
                <Grid item xs={7} md={4}>
                    <div className="formItens formItemMenor">
                        <CampoTexto
                            textBoxProps={{
                                name: "Descrição",
                                tooltip: "digite a Descrição",
                                label: "Descrição*",
                                value: descricaoBusca,
                                type: 'text',
                                onChange: (e: React.ChangeEvent<HTMLInputElement>) => setDescricaoBusca(e.target.value)
                            }}
                        />
                    </div>
                </Grid>
                <Grid item xs={7} md={4}>
                    <div className='formItemMenor'>

                        <CampoTexto
                            textBoxProps={{
                                name: "Valor",
                                tooltip: "Digite o valor",
                                label: "Valor",
                                value: moneyMaskConst(valorBusca),
                                type: "text",
                                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                                    const rawValue = e.target.value.replace(/\D/g, "");
                                    setValor(rawValue === "" ? 0 : Number(rawValue) / 100);
                                },
                            }}
                        />
                    </div>
                </Grid>


                <Grid item xs={7} md={4}>
                    <div className='formItemMenor formItemServicoBusca'>
                        <HoraPicker
                            label={PeriodoServico}
                            value={periodoBusca}
                            onChange={handlePeriodoChange}
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

    </>)
};
export default ServicoBusca;