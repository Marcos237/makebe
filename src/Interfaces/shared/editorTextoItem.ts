export interface EditorTextoItem {
    placeholder?: string;
    nome?: string;
    value?:string;
    label?: string;
    rows?: number;
    altura?: number;
    alturaDefault? : number;
    maxlength?: number;
    readonly?: boolean; 
    onChange: (value: string) => void;
}