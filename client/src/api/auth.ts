import { ApiResponseWithData, LoginResponse } from '../models/response'
import request, {
    // getToken
} from './config'

export async function apiLogin(form: FormData) {
    try {
        const res = await request.post('/auth/login', form)
        const { data } = res.data as ApiResponseWithData<LoginResponse>
        localStorage.setItem('token', data.token)
        return data.user
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        if (!error.response) throw new Error(error.message)
        const message = error.response.data
        // if (message.errors) {
        //     if (message.errors.email) return Promise.reject({ email: message.errors.email[0] })
        //     else return Promise.reject({ password: message.errors.password[0] })
        // }
        throw new Error(message.message)
    }
}
export async function apiLogout() {
    try {
        await request.post('/auth/logout')
        localStorage.removeItem('token')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        if (!error.response) throw new Error(error.message)
        const message = error.response.data.message
        localStorage.removeItem('token')
        throw new Error(message)
    }
}