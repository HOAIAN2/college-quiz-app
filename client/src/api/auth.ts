/* eslint-disable @typescript-eslint/no-explicit-any */
import request from '../config/api'
import { ApiResponseWithData, LoginResponse } from '../models/response'
import { removeToken, setToken } from '../utils/token'

export async function apiLogin(form: FormData) {
    try {
        const res = await request.post('/auth/login', form)
        const { data } = res.data as ApiResponseWithData<LoginResponse>
        setToken(data.token)
        return data.user
    } catch (error: any) {
        if (!error.response) throw new Error(error.message)
        const message = error.response.data
        throw new Error(message.message)
    }
}
export async function apiChangePassword(form: FormData) {
    try {
        await request.post('/auth/change-password', form)
        removeToken()
    } catch (error: any) {
        if (!error.response) throw new Error(error.message)
        const message = error.response.data.message
        throw new Error(message)
    }
}
export async function apiLogout() {
    try {
        await request.post('/auth/logout')
        removeToken()
    } catch (error: any) {
        if (!error.response) throw new Error(error.message)
        const message = error.response.data.message
        removeToken()
        throw new Error(message)
    }
}