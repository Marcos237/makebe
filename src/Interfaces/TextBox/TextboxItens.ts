export interface TextBoxItens {
  textBoxProps: {
    name?: string;
    tooltip?: string;
    label?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    multiline?: boolean;
    rows?: number;
    value?: string;
    onIconClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;  
    icon?: React.ReactNode;
    type?: string;
    mask?: Array<string | RegExp>;
    readonly?: boolean;
    maxLength?: number;
  };
}