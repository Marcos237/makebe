import { SelectItens } from "../Interfaces/shared/selectItens";

export const mapToSelectItens = <T>(
  data: T[] | null | undefined,
  idField: keyof T,
  valueField: keyof T,
  urlImagemKey?: keyof T,
  isAvatar?: boolean 
): SelectItens[] => {
  return (
    data?.map((item) => {
      const id = item[idField];
      const value = item[valueField];

      if (id == null || value == null) return null;
      const rawImg = urlImagemKey ? (item[urlImagemKey] as unknown) : undefined;
      const urlImagem =
        typeof rawImg === "string" && rawImg.trim() !== "" ? rawImg : undefined;

      return {
        key: id as string | number,
        value: String(value),
        isAvatar: isAvatar ?? (urlImagem !== undefined),
        urlImagem, 
      };
    }).filter(Boolean) as SelectItens[]
  );
};
