/* eslint-disable @typescript-eslint/no-explicit-any */
import request from '../config/api'
import { QueryQuestionType, Question, QuestionDetail } from '../models/question'
import { ApiResponseWithData } from '../models/response'

export async function apiGetQuestions(query: QueryQuestionType) {
	try {
		const res = await request.get('/question', {
			params: {
				search: query
			}
		})
		const { data } = res.data as ApiResponseWithData<Question[]>
		return data
	} catch (error: any) {
		throw new Error(error.message)
	}
}

export async function apiCreateQuestion(formData: FormData) {
	try {
		await request.post('/question', formData)
	} catch (error: any) {
		if (!error.response) throw new Error(error.message)
		const message = error.response.data.message
		if (error.response.data.errors) return Promise.reject(error.response.data.errors)
		throw new Error(message)
	}
}

export async function apiGetQuestionById(id: string | number) {
	try {
		const res = await request.get('/question/' + id)
		const { data } = res.data as ApiResponseWithData<QuestionDetail>
		return data
	} catch (error: any) {
		throw new Error(error.message)
	}
}
