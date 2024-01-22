import axios, { AxiosError, AxiosResponse } from 'axios'
import { toast } from 'sonner'
import { getLanguage } from '../utils/languages'
import { getToken, removeToken } from '../utils/token'
const env = import.meta.env

type TemplateFileUrl = {
    [key: string]: string;
}

const overrideHttpMethod = env.VITE_OVERRIDE_HTTP_METHOD === 'true' ? true : false

const host = env.DEV === true ? `${window.location.origin.replace(env.VITE_DEV_PORT, env.VITE_DEV_SERVER_PORT)}/`
    : `${window.location.origin}/`

const baseURL = host + 'api/'

const ignoreLoaders: string[] = []
export const templateFileUrl = {
    student: host + 'data/Import_Student_Template.xlsx',
    teacher: host + 'data/Import_Teacher_Template.xlsx',
} as TemplateFileUrl

export function getTokenHeader() {
    return `Bearer ${getToken()}`
}
const request = axios.create({
    baseURL: baseURL
})
request.interceptors.request.use(config => {
    config.headers['Accept-Language'] = getLanguage()
    if (config.method === 'get' && !ignoreLoaders.includes(config.url || '')) {
        config.onDownloadProgress = (progressEvent) => {
            const loaderElement = document.querySelector<HTMLDivElement>('#loader')
            if (progressEvent.progress && loaderElement) {
                const percent = 100 * progressEvent.progress
                if (percent !== 100) requestAnimationFrame(() => { loaderElement.style.width = `${percent}%` })
                else requestAnimationFrame(() => { loaderElement.style.width = '0%' })
            }
        }
    }
    if (getToken()) {
        config.headers.Authorization = getTokenHeader()
    }
    if (overrideHttpMethod) {
        if (config.method !== 'get' && config.method !== 'post') {
            const override = config.method?.toUpperCase() as string
            config.data = config.data || new FormData()
            if (config.data instanceof FormData) {
                config.data.append('_method', override)
            } else if (typeof config.data === 'object' && !(config.data instanceof URLSearchParams)) {
                config.data = config.data || {}
                config.data._method = config.method
            } else if (config.data instanceof URLSearchParams) {
                config.data.append('_method', override)
            }
            config.method = 'post'
        }
    }
    if (!config.headers['Content-Type']) config.headers['Content-Type'] = 'multipart/form-data'
    return config
})

request.interceptors.response.use(
    function (response) {
        if (response.data && response.headers['content-type'] === 'application/json')
            if (response.data.message && response.data.status === 'success') toast.success(response.data.message)
        return response
    },
    function (error: AxiosError) {
        if (error.response?.status === 401) {
            if (getToken()) {
                removeToken()
                const cleanUrl = window.location.href.split('?')[0]
                window.location.href = cleanUrl
                return Promise.reject(error)
            }
        }
        if (error.code?.startsWith('ERR_NETWORK')) {
            toast.error(error.message)
            return Promise.reject(error)
        }
        const response = error.response as AxiosResponse
        if (response.data && response.headers['content-type'] === 'application/json') {
            if (response.data.message) toast.error(response.data.message)
        }
        return Promise.reject(error)
    }
)

export default request