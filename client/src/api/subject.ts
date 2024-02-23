/* eslint-disable @typescript-eslint/no-explicit-any */
import request from '../config/api'
import { ApiResponseWithData } from '../models/response'
import { Subject, SubjectDetail } from '../models/subject'
import encodeFormData from '../utils/encodeFormData'

export async function apiGetSubjects(query: string) {
	try {
		const res = await request.get('/subject', {
			params: {
				search: query
			}
		})
		const { data } = res.data as ApiResponseWithData<Subject[]>
		return data
	} catch (error: any) {
		throw new Error(error.message)
	}
}

export async function apiGetSubjectById(id: string | number) {
	try {
		const res = await request.get('/subject/' + id)
		const { data } = res.data as ApiResponseWithData<SubjectDetail>
		return data
	} catch (error: any) {
		throw new Error(error.message)
	}
}

export async function apiCreateSubject(formData: FormData) {
	try {
		await request.post('/subject', formData)
	} catch (error: any) {
		if (!error.response) throw new Error(error.message)
		const message = error.response.data.message
		if (error.response.data.errors) return Promise.reject(error.response.data.errors)
		throw new Error(message)
	}
}

export async function apiUpdateSubject(formData: FormData, id: string | number) {
	try {
		const data = encodeFormData(formData)
		await request.put('/subject/' + id, data, {
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

export async function apiDeleteSubject(id: string | number) {
	try {
		await request.delete('/subject/' + id)
	} catch (error: any) {
		if (!error.response) throw new Error(error.message)
		const message = error.response.data.message
		if (error.response.data.errors) return Promise.reject(error.response.data.errors)
		throw new Error(message)
	}
}
