import { MensagemItens } from "../../Interfaces/Mensagens/MensagemItens";
import { MensagemCadastro, MensagemUpDate } from '../../constants/Usuario/usuarioConstant';
import { NotificationItens } from '../../Interfaces/shared/NotificationItens';

export const RetornarMessageService = async (isLogado: boolean, isValid: boolean, notifications: NotificationItens[]): Promise<MensagemItens> => {
    let message = '';
    let cor = '';



    if (!isValid) {
        let erros = '';
        notifications.forEach((item: any) => {
            erros += item.notificationProps.Message + '\n';
        });
        erros = erros.trim() ?? '';
        message = erros;
        cor = "#F6DDCC";
    }
    else {
        if (isLogado) {

            message = MensagemUpDate;
            cor = "#A3E4D7";
        }
        else {
            message = MensagemCadastro;
            cor = "#F9E79F";
        }
    }


    const messageRetorno: MensagemItens = {
        texto: message ?? '',
        cor: cor,
        isVisible: true,
        onClick: () => { }
    }
    return messageRetorno;
}

