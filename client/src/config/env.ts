const env = import.meta.env

export const VITE_DEV_SERVER_PORT = env.VITE_DEV_SERVER_PORT as string
export const DEFAULT_DEBOUCE = Number(env.VITE_DEFAULT_DEBOUCE)
export const TOKEN_KEY = env.VITE_TOKEN_KEY as string
export const LANG_KEY = env.VITE_LANG_KEY as string
export const APP_NAME = env.VITE_APP_NAME as string
export const OVERRIDE_HTTP_METHOD = env.VITE_OVERRIDE_HTTP_METHOD === 'true' ? true : false