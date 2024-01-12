/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiResponseWithData } from '../models/response'
import request from './config'

export async function apiGetNavBarItems() {
    try {
        const res = await request.get('/role-permission/nav-bar-features')
        const { data } = res.data as ApiResponseWithData<string[]>
        return data
    } catch (error: any) {
        throw new Error(error.message)
    }
}