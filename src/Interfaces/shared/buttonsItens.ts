export interface ButtonItens {
    id?: number;
    label: string; 
    icon: React.ReactNode; 
    href: string; 
    onClick?: (event: React.MouseEvent, id?: number) => void;
}