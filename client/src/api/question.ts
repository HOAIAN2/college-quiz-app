/* eslint-disable @typescript-eslint/no-explicit-any */
import request from '../config/api';
import { QueryQuestionType, Question, QuestionDetail } from '../models/question';
import { ApiResponseWithData } from '../models/response';
import encodeFormData from '../utils/encodeFormData';
import pathUtils from '../utils/pathUtils';

const prefix = 'question';

export async function apiGetQuestions(query: QueryQuestionType) {
	try {
		const res = await request.get(pathUtils.join(prefix), {
			params: {
				subject_id: query.subjectId,
				chapter_id: query.chapterId,
				search: query.search
			}
		});
		const { data } = res.data as ApiResponseWithData<Question[]>;
		return data;
	} catch (error: any) {
		throw new Error(error.message);
	}
}

export async function apiCreateQuestion(formData: FormData) {
	try {
		await request.post(pathUtils.join(prefix), formData);
	} catch (error: any) {
		if (!error.response) throw new Error(error.message);
		const message = error.response.data.message;
		if (error.response.data.errors) return Promise.reject(error.response.data.errors);
		throw new Error(message);
	}
}

export async function apiGetQuestionById(id: string | number) {
	try {
		const res = await request.get(pathUtils.join(prefix, id));
		const { data } = res.data as ApiResponseWithData<QuestionDetail>;
		return data;
	} catch (error: any) {
		throw new Error(error.message);
	}
}

export async function apiUpdateQuestion(formData: FormData, id: string | number) {
	try {
		const data = encodeFormData(formData);
		await request.put(pathUtils.join(prefix, id), data, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		});
	} catch (error: any) {
		if (!error.response) throw new Error(error.message);
		const message = error.response.data.message;
		if (error.response.data.errors) return Promise.reject(error.response.data.errors);
		throw new Error(message);
	}
}

export async function apiDeleteQuestion(id: string | number) {
	try {
		await request.delete(pathUtils.join(prefix, id));
	} catch (error: any) {
		if (!error.response) throw new Error(error.message);
		const message = error.response.data.message;
		if (error.response.data.errors) return Promise.reject(error.response.data.errors);
		throw new Error(message);
	}
}
