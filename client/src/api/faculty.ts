/* eslint-disable @typescript-eslint/no-explicit-any */
import request from '../config/api'
import { Faculty } from '../models/faculty'
import { ApiResponseWithData } from '../models/response'

export async function apiAutoCompleteFaculty(search: string) {
    try {
        const res = await request.get('/faculty/complete', {
            params: {
                search: search
            }
        })
        const { data } = res.data as ApiResponseWithData<Faculty[]>
        return data
    } catch (error: any) {
        if (!error.response) throw new Error(error.message)
        const message = error.response.data.message
        throw new Error(message)
    }
}