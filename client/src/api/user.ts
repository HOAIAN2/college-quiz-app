/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from 'axios'
import request from '../config/api'
import { ApiResponseWithData, ExportableResponse, Pagination } from '../models/response'
import { RoleName } from '../models/role'
import {
	QueryUserType,
	User,
	UserDetail,
	UserWithPermissions
} from '../models/user'
import encodeFormData from '../utils/encodeFormData'
import tokenUtils from '../utils/tokenUtils'

export async function apiGetUser() {
	if (!tokenUtils.getToken()) throw new Error('no token')
	try {
		const res = await request.get('/user')
		const { data } = res.data as ApiResponseWithData<UserWithPermissions>
		return data
	} catch (error: any) {
		if (!error.response) throw new Error(error.message)
		if (error.response.status === 401) tokenUtils.removeToken()
		const message = error.response.data.message
		throw new Error(message)
	}
}

export async function apiCreateUser(formData: FormData) {
	try {
		await request.post('/user', formData)
	} catch (error: any) {
		if (!error.response) throw new Error(error.message)
		const message = error.response.data.message
		if (error.response.data.errors) return Promise.reject(error.response.data.errors)
		throw new Error(message)
	}
}

export async function apiUpdateUser(formData: FormData, id: string | number) {
	try {
		const data = encodeFormData(formData)
		await request.put('/user/' + id, data, {
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

export async function apiImportUsers(file: File, role: RoleName) {
	const data = new FormData()
	data.append('role', role)
	data.append('file', file)
	try {
		await request.post('/user/import', data)
	} catch (error: any) {
		if (!error.response) throw new Error(error.message)
		const message = error.response.data.message
		if (error.response.data.errors) return Promise.reject(error.response.data.errors)
		throw new Error(message)
	}
}

export async function apiGetUsersByType(query: QueryUserType) {
	try {
		const res = await request.get('/user/query', {
			params: {
				role: query.role,
				page: query.page || 1,
				per_page: query.perPage || 10,
				search: query.search
			}
		})
		const { data } = res.data as ApiResponseWithData<Pagination<UserDetail>>
		return data
	} catch (error: any) {
		throw new Error(error.message)
	}
}

export async function apiGetUserById(id: string | number) {
	try {
		const res = await request.get('/user/' + id)
		const { data } = res.data as ApiResponseWithData<UserDetail>
		return data
	} catch (error: any) {
		throw new Error(error.message)
	}
}

export async function apiDeleteUserByIds(ids: (string | number)[]) {
	try {
		await request.delete('/user', {
			params: {
				ids: ids,
			}
		})
	} catch (error: any) {
		throw new Error(error.message)
	}
}

export async function apiGetUserExportableFields(role: RoleName) {
	try {
		const res = await request.get('/user/exportable', {
			params: {
				role: role,
			},
		})
		const { data } = res.data as AxiosResponse<ExportableResponse[]>
		return data
	} catch (error: any) {
		throw new Error(error.message)
	}
}

export async function apiExportUsers(role: RoleName, fields: (string)[]) {
	try {
		const response: AxiosResponse<Blob> = await request.get('/user/export', {
			params: {
				role: role,
				fields: fields
			},
			responseType: 'blob'
		})
		return response.data
	} catch (error: any) {
		throw new Error(error.message)
	}
}

export async function apiAutoCompleteUser(role: RoleName, search: string) {
	try {
		const res = await request.get('/user/complete', {
			params: {
				role: role,
				search: search
			}
		})
		const { data } = res.data as ApiResponseWithData<User[]>
		return data
	} catch (error: any) {
		if (!error.response) throw new Error(error.message)
		const message = error.response.data.message
		throw new Error(message)
	}
}

export async function apiGetAllStudent(search?: string) {
	try {
		const res = await request.get('/user/all-student', {
			params: {
				search: search
			}
		})
		const { data } = res.data as ApiResponseWithData<UserDetail[]>
		return data
	} catch (error: any) {
		throw new Error(error.message)
	}
}
