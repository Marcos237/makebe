import React, { useState, useCallback } from "react";
import { PersistirItens } from "../../Interfaces/shared/persistirItens";
import { ColaboradorProfissionalItem } from "../../Interfaces/ColaboradorProfissional/colaboradorProfissionalItem";
import { MensagemItens } from "../../Interfaces/Mensagens/MensagemItens";
import { Grid } from "@mui/material";
import { SelectChangeEvent } from '@mui/material/Select';
import { BotaoItens } from '../../Interfaces/Botao/botao';
import { RetornarMessageService } from '../../services/shared/retornarMessageService';
import { API_BASE_AGENDA_URL } from '../../config/apiConfig';
import { urlPersistir } from '../../constants/ColaboradorProfissional/colaboradorProfissionalConstant';
import { PostService } from "../../services/shared/postService";
import { Tooltip } from '@mui/material';
import { FaRegTrashAlt } from "react-icons/fa";
import { FaSave } from 'react-icons/fa';    
import { useFormErros } from '../../hooks/useFormErros';
import { ErroItem } from '../../Interfaces/shared/erroItem';
import Dropdown from "../../components/dropdown";
import CampoTexto from '../../components/textbox';
import Mensagem from '../../components/mensagem';
import BotaoSubmit from '../../components/submitButton';
import updatePersistirPrev from "../../hooks/useUpdatePersistirPrev";

const ColaboradorProfissionalPersistir: React.FC<{
    persistirProps: PersistirItens<ColaboradorProfissionalItem>; persistirDropProps: Array<PersistirItens<ColaboradorProfissionalItem>>;
}> = ({ persistirProps, persistirDropProps }) => {
    const [messageItens, setMessageItens] = useState<MensagemItens>();
    const [isMessage, setMessage] = useState<boolean>(false);
    const [id, setId] = useState<number>(0);
    const [usuarioId, setUsuarioId] = useState<string>('');
    const [colaboradorId, setColaboradorId] = useState<number>(0);
    const [lojaId, setLojaId] = useState<number>(0);
    const [servicoId, setServicoId] = useState<number>(0);
    const [descricao, setDescricao] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const colaboradorProps = persistirDropProps.find((item) => item.name === "colaborador")?.selectItems ?? [];
    const lojaProps = persistirDropProps.find((item) => item.name === "loja")?.selectItems ?? [];
    const servicoProps = persistirDropProps.find((item) => item.name === "servico")?.selectItems ?? [];
    const [erros, setErros] = useState<ErroItem[]>([]);
    const [erroTrigger, setErroTrigger] = useState(0);

    useFormErros(erros, erroTrigger);

    const fetchColaboradorProfissionalData = useCallback(async () => {

        setId(persistirProps.item?.id || 0);
        setUsuarioId(persistirProps.item?.usuarioId || '');
        setColaboradorId(persistirProps.item?.colaboradorId ?? 0);
        setLojaId(persistirProps.item?.lojaId ?? 0)
        setServicoId(persistirProps.item?.servicoId ?? 0);
        setDescricao(persistirProps.item?.descricao ?? '');

    }, [persistirProps])
    updatePersistirPrev(fetchColaboradorProfissionalData, undefined, persistirProps.item);

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
        const colabolador: ColaboradorProfissionalItem = {
            id: id ?? 0,
            usuarioId: usuarioId ?? '',
            colaboradorId: colaboradorId ?? 0,
            lojaId: lojaId ?? 0,
            servicoId: servicoId ?? 0,
            descricao: descricao ?? ""
        }

        const colaboradorResponse = await PostService(colabolador, `${API_BASE_AGENDA_URL}${urlPersistir}`);
        if (!colaboradorResponse?.notifications || colaboradorResponse?.notifications?.length === 0) {
            const messageRetorno = await RetornarMessageService(true, true, [])
            setMessageItens(messageRetorno)
            persistirDropProps.forEach(item => {
                item.onSave?.();
            });
            limparItens();

        } else {

            const errosConvertidos: ErroItem[] = colaboradorResponse?.notifications?.map((n) => ({
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
    const handleFormKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {

        if (event.key === 'Enter') {
            handleSubmit(event);
        }
    };

    const limparItens = () => {
        setIsLoading(false);
        setId(0);
        setColaboradorId(0);
        setLojaId(0);
        setServicoId(0);
        setDescricao("");
    }

    const handleDropdownChange = (e: SelectChangeEvent<string>, tipo: string) => {
        if (tipo === "colaborador") {
            setColaboradorId(Number(e.target.value))
        }
        if (tipo === "loja") {
            setLojaId(Number(e.target.value))
        }
        if (tipo === "servico") {
            setServicoId(Number(e.target.value))
        }
    };

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

    return <>
        <div className='messageTextLoja'>
            <Mensagem mensagemProps={messageProps ?? {}} />
        </div>

        <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown} id="frmColaboradorProfissional">
            <Grid container spacing={2} className="ContainerGrid">
                <div className='conteudo'>
                    <fieldset className='icone-box icone-box-form'>
                        <legend>Colaborador</legend>

                        <div className="remove-item">
                            <button onClick={handleButtonClickLimpar} className="btn-danger" type="button">
                                <Tooltip title="limpar">
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                        <FaRegTrashAlt />
                                    </span>
                                </Tooltip>
                            </button>
                        </div>

                        <Grid item md={6} xs={12} className='gridEsquerdo'>
                            <div className="conteudoEsquerdo conteudoMenorEsquerdo">

                                <div className="formItens-drop">
                                    <Dropdown
                                        dropProps={{
                                            name: "ColaboradorId",
                                            label: "Colaborador*",
                                            itens: colaboradorProps,
                                            selectedId: colaboradorId || '0',
                                            onChange: (e: SelectChangeEvent<string>) => handleDropdownChange(e, "colaborador"),
                                            erroSession:"ColaboradorId"
                                        }}
                                    />
                                </div>
                                <div className="formItens-drop">
                                    <Dropdown
                                        dropProps={{
                                            name: "LojaId",
                                            label: "Loja*",
                                            itens: lojaProps,
                                            selectedId: lojaId || '0',
                                            onChange: (e: SelectChangeEvent<string>) => handleDropdownChange(e, "loja"),
                                            erroSession:"LojaId"
                                        }}
                                    />
                                </div>

                                <div className="formItens-drop">
                                    <Dropdown
                                        dropProps={{
                                            name: "ServicoId",
                                            label: "Serviço*",
                                            itens: servicoProps,
                                            selectedId: servicoId || '0',
                                            onChange: (e: SelectChangeEvent<string>) => handleDropdownChange(e, "servico"),
                                            erroSession:"ServicoId"
                                        }}
                                    />
                                </div>
                            </div>
                        </Grid>
                        <div className="separador"></div>
                        <Grid item md={6} xs={12} className='gridDireito'>
                            <div className="conteudoDireito">
                                <div className='formItens'>
                                    <CampoTexto
                                        textBoxProps={{
                                            name: "Descricao",
                                            tooltip: "Descrição",
                                            label: "Descrição",
                                            value: descricao,
                                            type: 'text',
                                            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setDescricao(e.target.value),
                                            erroSession:"Descricao"

                                        }}
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

export default ColaboradorProfissionalPersistir;