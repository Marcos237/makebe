import React, { useState, useCallback, useEffect } from "react";
import { UsuarioLoginItens } from '../../Interfaces/Usuario/UsuarioLoginItens';
import { GetAllService } from '../../services/shared/getAllService';
import { PersistirItens } from "../../Interfaces/shared/persistirItens";
import { UrlUsuarioLogado } from "../../constants/Usuario/usuarioConstant";
import { API_BASE_URL, API_BASE_AGENDA_URL } from '../../config/apiConfig';
import { ResponseItem } from '../../Interfaces/shared/ResponseItem';
import { Grid, Tooltip } from '@mui/material';
import { TfiAgenda } from "react-icons/tfi";
import { AgendamentoItem } from "../../Interfaces/Agendamento/agendamentoItem";
import { useHiddenItem } from '../../hooks/useHiddenItem';
import { DeleteService } from '../../services/shared/deleteService';
import { UrlBuscarPorAno, UrlBuscarPorData, UrlBuscarPorId, UrlAgendamento, AgendamentoColaborador } from '../../constants/Agendamento/agendamentoConstant';
import { mapToSelectItens } from '../../functions/mapToSelectItens';
import { SelectChangeEvent } from '@mui/material/Select';
import { GetByIdService } from "../../services/shared/getByIdService";
import { ColaboradorItens } from '../../Interfaces/Colaborador/colaboradorItem';
import { SelectItens } from "../../Interfaces/shared/selectItens";
import { CalendarioItem } from "../../Interfaces/shared/calendarioItem";
import { HoraAgendadaItem } from "../../Interfaces/Agendamento/horaAgendadaItem";
import { formatarData } from '../../functions/formatDataHora';
import Dropdown from "../../components/dropdown";
import dayjs, { Dayjs } from "dayjs";
import Calendario from "../../components/calendario";
import Banner from "../../components/banner";
import Footer from "../../components/footer";
import useUpdateFetch from '../../hooks/useUpdateFetch';
import '../../assets/styles/Agenda/agendamento.css';
import "../../assets/styles/Agendamento/agendamento.css";
import AgendamentoPersistir from "./AgendamentoPersistir";

