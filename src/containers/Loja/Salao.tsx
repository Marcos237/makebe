import React, { useState } from "react";
import { PaginacaoItens } from '../../Interfaces/shared/PaginacaoItens';
import CampoTexto from '../../components/textbox';
import Footer from '../../components/footer';
import Banner from '../../components/banner';
import { UsuarioLogadoService } from '../../services/Perfil/usuarioLogadoService';
import { UsuarioLogadoItens } from '../../Interfaces/Usuario/UsuarioLogadoItens';
import { TabsItens } from "../../Interfaces/Tabs/tabsItem";
import Tabs from '../../components/tabs'
import { Grid } from '@mui/material';
import Mensagem from '../../components/mensagem';
import { MensagemItens } from "../../Interfaces/Mensagens/MensagemItens";
import { cnpjMaskConst } from '../../constants/Loja/lojaConstant';
import Botao from '../../components/button';
import { BotaoItens } from '../../Interfaces/Botao/botao';
import { foneMaskConst } from "../../constants/Usuario/usuarioConstant";
import { ItensSelect } from '../../Interfaces/DropDown/dropdownItens';
import Dropdown from "../../components/dropdown";


import '../../assets/styles/Loja/loja.css'


const Salao: React.FC = () => {
    const [useUsuarioLogado, setUsuarioLogado] = useState<UsuarioLogadoItens>();
    const [messageItens, setMessageItens] = useState<MensagemItens>();
    const [isMessage, setMessage] = useState<boolean>(false);
    const [razaoSocial, setRazaoSocial] = useState<string>('');
    const [cnpj, setCnpj] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [telefone, setTelefone] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = React.useState('');

    const handleCloseMessage = () => {
        setMessage(false);
    };

    const handleButtonClick = () => {
        const fakeEvent = {
            preventDefault: () => { }
        } as React.FormEvent;
        handleSubmit(fakeEvent);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(false);
    }

    const messageProps: MensagemItens = {
        texto: messageItens?.texto,
        cor: messageItens?.cor,
        isVisible: isMessage,
        onClick: handleCloseMessage
    }

    const botaoProps: BotaoItens = {
        name: 'Salvar',
        tooltip: 'Fazer o cadastro',
        label: 'Salvar',
        width: '200px',
        onIconClick: handleButtonClick,
        color: 'primary',
        isLoading: isLoading,
    };
    const tabsData: TabsItens[] = [
        {
            label: 'Loja',
            content: (
                <Grid container spacing={2} className="gridContainerLoja">
                    <div className="formItens">
                        <div className='messageText'>
                            <Mensagem mensagemProps={messageProps ?? {}} />
                        </div>
                    </div>

                    <Grid item md={6} xs={12} className='gridEsquerdoLoja'>
                        <div className='conteudoEsquerdoLoja'>
                            <div className='camposEsquerdoLoja'>
                                <div className="formItens">
                                    <CampoTexto
                                        textBoxProps={{
                                            name: "Razão Social",
                                            tooltip: "digite a razão social",
                                            label: "razão social*",
                                            value: razaoSocial,
                                            type: 'text',
                                            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setRazaoSocial(e.target.value)
                                        }}
                                    />
                                </div>
                                <div className="formItens">
                                    <CampoTexto
                                        textBoxProps={{
                                            name: "CNPJ",
                                            tooltip: "digite seu cnpj",
                                            label: "cnpj*",
                                            value: cnpj,
                                            type: 'text',
                                            mask: cnpjMaskConst,
                                            readonly: false,
                                            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCnpj(e.target.value)

                                        }}
                                    />
                                </div>
                                <div className="formItens">
                                    <CampoTexto
                                        textBoxProps={{
                                            name: "Telefone",
                                            tooltip: "digite seu telefone",
                                            label: "telefone*",
                                            value: telefone,
                                            mask: foneMaskConst(telefone),
                                            type: 'text',
                                            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setTelefone(e.target.value)
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid item md={6} xs={12} className='gridDireitoLoja'>
                        <div className='conteudoDireitoLoja'>
                            <div className='camposDireitoLoja'>
                                <div className="formItens">
                                    <CampoTexto
                                        textBoxProps={{
                                            name: "Email",
                                            tooltip: "digite seu e-mail",
                                            label: "email*",
                                            value: email,
                                            type: 'text',
                                            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)
                                        }}
                                    />
                                </div>

                                <div className="formItens">
                                    <Dropdown
                                        dropProps={{
                                            name: "TipoLoja",
                                            itens: [],
                                            label: "Tipo de Loja*"
                                        }}
                                    />
                                </div>

                                <div className='formItens'>
                                    <div className='botao'>
                                        <Botao botaoProps={botaoProps} />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </Grid>
                </Grid>),
        },
        {
            label: 'Endereço',
            content: <div>Informações sobre o endereço</div>,
        }
    ];

    const fetchVitrineData = async () => {
        const [sessao] = await Promise.all([
            UsuarioLogadoService(),
        ]);
        setUsuarioLogado(sessao);
    };

    return (
        <>
            <div className='banner'>
                <Banner usuarioLogado={useUsuarioLogado} />
            </div>
            <div className="conteudoLoja">
                <Tabs tabsProps={tabsData}></Tabs>

            </div>
            <div>
                <Footer />
            </div>
        </>
    )
}
export default Salao;