export interface UploadItens {
    uploadProps: {
        nomeImagem?: string;
        urlImagem?: string;
        tituloImagem?: string;
        id?: string;
        tituloSessao?: string;
        errorSession?:string;
        name?: string;
        readonly?: boolean;
    }
    onUpload?: (base64String: string, fileName: string, titulo?: string, index?: string, tituloSessao?: string, name?: string) => void;
}
