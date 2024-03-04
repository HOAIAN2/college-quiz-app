/* eslint-disable @typescript-eslint/no-explicit-any */
import request from '../config/api'
import { ApiResponseWithData } from '../models/response'
import { Semester } from '../models/semester'
import encodeFormData from '../utils/encodeFormData'

export async function apiGetSemesters(query: string) {
	try {
		const res = await request.get('/semester', {
			params: {
				search: query
			}
		})
		const { data } = res.data as ApiResponseWithData<Semester[]>
		return data
	} catch (error: any) {
		throw new Error(error.message)
	}
}

export async function apiGetSemesterById(id: string | number) {
	try {
		const res = await request.get('/semester/' + id)
		const { data } = res.data as ApiResponseWithData<Semester>
		return data
	} catch (error: any) {
		throw new Error(error.message)
	}
}

export async function apiCreateSemester(formData: FormData) {
	try {
		await request.post('/semester', formData)
	} catch (error: any) {
		if (!error.response) throw new Error(error.message)
		const message = error.response.data.message
		if (error.response.data.errors) return Promise.reject(error.response.data.errors)
		throw new Error(message)
	}
}

export async function apiUpdateSemester(formData: FormData, id: string | number) {
	try {
		const data = encodeFormData(formData)
		await request.put('/semester/' + id, data, {
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

export async function apiDeleteSemester(id: string | number) {
	try {
		await request.delete('/semester/' + id)
	} catch (error: any) {
		if (!error.response) throw new Error(error.message)
		const message = error.response.data.message
		if (error.response.data.errors) return Promise.reject(error.response.data.errors)
		throw new Error(message)
	}
}

export async function apiAutoCompleteSemester(search: string) {
	try {
		const res = await request.get('/semester/complete', {
			params: {
				search: search
			}
		})
		const { data } = res.data as ApiResponseWithData<Semester[]>
		return data
	} catch (error: any) {
		if (!error.response) throw new Error(error.message)
		const message = error.response.data.message
		throw new Error(message)
	}
}
