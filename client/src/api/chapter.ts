/* eslint-disable @typescript-eslint/no-explicit-any */
import request from '../config/api'

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
