export interface DropDownItens {
    label? : string,
    placeholder?: string,
    itens?: Array<ItensSelect>,
    name?: string,
}

export interface ItensSelect {
    key?: number,
    value?: string
}