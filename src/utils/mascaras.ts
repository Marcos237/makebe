export const moneyMaskConst = (value: number): string => {
    const numericValue = value.toFixed(2); 
    return Number(numericValue).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    });
  };
  
  

export const  cpfMaskConst = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];
export const foneMaskConst = (rawValue: string) => {
    const numbers = rawValue.replace(/\D/g, '');
    if (numbers.length < 10) {
        return ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    } else {
        return ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/] 
    }
};

export const cnpjMaskConst = [
    /\d/, /\d/, '.',
    /\d/, /\d/, /\d/, '.',
    /\d/, /\d/, /\d/, '/',
    /\d/, /\d/, /\d/, /\d/, '-',
    /\d/, /\d/
];
