import { API_BASE_URL } from "../../../config/apiConfig";
import { UrlUsuarioLogado } from "../../../constants/Usuario/usuarioConstant";
import { ResponseItem } from "../../../Interfaces/shared/ResponseItem";
import { UsuarioLoginItens } from "../../../Interfaces/Usuario/UsuarioLoginItens";
import { GetAllService } from "../../../services/shared/getAllService";

export const buscarUsuarioLogadoHome = async () => (
    GetAllService(`${API_BASE_URL}${UrlUsuarioLogado}`)
) as Promise<ResponseItem<UsuarioLoginItens>>;
