export interface ButtonItens {
    id?: number;
    label: string; 
    icon: React.ReactNode; 
    href: string; 
    class?: string;
    onClick?: (event: React.MouseEvent, id?: number) => void;
}