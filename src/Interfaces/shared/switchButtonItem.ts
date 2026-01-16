export interface SwitchButtonItem {
    label?: string;
    checked: boolean;
    handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}