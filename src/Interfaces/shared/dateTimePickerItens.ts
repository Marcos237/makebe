

export interface DateTimePickerItens {
    name?: string;
    label: string;
    value: any;
    onChange: (value: any) => void;
    width?: string;
    tipo?: 'data' | 'hora' | 'datahora'; 
    isLeituraOnly?: boolean;
    erroSession?: string;
  }
  