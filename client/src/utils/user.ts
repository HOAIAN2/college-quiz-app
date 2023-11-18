import request, { getToken } from './api-config'
import { QueryUserType, User, UserDetail, UserPagination } from '../models/user'

export async function reqGetUser() {
    if (!getToken()) throw new Error('no token')
    try {
        const res = await request.get('/user')
        return res.data as User
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        if (!error.response) throw new Error(error.message)
        const message = error.response.data.message
        throw new Error(message)
    }
}
export async function reqCreateUser(form: FormData) {
    if (!getToken()) throw new Error('no token')
    try {
        await request.post('/user', form)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        if (!error.response) throw new Error(error.message)
        const message = error.response.data.message
        if (error.response.data.errors) return Promise.reject(error.response.data.errors)
        throw new Error(message)
    }
}
export async function reqImportUsers(file: File, role: 'student' | 'teacher') {
    if (!getToken()) throw new Error('no token')
    try {
        await request.post('/user/import', {
            role: role,
            file: file
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        if (!error.response) throw new Error(error.message)
        const message = error.response.data.message
        if (error.response.data.errors) return Promise.reject(error.response.data.errors)
        throw new Error(message)
    }
}
export async function reqGetUsersByType(query?: QueryUserType) {
    try {
        const res = await request.get('/user/query', {
            params: {
                role: query?.type,
                page: query?.page || 1,
                per_page: query?.perPage || 10,
                search: query?.search
            }
        })
        return res.data as UserPagination
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw new Error(error.message)
    }
}
export async function reqGetUsersById(id: string | number) {
    try {
        const res = await request.get('/user/' + id)
        return res.data as UserDetail
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw new Error(error.message)
    }
}