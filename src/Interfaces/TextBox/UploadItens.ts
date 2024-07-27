export interface UploadItens {
    uploadProps: {
        nomeImagem?: string;
        urlImagem?: string;
    }
    onUpload?: (base64String: string, fileName: string) => void;
}