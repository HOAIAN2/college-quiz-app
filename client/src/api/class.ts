import { SchoolClass } from '../models/class'
import { ApiResponseWithData } from '../models/response'
import request, { getToken } from './config'

export async function apiAutoCompleteClass(search: string) {
    if (!getToken()) throw new Error('no token')
    try {
        const res = await request.get('/class/complete', {
            params: {
                search: search
            }
        })
        const { data } = res.data as ApiResponseWithData<SchoolClass[]>
        return data
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        if (!error.response) throw new Error(error.message)
        const message = error.response.data.message
        throw new Error(message)
    }
}