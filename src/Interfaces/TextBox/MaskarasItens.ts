export interface MaskarasItens {
  inputRef?: ((instance: HTMLInputElement | null) => void) | React.RefObject<HTMLInputElement> | null;
  mask?: Array<string | RegExp>;
  placeholder?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}