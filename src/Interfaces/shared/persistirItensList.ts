import { PersistirItens } from "./persistirItens";

export interface PersistirItensList<T>  {
    persistirList?: Array<PersistirItens<T>>
}

export const persistirDropList = <T>(): Array<PersistirItens<T>> => {
    return [];
  };