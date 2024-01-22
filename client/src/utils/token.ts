const env = import.meta.env

const tokenKey = env.VITE_TOKEN_KEY as string

export function getToken() {
    return localStorage.getItem(tokenKey)
}
export function setToken(token: string) {
    localStorage.setItem(tokenKey, token)
}

export function removeToken() {
    localStorage.removeItem(tokenKey)
}