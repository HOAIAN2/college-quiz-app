/* eslint-disable @typescript-eslint/no-explicit-any */
import { DashboarData } from '../models/dashboard'
import { ApiResponseWithData } from '../models/response'
import { getToken } from '../utils/token'
import request from './config'

export async function apiGetDashboard() {
    if (!getToken()) throw new Error('no token')
    try {
        const res = await request.get('/dashboard')
        const { data } = res.data as ApiResponseWithData<DashboarData>
        return data
    } catch (error: any) {
        if (!error.response) throw new Error(error.message)
        const message = error.response.data.message
        throw new Error(message)
    }
}