const Agendamento: React.FC = () => {
    const [useUsuarioLogado, setUsuarioLogado] = useState<UsuarioLoginItens>();
    const [agendamentoItem, setAgendamentoItem] = useState<AgendamentoItem>();
    const [anoItem, setAnoItem] = useState<Number>();
    const [useColaboradorId, setColaboradorId] = useState<Number>();
    const [useImagem, setImagem] = useState<string>("");
    const [usecolaboradores, setColaboradores] = useState<Array<SelectItens>>();
    const [isHiddenItem, setIsHiddenItem] = useState(true);
    const [horasAgendadas, setHorasAgendadas] = useState<HoraAgendadaItem[]>([]);
    const [isHoraOpen, setIsHoraOpen] = useState<boolean>(false);
    const [useIsLeitura, setIsLeitura] = useState<boolean>(true);
    const [useMesSelected, setMesSelected] = useState<number>(0);
    const [useIsReadOnly, setIsReadOnly] = useState<boolean>(true);
    const [isDayItem, setIsDayItem] = useState<boolean>(true);
    useHiddenItem("lista", "persistir", isHiddenItem);
    const currentYear = dayjs().year();

    const agendamentoData = useCallback(async () => {

        if (isDayItem) {
            setIsDayItem(true);
            return;
        }
        const anoCuston = Number(anoItem);
        const ano = (Number.isFinite(anoCuston) && anoCuston !== 0 ? anoCuston : currentYear).toString();
        const colaboradorId = Number(useColaboradorId ?? 0) ?? 0;

        const response = await GetByIdService(
            ano,
            `${API_BASE_AGENDA_URL}${UrlBuscarPorAno}`,
            colaboradorId
        ) as ResponseItem<AgendamentoItem>;


        if (!response.datas) {
            setHorasAgendadas([]);
            return;
        }
        setIsReadOnly(false);
        const itens: HoraAgendadaItem[] = response.datas.map(a => {
            const ini = dayjs(a.dataInicioAgendamento as any);
            const fim = dayjs(a.dataTerminoAgendamento as any);

            return {
                id: a.id,
                name: a.nomeUsuario ?? "",
                data: ini.isValid() ? ini.format("DD/MM/YYYY") : "",
                dataInicio: ini.isValid() ? [ini.format("HH:mm")] : [],
                dataFim: fim.isValid() ? [fim.format("HH:mm")] : [],
                idColaborador: a.idColaborador ?? ""
            };
        });
        setHorasAgendadas(itens);
        setIsDayItem(true);
    }, [anoItem, useColaboradorId, currentYear, isDayItem]);

    const fetchColaboradorData = useCallback(async () => {
        const colaboradorResponse = await GetAllService(`${API_BASE_AGENDA_URL}${AgendamentoColaborador}`) as ResponseItem<ColaboradorItens>;
        const itensSelect = mapToSelectItens(colaboradorResponse?.datas, 'id', 'nome', "urlImagem", true);

        const persistirPropsColaborador: PersistirItens<ColaboradorItens> = {
            selectItems: itensSelect,
            name: 'colaborador',
            onSave: agendamentoData,
        };

        setColaboradores(persistirPropsColaborador.selectItems ?? [])
    }, [agendamentoData]);


    const usuarioData = useCallback(async () => {
        const [sessao] = await Promise.all([
            GetAllService(`${API_BASE_URL}${UrlUsuarioLogado}`) as ResponseItem<UsuarioLoginItens>
        ]);
        setUsuarioLogado(sessao);
    }, []);

    const handlerCloseClick = async () => {
        agendamentoData();
        setIsHoraOpen(false);
        setIsDayItem(true);

    }

    const handlerEditar = React.useCallback(async (id?: number) => {
        if (!id) return;
        const response = await GetByIdService(id, `${API_BASE_AGENDA_URL}${UrlBuscarPorId}`) as ResponseItem<AgendamentoItem>;

        if (!response.data) {
            setHorasAgendadas([]);
            setIsHiddenItem(false);
            setIsHoraOpen(true);
            return;
        }

        const ini = dayjs(response?.data?.dataInicioAgendamento as any);
        const fim = dayjs(response?.data?.dataTerminoAgendamento as any);
        setAgendamentoItem(prev => ({
            ...prev,
            id: response?.data?.id ?? 0,
            dataInicioAgendamento: ini,
            dataTerminoAgendamento: fim,
            idColaborador: String(response?.data?.idColaborador) ?? "0",
            nomeUsuario: response.data?.nomeUsuario,
            idServico: response?.data?.idServico,
            nomeColaborador: response?.data?.nomeColaborador,
            ativo: true,
            urlImagem: useImagem,
            idUsuario: response?.data?.idUsuario
        }));
        setIsHiddenItem(false);
    }, [useImagem]);


    const handlerNovo = React.useCallback(async (data?: string, id?: number) => {

        if (!data) return;

        const dataFormat = formatarData(data);
        const idColaborador = id?.toString() ?? "0";

        setAgendamentoItem(prev => ({
            ...prev,
            id: 0,
            dataInicioAgendamento: dataFormat ?? undefined,
            idColaborador: String(idColaborador),
            ativo: true
        }));

        setHorasAgendadas([]);
        setIsHiddenItem(false);
        setIsHoraOpen(true);
        return;
    }, []);

    const handlerDeletar = React.useCallback(async (id?: number) => {
        if (!id) return;
        const response = await DeleteService(id, `${API_BASE_AGENDA_URL}${UrlAgendamento}`) as ResponseItem<AgendamentoItem>;
        if (!response) {
            setHorasAgendadas([]);
            setIsHoraOpen(true);
            return;
        }
        agendamentoData();
        setIsHoraOpen(false);
    }, [agendamentoData]);


    const handleDropdownChange = (e: SelectChangeEvent<string>, tipo: string) => {

        if (tipo === "ano") {
            setAnoItem(Number(e.target.value));
        }
        if (tipo === "colaborador") {
            setColaboradorId(Number(e.target.value))
            setIsLeitura(false);
            setIsReadOnly(false);
            if (Number(e.target.value) === 0) {
                setAnoItem(0);
                setIsLeitura(true);
            }

            const selecionado = usecolaboradores?.find(opt => String(opt.key) === e.target.value.toString());
            setImagem(selecionado?.urlImagem ?? '');
            setIsDayItem(false);
        }
    };

    const handleDayClick = useCallback(async (date: Dayjs | null, id?: number) => {
        if (!date) return;
        const mesNumero = date.month() + 1;
        setMesSelected(mesNumero);
        const dataParam = date.format("YYYY-MM-DD");
        const colaboradorId = Number(useColaboradorId ?? 0) ?? 0;
        const response = await GetByIdService(dataParam, `${API_BASE_AGENDA_URL}${UrlBuscarPorData}`, colaboradorId) as ResponseItem<AgendamentoItem>;
        if (!response.datas) {
            setHorasAgendadas([]);
            setAgendamentoItem(prev => ({
                ...prev,
                id: 0,
                dataInicioAgendamento: date,
                dataTerminoAgendamento: undefined,
                idColaborador: String(useColaboradorId) ?? id,
                ativo: true,
                urlImagem: useImagem,
                nomeUsuario: "",
                idServico: 0,
            }));
            setIsHiddenItem(false);
            setIsDayItem(true);
            return;
        }
        const itens: HoraAgendadaItem[] = response.datas.map(a => {
            const ini = dayjs(a.dataInicioAgendamento as any);
            const fim = dayjs(a.dataTerminoAgendamento as any);

            return {
                id: a.id ?? 0,
                name: a.nomeUsuario ?? "",
                data: ini.isValid() ? ini.format("DD/MM/YYYY") : "",
                dataInicio: ini.isValid() ? [ini.format("HH:mm")] : [],
                dataFim: fim.isValid() ? [fim.format("HH:mm")] : [],
                tooltipItem: "editar",
                idColaborador: a.idColaborador ?? ""
            };
        });
        setIsHoraOpen(true);
        setHorasAgendadas(itens);
        setIsDayItem(true);
    }, [useColaboradorId, useImagem]);
    const calendarioItem: CalendarioItem = {
        year: anoItem !== undefined && anoItem !== null
            ? Number(anoItem)
            : Number(currentYear),
        onDayClick: handleDayClick,
        agendamentos: horasAgendadas,
        isHoraOpen: isHoraOpen,
        mes: useMesSelected,
        onCloseClick: handlerCloseClick,
        onUpdateClick: handlerEditar,
        onDeleteClick: handlerDeletar,
        onNewClick: handlerNovo,
        isReadOnly: useIsReadOnly
    };
    const anos: SelectItens[] = Array.from(
        { length: 2100 - currentYear + 1 },
        (_, i) => currentYear + i
    )
        .filter(ano => ano !== currentYear)
        .map(ano => ({ key: ano, value: ano.toString() }));
    useEffect(() => {
        agendamentoData();
    }, [isHoraOpen, useColaboradorId, anoItem, useIsReadOnly, agendamentoData]);

    useUpdateFetch([() => usuarioData(), () => agendamentoData(), () => fetchColaboradorData()],
    );

    const handleButtonClickListar = () => {
        setIsHiddenItem(true);
        setIsHoraOpen(false);
        setAgendamentoItem(prev => ({
            ...prev,
            id: 0,
            dataInicioAgendamento: undefined,
            dataTerminoAgendamento: undefined,
            idColaborador: "0",
            ativo: true,
            nomeUsuario: "",
            idServico: 0,
            urlImagem: ""
        }));

        const ano = anoItem;
        const id = useColaboradorId;
        setAnoItem(ano);
        setColaboradorId(id);
        setIsReadOnly(true);
        setIsDayItem(false);
    }

    return <>
        <div className='banner'>
            <Banner usuarioLogado={useUsuarioLogado} />
        </div>


        <div className="persistir">
            <div className="links-item">
                <button onClick={handleButtonClickListar} className="botao-link">
                    <Tooltip title="listar" disableHoverListener={!isHiddenItem}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <TfiAgenda />
                        </span>
                    </Tooltip>
                </button>
            </div>
            <div className="form-persitir">
                <AgendamentoPersistir
                    persistirProps={{
                        item: agendamentoItem,
                    }}
                    onDayClick={handleDayClick}
                    horasAgendadas={horasAgendadas}
                />
            </div>
        </div>

        <div className="lista">
            <div className="form-persitir">
                <Grid container spacing={2} className="ContainerGridAgendamento">
                    <Grid item xs={12}>
                        <fieldset className="icone-box icone-box-form">
                            <legend>Calendário</legend>

                            <Grid item xs={12} className="gridEsquerdo">
                                <Grid item xs={11} md={7} className="calendario-form">
                                    <div className="formItensHorizontal">

                                        <div className="formItens-drop drop-calendario">
                                            <Dropdown
                                                dropProps={{
                                                    name: "ColaboradorId",
                                                    label: "Colaborador*",
                                                    itens: usecolaboradores,
                                                    selectedId: useColaboradorId?.toString() || '0',
                                                    onChange: (e: SelectChangeEvent<string>) => handleDropdownChange(e, "colaborador"),
                                                    erroSession: "ColaboradorId"
                                                }}
                                            />
                                        </div>
                                        <div className="formItens-drop drop-calendario drop-ano">
                                            <Dropdown
                                                dropProps={{
                                                    name: "Ano",
                                                    label: "Ano*",
                                                    itens: anos,
                                                    selectedId: anoItem?.toString(),
                                                    isLeitura: useIsLeitura,
                                                    placeholder: currentYear.toString() ?? '',
                                                    onChange: (e: SelectChangeEvent<string>) => handleDropdownChange(e, "ano"),
                                                }}
                                            />
                                        </div>
                                    </div>
                                </Grid>

                                <Calendario
                                    key={String(isHoraOpen)}
                                    calendarioItem={{ ...calendarioItem, isHoraOpen }}
                                />

                            </Grid>
                        </fieldset>
                    </Grid>
                </Grid>

            </div>
        </div>

        <div>
            <Footer />
        </div >

    </>
}
export default Agendamento;