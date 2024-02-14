/* eslint-disable @typescript-eslint/no-explicit-any */
import request from '../config/api'
import { ApiResponseWithData } from '../models/response'
import { QuerySubjectType, Subject } from '../models/subject'

export async function apiGetSubjects(query?: QuerySubjectType) {
	try {
		const res = await request.get('/subject', {
			params: {
				page: query?.page || 1,
				per_page: query?.perPage || 10,
				search: query?.search
			}
		})
		const { data } = res.data as ApiResponseWithData<Subject[]>
		return data
	} catch (error: any) {
		throw new Error(error.message)
	}
}
