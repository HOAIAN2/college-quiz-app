/* eslint-disable @typescript-eslint/no-explicit-any */
import request from '../config/api'
import { SchoolClass } from '../models/class'
import { ApiResponseWithData } from '../models/response'

export async function apiAutoCompleteClass(search: string) {
    try {
        const res = await request.get('/class/complete', {
            params: {
                search: search
            }
        })
        const { data } = res.data as ApiResponseWithData<SchoolClass[]>
        return data
    } catch (error: any) {
        if (!error.response) throw new Error(error.message)
        const message = error.response.data.message
        throw new Error(message)
    }
}