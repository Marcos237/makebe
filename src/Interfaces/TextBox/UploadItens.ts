export interface UploadItens {
    uploadProps: {
        nomeImagem?: string;
        urlImagem?: string;
        tituloImagem?: string;
        id?: string;
    }
    onUpload?: (base64String: string, fileName: string, titulo?: string, index?: string) => void;
}