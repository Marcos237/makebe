import { ErroItem } from '../Interfaces/shared/erroItem';

interface NotificationLike {
  notificationProps?: {
    Key?: string;
    Message?: string;
  };
}

export function mapNotificationErrors(
  notifications?: NotificationLike[] | null
): ErroItem[] {
  if (!Array.isArray(notifications) || notifications.length === 0) {
    return [];
  }

  return notifications.map((notification) => ({
    Key: notification.notificationProps?.Key ?? 'session',
    Mensagem: notification.notificationProps?.Message ?? 'Erro desconhecido.',
    erroSession: notification.notificationProps?.Key ?? 'session',
  }));
}
