export const  cpfMaskConst = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];
export const foneMaskConst = (rawValue: string) => {
    const numbers = rawValue.replace(/\D/g, '');
    if (numbers.length < 10) {
        return ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];;
    } else {
        return ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/] 
    }
};

export const NomeConst = "Nome" ;
export const CpfConst = "Cpf";
export const EmailConst = "Email";
export const TelefoneConst = "Telefone";
export const InstagranConst = "Instagran";
export const SenhaConst = "Senha";
export const ConfirmaSenhaConst = "ConfirmaSenha";
export const UrlImagemConst = "UrlImagem";
export const MensagemCadastro = "Uma mensagem foi enviada para sua caixa de e-mail, por favor verifique para validar sua conta.";
export const MensagemUpDate = "Item atualizado com sucesso.";
export const UrlUsuarioLogado = "UsuarioSessao";
export const UrlUsuarioPerfil = "UsuarioPerfil";
