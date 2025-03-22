import React, { useState, useCallback } from "react";
import { PersistirItens } from "../../Interfaces/shared/persistirItens";
import { ServicosItens } from "../../Interfaces/Produto/servicosItens";
import { MensagemItens } from "../../Interfaces/Mensagens/MensagemItens";
import { Grid } from "@mui/material";
import { BotaoItens } from '../../Interfaces/Botao/botao';
import { RetornarMessageService } from '../../services/shared/retornarMessageService';
import { API_BASE_AGENDA_URL } from '../../config/apiConfig';
import { urlPersistir } from '../../constants/Servicos/servicoConstant';
import { PostService } from "../../services/shared/postService";
import { moneyMaskConst } from '../../utils/mascaras';
import { PeriodoServico } from "../../constants/Servicos/servicoConstant";
import RefreshIcon from '@mui/icons-material/Refresh';
import CampoTexto from '../../components/textbox';
import Mensagem from '../../components/mensagem';
import Botao from '../../components/button';
import updatePersistirPrev from "../../hooks/useUpdatePersistirPrev";
import HoraPicker from '../../components/horaPicker';


const ServicoPersistir: React.FC<{
    persistirProps: PersistirItens<ServicosItens>;

}> = ({ persistirProps }) => {
    const [messageItens, setMessageItens] = useState<MensagemItens>();
    const [isMessage, setMessage] = useState<boolean>(false);
    const [id, setId] = useState<number>(0);
    const [descricao, setDescricao] = useState<string>('');
    const [periodo, setPeriodo] = useState<number>(0);
    const [valor, setValor] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchServicoData = useCallback(async () => {
        if (!persistirProps?.item) return;

        setId(persistirProps.item.id ?? 0);
        setDescricao(persistirProps.item.descricao ?? "");
        setPeriodo(persistirProps.item.periodo ?? 0)
        setValor(persistirProps.item.valor ?? 0)
    }, [persistirProps]);

    updatePersistirPrev(fetchServicoData, undefined, persistirProps.item);
    const handleCloseMessage = () => {
        setMessage(false);
    };
    const messageProps: MensagemItens = {
        texto: messageItens?.texto,
        cor: messageItens?.cor,
        isVisible: isMessage,
        onClick: handleCloseMessage
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        const servico: ServicosItens = {
            id: id || 0,
            descricao: descricao,
            periodo: periodo || 0,
            valor: valor || 0
        }
        const servicoResponse = await PostService(servico, `${API_BASE_AGENDA_URL}${urlPersistir}`);
        if (!servicoResponse?.notifications || servicoResponse?.notifications?.length === 0) {

            const messageRetorno = await RetornarMessageService(true, true, [])
            setMessageItens(messageRetorno)
            persistirProps.onSave?.();
            limparItens();

        } else {

            const messageRetorno = await RetornarMessageService(false, false, servicoResponse?.notifications ?? [])
            setMessageItens(messageRetorno)
        }
        enviarSatusMessage();
        setIsLoading(false);
    }

    const limparItens = () => {
        setIsLoading(false);
        setId(0);
        setDescricao('');
        setPeriodo(0);
        setValor(0);
    }
    const handleButtonClick = () => {
        const fakeEvent = {
            preventDefault: () => { }
        } as React.FormEvent;
        handleSubmit(fakeEvent);
    };

    const botaoProps: BotaoItens = {
        name: 'Salvar',
        tooltip: 'Fazer o cadastro',
        label: 'Salvar',
        width: '200px',
        onIconClick: handleButtonClick,
        color: 'primary',
        isLoading: isLoading,
    };

    const enviarSatusMessage = () => {
        setMessage(true)
        setTimeout(() => {
            setMessage(false);
        }, 6000);
    }

    const handleButtonClickLimpar = async () => {
        limparItens();
    }
    const botaoLimparProps: BotaoItens = {
        tooltip: 'limpar',
        width: '20px',
        onIconClick: handleButtonClickLimpar,
        color: 'success',
        icon: RefreshIcon
    };

    const handleFormKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {

        if (event.key === 'Enter') {
            handleSubmit(event);
        }
    };

    const handlePeriodoChange = (valor: number) => {
        setPeriodo(valor);
    };
    return <>
        <div className='messageTextLoja'>
            <Mensagem mensagemProps={messageProps ?? {}} />
        </div>
        <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown} className="conteudo">
            <Grid container spacing={2}>
                <Grid item md={6} xs={10} className='gridEsquerdo'>
                    <div className='ConteudoEsquerdoServico conteudoMenorEsquerdo'>

                        <div className='formItens'>
                            <CampoTexto
                                textBoxProps={{
                                    name: "Descrição",
                                    tooltip: "digite a Descrição",
                                    label: "Descrição*",
                                    value: descricao,
                                    type: 'text',
                                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setDescricao(e.target.value)
                                }}
                            />
                        </div>

                        <div className='formItens'>

                            <CampoTexto
                                textBoxProps={{
                                    name: "Valor",
                                    tooltip: "Digite o valor",
                                    label: "Valor",
                                    value: moneyMaskConst(valor),
                                    type: "text",
                                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                                        const rawValue = e.target.value.replace(/\D/g, "");
                                        setValor(rawValue === "" ? 0 : Number(rawValue) / 100);
                                    },
                                }}
                            />
                        </div>
                    </div>
                </Grid>
                <div className="separador"></div>
                <Grid item md={6} xs={10} className='gridDireito'>
                    <div className="conteudoDireitoServico conteudoMenorDireito">

                        <div className='formItens'>
                            <HoraPicker
                                label={PeriodoServico}
                                value={periodo}
                                onChange={handlePeriodoChange}
                            />
                        </div>

                    </div>
                </Grid>

                <Grid item xs={12}>
                    <div className="formItens gridBotoes">
                        <div className="botao">
                            <Botao botaoProps={botaoLimparProps} />
                        </div>
                        <div className="botao">
                            <Botao botaoProps={botaoProps} />
                        </div>
                    </div>
                </Grid>
            </Grid>
            <div className='camposInvisiveis'>
                <CampoTexto
                    textBoxProps={{
                        name: "id",
                        value: id?.toString(),
                        type: 'hidden',
                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setId(Number(e.target.value))
                    }} />
            </div>
        </form>
    </>
}
export default ServicoPersistir;