import { DashboarData } from '../models/dashboard'
import { ApiResponseWithData } from '../models/response'
import request, { getToken } from './api-config'

export async function reqGetDashboard() {
    if (!getToken()) throw new Error('no token')
    try {
        const res = await request.get('/dashboard')
        const { data } = res.data as ApiResponseWithData<DashboarData>
        return data
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        if (!error.response) throw new Error(error.message)
        const message = error.response.data.message
        throw new Error(message)
    }
}