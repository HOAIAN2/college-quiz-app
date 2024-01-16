/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    ApiResponseWithData,
    RolePermissionsResponse
} from '../models/response'
import { RoleWithPermissionCount } from '../models/role'
import request from './config'

export async function apiGetRolePermissionCount() {
    try {
        const res = await request.get('/role-permission')
        const { data } = res.data as ApiResponseWithData<RoleWithPermissionCount[]>
        return data
    } catch (error: any) {
        throw new Error(error.message)
    }
}

export async function apiGetRolePermissions(id: number) {
    try {
        const res = await request.get('/role-permission/' + id)
        const { data } = res.data as ApiResponseWithData<RolePermissionsResponse>
        return data
    } catch (error: any) {
        throw new Error(error.message)
    }
}