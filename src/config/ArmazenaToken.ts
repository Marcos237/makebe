type JWTToken = string;
export const saveTokenToLocalStorage = (token: JWTToken): void => {
    localStorage.setItem('token', token);
};

export const getTokenFromLocalStorage = (): JWTToken | null => {
    return localStorage.getItem('token');
};

export const removeTokenFromLocalStorage = (): void => {
    localStorage.removeItem('token');
};

export const hasValidTokenInLocalStorage = (): boolean => {
    const token = getTokenFromLocalStorage();
    return Boolean(token && token.trim());
};
