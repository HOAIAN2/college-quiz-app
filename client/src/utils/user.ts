import request, { getToken } from './api-config'
import { User } from '../models/user'

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