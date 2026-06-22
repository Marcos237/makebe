export interface SwitchButtonItem {
    label?: string;
    name?: string;
    erroSession?: string;
    checked: boolean;
    handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
