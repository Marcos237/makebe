import axios, { AxiosError } from "axios";
import { NotificationItens } from "../../Interfaces/shared/NotificationItens";
import { removeTokenFromLocalStorage } from "../../config/ArmazenaToken";

const VITRINE_PATHS = ["/", "/home", "/Home", "/vitrine", "/vitrine/"];

export function returnErroService(error: unknown): NotificationItens[] | null {
  if (!axios.isAxiosError(error)) {
    return null;
  }

  const notifications: NotificationItens[] = [];
  const axiosError = error as AxiosError;


  if (
    [401, 403].includes(axiosError?.response?.status ?? 0) &&
    !['/Perfil', '/perfil'].includes(window.location.pathname)
  ) {
    removeTokenFromLocalStorage();

    if (!VITRINE_PATHS.includes(window.location.pathname)) {
      window.location.href = "/vitrine";
    }

    return null;
  }

  let responseData: any = axiosError.response?.data;


  if (typeof responseData === 'string') {
    try {
      responseData = JSON.parse(responseData);
    } catch (e) {

      notifications.push({
        notificationProps: {
          Key: '',
          Message: responseData,
          IsValidate: false,
        },
      });
      return notifications;
    }
  }

  if (Array.isArray(responseData)) {
    responseData.forEach((erroNotification: any) => {
      notifications.push({
        notificationProps: {
          Key: erroNotification.Key ?? '',
          Message: erroNotification.Message ?? 'Erro desconhecido.',
          IsValidate: erroNotification.IsValidate ?? false,
        },
      });
    });
  }

  else if (responseData?.message) {
    notifications.push({
      notificationProps: {
        Key: '',
        Message: responseData.message,
        IsValidate: false,
      },
    });
  }

  return notifications;
}
