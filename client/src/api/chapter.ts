/* eslint-disable @typescript-eslint/no-explicit-any */
import request from '../config/api'
import encodeFormData from '../utils/encodeFormData'

export async function apiCreateChapter(formData: FormData) {
	try {
		await request.post('/chapter', formData)
	} catch (error: any) {
		if (!error.response) throw new Error(error.message)
		const message = error.response.data.message
		if (error.response.data.errors) return Promise.reject(error.response.data.errors)
		throw new Error(message)
	}
}

export async function apiUpdateChapter(formData: FormData, id: string | number) {
	try {
		const data = encodeFormData(formData)
		await request.put('/chapter/' + id, data, {
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

export async function apiDeleteChapter(id: string | number) {
	try {
		await request.delete('/chapter/' + id)
	} catch (error: any) {
		if (!error.response) throw new Error(error.message)
		const message = error.response.data.message
		if (error.response.data.errors) return Promise.reject(error.response.data.errors)
		throw new Error(message)
	}
}
