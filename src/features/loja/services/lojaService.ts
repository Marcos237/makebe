import { API_BASE_AGENDA_URL } from "../../../config/apiConfig";
import { UrlLoja, UrlPaginado, UrlTipoLoja } from "../../../constants/Loja/lojaConstant";
import { LojaItens } from "../../../Interfaces/Loja/lojaItens";
import { TipoLojaItens } from "../../../Interfaces/Loja/tipoLojaItens";
import { PaginacaoItens } from "../../../Interfaces/shared/PaginacaoItens";
import { ResponseItem } from "../../../Interfaces/shared/ResponseItem";
import { DeleteService } from "../../../services/shared/deleteService";
import { GetAllService } from "../../../services/shared/getAllService";
import { GetByIdService } from "../../../services/shared/getByIdService";
import { GetPaginadoService } from "../../../services/shared/getPaginadoService";
import { PostService } from "../../../services/shared/postService";

export const buscarLojasPaginado = async (paginacao: PaginacaoItens<LojaItens>) => (
    GetPaginadoService(paginacao, `${API_BASE_AGENDA_URL}${UrlPaginado}`)
) as Promise<PaginacaoItens<LojaItens>>;

export const buscarLojaPorId = async (id: number) => (
    GetByIdService(id, `${API_BASE_AGENDA_URL}${UrlLoja}`)
) as Promise<ResponseItem<LojaItens>>;

export const removerLoja = async (id: number) => DeleteService(id, `${API_BASE_AGENDA_URL}${UrlLoja}`);

export const buscarTiposLoja = async () => (
    GetAllService(`${API_BASE_AGENDA_URL}${UrlTipoLoja}`)
) as Promise<ResponseItem<TipoLojaItens>>;

export const salvarLoja = async (loja: LojaItens) => PostService(loja, `${API_BASE_AGENDA_URL}${UrlLoja}`);
