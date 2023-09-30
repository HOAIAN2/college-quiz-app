import { LoginResponse } from '../models/user'
import request, {
    // getToken
} from './api-config'

export async function reqLogin(form: FormData) {
    try {
        const res = await request.post('/auth/login', form)
        const data = res.data as LoginResponse
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
export async function reqLogout() {
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