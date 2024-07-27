import { MaskarasItens } from "./MaskarasItens";

export interface TextBoxProps extends MaskarasItens {
  mask?: Array<string | RegExp>;
}