/* eslint-disable @typescript-eslint/no-explicit-any */
import request from '../config/api'
import encodeFormData from '../utils/encodeFormData'

export async function apiCreateQuestionOption(formData: FormData) {
	try {
		await request.post('/question-option', formData)
	} catch (error: any) {
		if (!error.response) throw new Error(error.message)
		const message = error.response.data.message
		if (error.response.data.errors) return Promise.reject(error.response.data.errors)
		throw new Error(message)
	}
}

export async function apiUpdateQuestion(formData: FormData, id: string | number) {
	try {
		const data = encodeFormData(formData)
		await request.put('/question-option/' + id, data, {
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


export async function apiDeleteQuestionOption(id: string | number) {
	try {
		await request.delete('/question-option/' + id)
	} catch (error: any) {
		if (!error.response) throw new Error(error.message)
		const message = error.response.data.message
		if (error.response.data.errors) return Promise.reject(error.response.data.errors)
		throw new Error(message)
	}
}
