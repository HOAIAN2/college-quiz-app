/* eslint-disable @typescript-eslint/no-explicit-any */
import request from '../config/api'
import {
	ApiResponseWithData,
	RolePermissionsResponse
} from '../models/response'
import { RoleWithPermissionCount } from '../models/role'

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

export async function apiUpdateRolePermissions(id: number | string, permissionIds: (number | string)[]) {
	try {
		const data = new URLSearchParams();
		permissionIds.forEach(item => {
			data.append('ids[]', String(item))
		})
		await request.put('/role-permission/' + id, data, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		})
	} catch (error: any) {
		throw new Error(error.message)
	}
}
