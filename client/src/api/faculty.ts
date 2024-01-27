/* eslint-disable @typescript-eslint/no-explicit-any */
import request from '../config/api'
import { Faculty, QueryFacultyType } from '../models/faculty'
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
export async function apiGetFaculties(query?: QueryFacultyType) {
    try {
        const res = await request.get('/faculty', {
            params: {
                page: query?.page || 1,
                per_page: query?.perPage || 10,
                search: query?.search
            }
        })
        const { data } = res.data as ApiResponseWithData<[]>
        return data
    } catch (error: any) {
        throw new Error(error.message)
    }
}