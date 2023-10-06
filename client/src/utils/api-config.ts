import axios, { AxiosError, AxiosResponse } from 'axios'
import toast from './toast'

const devPorts = '3000'
let baseURL = ''
let baseIMG = ''
if (devPorts === window.location.port) {
    baseURL = `${window.location.origin.replace(devPorts, '8000')}/api/`
    baseIMG = `${window.location.origin.replace(devPorts, '8000')}/`
}
else {
    baseURL = `${window.location.origin}/api/`
    baseIMG = `${window.location.origin}/`
}
const ignoreLoaders = [
    '/user/info',
    '/comment',
    '/product/suggest',
    '/product/auto-complete'
]
function getToken() {
    const token = localStorage.getItem('token') || '' as string
    return token
}
function getTokenHeader() {
    return `Bearer ${getToken()}`
}
const request = axios.create({
    baseURL: baseURL
})
request.interceptors.request.use(config => {
    if (config.method === 'get' && !ignoreLoaders.includes(config.url || '')) {
        config.onDownloadProgress = (progressEvent) => {
            const loaderElement = document.querySelector<HTMLDivElement>('#loader')
            if (progressEvent.progress && loaderElement) {
                const percent = 100 * progressEvent.progress
                if (percent !== 100) loaderElement.style.width = `${percent}%`
                else loaderElement.style.width = '0%'
            }
        }
    }
    if (getToken()) {
        config.headers.Authorization = getTokenHeader()
    }
    config.headers['Content-Type'] = 'multipart/form-data'
    return config
})

// request.interceptors.response.use((response) => {
//     console.log(response.data)
//     if (response.data &&
//         response.headers['content-type'] === 'application/json') {
//         if (response.data.message && response.data.status === 'fail') toast.error(response.data.message)
//         if (response.data.message && response.data.status === 'success') toast.error(response.data.message)
//     }
//     return response;
// })
request.interceptors.response.use(
    function (response) {
        if (response.data && response.headers['content-type'] === 'application/json')
            if (response.data.message && response.data.status === 'success') toast.success(response.data.message)
        return response
    },
    function (error: AxiosError) {
        const response = error.response as AxiosResponse
        if (response.data && response.headers['content-type'] === 'application/json') {
            if (response.data.message && response.data.status === 'fail') toast.error(response.data.message)
        }
        return Promise.reject(error)
    }
);
export {
    baseIMG,
    getToken,
    getTokenHeader,
}
export default request