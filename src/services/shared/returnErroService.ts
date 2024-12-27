import axios, { AxiosError } from "axios";
import { NotificationItens } from "../../Interfaces/shared/NotificationItens";

export function returnErroService(error: unknown): NotificationItens[] | null {
    if (!axios.isAxiosError(error)) {
        return null;
    }

    const notifications: NotificationItens[] = [];
    const axiosError = error as AxiosError;
    const responseData = axiosError?.response?.request?.response;


    if (axiosError?.response?.status === 403) {
        window.location.href = "/login";  
        return null; 
    }

    const erroNotifications: Array<{ Key: string; Message: string; IsValidate: boolean }> = 
        responseData ? JSON.parse(responseData) : [];

    if (Array.isArray(erroNotifications)) {
        erroNotifications.forEach((erroNotification) => {
            notifications.push({
                notificationProps: {
                    Key: erroNotification.Key,
                    Message: erroNotification.Message,
                    IsValidate: erroNotification.IsValidate,
                },
            });
        });
    }

    return notifications;
}
