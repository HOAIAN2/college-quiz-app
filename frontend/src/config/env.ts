import getCookieValue from '~utils/get-cookie-value';

const env = import.meta.env;

export const VITE_DEV_SERVER_PORT = env.VITE_DEV_SERVER_PORT as string;
export const DEFAULT_DEBOUNCE = Number(env.VITE_DEFAULT_DEBOUNCE);
export const TOKEN_KEY = env.VITE_TOKEN_KEY as string;
export const LANG_KEY = env.VITE_LANG_KEY as string;
export const OVERRIDE_HTTP_METHOD = env.VITE_OVERRIDE_HTTP_METHOD === 'true' ? true : false;
export const API_HOST = env.VITE_API_HOST ? env.VITE_API_HOST
    : env.DEV === true ?
        window.location.origin.replace(window.location.port, VITE_DEV_SERVER_PORT) :
        window.location.origin;
export const AUTO_COMPLETE_DEBOUNCE = Number(env.VITE_AUTO_COMPLETE_DEBOUNCE);
export const BASE_SCORE_SCALE = getCookieValue('base_score_scale')
    ? Number(getCookieValue('base_score_scale'))
    : 10;
export const PRIMARY_COLOR_KEY = env.VITE_PRIMARY_COLOR_KEY as string;
