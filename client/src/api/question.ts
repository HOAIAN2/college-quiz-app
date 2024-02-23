/* eslint-disable @typescript-eslint/no-explicit-any */
import request from '../config/api'
import { QueryQuestionType, Question } from '../models/question'
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
