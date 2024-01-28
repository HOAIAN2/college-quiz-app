/* eslint-disable @typescript-eslint/no-explicit-any */
import request from '../config/api'
import { Faculty, FacultyDetail, QueryFacultyType } from '../models/faculty'
import { ApiResponseWithData, Pagination } from '../models/response'

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
        const { data } = res.data as ApiResponseWithData<Pagination<FacultyDetail>>
        return data
    } catch (error: any) {
        throw new Error(error.message)
    }
}
export async function apiCreateFaculty(formData: FormData) {
    try {
        await request.post('/faculty', formData)
    } catch (error: any) {
        if (!error.response) throw new Error(error.message)
        const message = error.response.data.message
        if (error.response.data.errors) return Promise.reject(error.response.data.errors)
        throw new Error(message)
    }
}
export async function apiUpdateFaculty(formData: FormData, id: string | number) {
    try {
        const data = new URLSearchParams();
        for (const pair of formData) {
            data.append(pair[0], pair[1] as string);
        }
        await request.put('/faculty/' + id, data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
    } catch (error: any) {
        if (!error.response) throw new Error(error.message)
        const message = error.response.data.message
        if (error.response.data.errors) return Promise.reject(error.response.data.errors)
        throw new Error(message)
    }
}
export async function apiGetFacultyById(id: string | number) {
    try {
        const res = await request.get('/faculty/' + id)
        const { data } = res.data as ApiResponseWithData<FacultyDetail>
        return data
    } catch (error: any) {
        throw new Error(error.message)
    }
}