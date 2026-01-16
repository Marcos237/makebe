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
import { Tooltip } from '@mui/material';
import { FaRegTrashAlt } from "react-icons/fa";
import { FaSave } from 'react-icons/fa';
import { ErroItem } from '../../Interfaces/shared/erroItem';
import { useFormErros } from '../../hooks/useFormErros';
import CampoTexto from '../../components/textbox';
import Mensagem from '../../components/mensagem';
import BotaoSubmit from '../../components/submitButton';
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
    const [erros, setErros] = useState<ErroItem[]>([]);
    const [erroTrigger, setErroTrigger] = useState(0);

    useFormErros(erros, erroTrigger);

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

            const errosConvertidos: ErroItem[] = servicoResponse?.notifications?.map((n) => ({
                Key: n.notificationProps?.Key ?? '',
                Mensagem: n.notificationProps?.Message ?? '',
                erroSession: n.notificationProps?.Key ?? ''
            })) ?? [];
            setErros(errosConvertidos);
            setErroTrigger(prev => prev + 1);

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
    const botaoProps: BotaoItens = {
        tooltip: 'Salvar',
        isLoading: isLoading,
        icon: FaSave,
        marginLeft: '4px',
        marginRight: '4px'

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

        <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown} id="frmServico">
            <Grid container spacing={2} className="ContainerGrid">
                <div className='conteudo'>
                    <fieldset className='icone-box icone-box-form'>
                        <legend>Colaborador</legend>

                        <div className="links-login">
                            <a href="#limpar"  onClick={handleButtonClickLimpar} className="botao-link">
                                <Tooltip title="limpar">
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                        <FaRegTrashAlt />
                                    </span>
                                </Tooltip>
                            </a>
                        </div>

                        <Grid item md={6} xs={12} className='gridEsquerdo'>
                            <div className="conteudoEsquerdo conteudoMenorEsquerdo">

                                <div className='formItens'>
                                    <CampoTexto
                                        textBoxProps={{
                                            name: "Descricao",
                                            tooltip: "digite a Descrição",
                                            label: "Descrição*",
                                            value: descricao,
                                            type: 'text',
                                            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setDescricao(e.target.value),
                                            erroSession: "Descricao"
                                        }}
                                    />
                                </div>

                                <div className='formItens'>

                                    <CampoTexto
                                        textBoxProps={{
                                            name: "Valor",
                                            tooltip: "Digite o valor",
                                            label: "Valor*",
                                            value: moneyMaskConst(valor),
                                            type: "text",
                                            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                                                const rawValue = e.target.value.replace(/\D/g, "");
                                                setValor(rawValue === "" ? 0 : Number(rawValue) / 100);
                                            },
                                            erroSession:"Valor"
                                        }}
                                    />
                                </div>
                            </div>
                        </Grid>
                        <div className="separador"></div>
                        <Grid item md={6} xs={12} className='gridDireito'>
                            <div className="conteudoDireito datahora-servico">
                                <div className='formItens hora-picker'>
                                    <HoraPicker
                                        label={PeriodoServico}
                                        value={periodo}
                                        onChange={handlePeriodoChange}
                                        name="Periodo"
                                        erroSession="Perido"
                                    />
                                </div>
                                <div className="gridBotoes">
                                    <div className="botao botao-salvar">
                                        <BotaoSubmit botaoProps={botaoProps} />
                                    </div>
                                </div>

                            </div>
                        </Grid>
                    </fieldset>
                </div>
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
        </form >
    </>
}
export default ServicoPersistir;