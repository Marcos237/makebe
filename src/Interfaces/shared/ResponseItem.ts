import { NotificationItens } from "../shared/NotificationItens";
export interface ResponseItem<T> {
    data?: T;
    datas?: Array<T>
    notifications?: Array<NotificationItens>;
  }