type JWTToken = string;
export const saveTokenToLocalStorage = (token: JWTToken): void => {
    localStorage.setItem('token', token);
};

export const getTokenFromLocalStorage = (): JWTToken | null => {
    return localStorage.getItem('token');
};
