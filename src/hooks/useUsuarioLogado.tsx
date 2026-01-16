import { useCallback } from 'react';
import { GetAllService } from '../services/shared/getAllService';
import { API_BASE_URL } from '../config/apiConfig';
import { UrlUsuarioLogado } from '../constants/Usuario/usuarioConstant';
import { UsuarioLoginItens } from '../Interfaces/Usuario/UsuarioLoginItens';
import { ResponseItem } from '../Interfaces/shared/ResponseItem';

export function useUsuarioLogado() {
  const fetchUsuarioLogado = useCallback(async (): Promise<UsuarioLoginItens> => {
    const [sessao] = await Promise.all([
      GetAllService(`${API_BASE_URL}${UrlUsuarioLogado}`) as ResponseItem<UsuarioLoginItens>
    ]);
    return sessao;
  }, []);

  return { fetchUsuarioLogado };
}
