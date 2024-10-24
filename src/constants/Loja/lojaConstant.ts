export const cnpjMaskConst = [
    /\d/, /\d/, '.', 
    /\d/, /\d/, /\d/, '.', 
    /\d/, /\d/, /\d/, '/', 
    /\d/, /\d/, /\d/, /\d/, '-', 
    /\d/, /\d/
];

export const propertyLabels: { [key: string]: string } = {
    
    razaoSocial: "Razão Social",
    cnpj: "CNPJ",
    email: "Email",
    telefone: "Telefone",
    tipoLojaDescricao : "Tipo de Loja"
};

export const modalTitulo = "Loja";
export const modalTexto = "Deseja remover a loja?"