import { SelectItens } from "./selectItens";

export const mapToSelectItens = <T>(
    data: T[] | null | undefined,
    idField: keyof T,
    valueField: keyof T
): SelectItens[] => {
    return (
        data?.map((item) => {
            const id = item[idField];
            const value = item[valueField];

            if (id !== undefined && value !== undefined) {
                return {
                    key: id as string | number,
                    value: value as string,
                };
            }
            return null;
        }).filter((item) => item !== null) as SelectItens[]
    );
};
