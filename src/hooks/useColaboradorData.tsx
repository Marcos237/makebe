import { useCallback } from 'react';
import { GetAllService } from '../services/shared/getAllService';
import { API_BASE_AGENDA_URL } from '../config/apiConfig';
import { UrlColaborador } from '../constants/Colaborador/colaboradorConstant';
import { ColaboradorItens } from '../Interfaces/Colaborador/colaboradorItem';
import { PersistirItens } from '../Interfaces/shared/persistirItens';
import { ResponseItem } from '../Interfaces/shared/ResponseItem';
import { mapToSelectItens } from '../functions/mapToSelectItens';

export function useColaboradorData(fetchPortifolioData: (tipoUsuarioId?: string) => Promise<void>) {
  const fetchColaboradorData = useCallback(async (): Promise<PersistirItens<ColaboradorItens>> => {
    const colaboradorResponse = await GetAllService(`${API_BASE_AGENDA_URL}${UrlColaborador}`) as ResponseItem<ColaboradorItens>;

    const itensSelect = mapToSelectItens(colaboradorResponse?.datas, 'id', 'nome');

    const persistirPropsColaborador: PersistirItens<ColaboradorItens> = {
      selectItems: itensSelect,
      name: 'colaborador',
      onSave: async (tipoUsuarioId?: string) => {
        await fetchPortifolioData(tipoUsuarioId);
      },
    };

    return persistirPropsColaborador;
  }, [fetchPortifolioData]);

  return { fetchColaboradorData };
}
