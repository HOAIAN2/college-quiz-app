/* eslint-disable @typescript-eslint/no-explicit-any */
import request from '../config/api'
import { ApiResponseWithData, Pagination } from '../models/response'
import { QuerySchoolClassType, SchoolClass, SchoolClassDetail } from '../models/school-class'
import encodeFormData from '../utils/encodeFormData'

export async function apiAutoCompleteSchoolClass(search: string) {
	try {
		const res = await request.get('/school-class/complete', {
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
export async function apiGetSchoolClasses(query?: QuerySchoolClassType) {
	try {
		const res = await request.get('/school-class', {
			params: {
				page: query?.page || 1,
				per_page: query?.perPage || 10,
				search: query?.search
			}
		})
		const { data } = res.data as ApiResponseWithData<Pagination<SchoolClassDetail>>
		return data
	} catch (error: any) {
		throw new Error(error.message)
	}
}
export async function apiGetSchoolClassById(id: string | number) {
	try {
		const res = await request.get('/school-class/' + id)
		const { data } = res.data as ApiResponseWithData<SchoolClassDetail>
		return data
	} catch (error: any) {
		throw new Error(error.message)
	}
}
export async function apiUpdateSchoolClass(formData: FormData, id: string | number) {
	try {
		const data = encodeFormData(formData)
		await request.put('/school-class/' + id, data, {
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
export async function apiDeleteSchoolClassIds(ids: (string | number)[]) {
	try {
		await request.delete('/school-class', {
			params: {
				ids: ids,
			}
		})
	} catch (error: any) {
		throw new Error(error.message)
	}
}
export async function apiCreateSchoolClass(formData: FormData) {
	try {
		await request.post('/school-class', formData)
	} catch (error: any) {
		if (!error.response) throw new Error(error.message)
		const message = error.response.data.message
		if (error.response.data.errors) return Promise.reject(error.response.data.errors)
		throw new Error(message)
	}
}
