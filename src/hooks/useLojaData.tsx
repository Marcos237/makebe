
import { useCallback } from 'react';
import { GetAllService } from '../services/shared/getAllService';
import { API_BASE_AGENDA_URL } from '../config/apiConfig';
import { UrlBuscarTodos } from '../constants/Loja/lojaConstant';
import { LojaItens } from '../Interfaces/Loja/lojaItens';
import { PersistirItens } from '../Interfaces/shared/persistirItens';
import { ResponseItem } from '../Interfaces/shared/ResponseItem';
import { mapToSelectItens } from '../functions/mapToSelectItens';

export function useLojaData(fetchPortifolioData: (tipoUsuarioId?: string) => Promise<void>) {
  const fetchLojaData = useCallback(async (): Promise<PersistirItens<LojaItens>> => {
    const lojaResponse = await GetAllService(`${API_BASE_AGENDA_URL}${UrlBuscarTodos}`) as ResponseItem<LojaItens>;

    const itensSelect = mapToSelectItens(lojaResponse?.datas, 'id', 'razaoSocial');

    const persistirPropsLoja: PersistirItens<LojaItens> = {
      selectItems: itensSelect,
      name: 'loja',
      onSave: async (tipoUsuarioId?: string) => {
        await fetchPortifolioData(tipoUsuarioId);
      },
    };

    return persistirPropsLoja;
  }, [fetchPortifolioData]);

  return { fetchLojaData };
}

