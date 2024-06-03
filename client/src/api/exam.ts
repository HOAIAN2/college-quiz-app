/* eslint-disable @typescript-eslint/no-explicit-any */
import request from '../config/api';
import { ExamDetail, ExamInMonth, ExamResult, ExamWithQuestion, QueryExamType } from '../models/exam';
import { ApiResponseWithData } from '../models/response';
import encodeFormData from '../utils/encodeFormData';
import pathUtils from '../utils/pathUtils';

const prefix = 'exam';

export async function apiGetExamsByMonth(query: QueryExamType) {
	try {
		const res = await request.get(pathUtils.join(prefix), {
			params: {
				month: query.month,
				year: query.year
			}
		});
		const { data } = res.data as ApiResponseWithData<ExamInMonth[]>;
		return data;
	} catch (error: any) {
		throw new Error(error.message);
	}
}

export async function apiGetExamById(id: string | number) {
	try {
		const res = await request.get(pathUtils.join(prefix, id));
		const { data } = res.data as ApiResponseWithData<ExamDetail>;
		return data;
	} catch (error: any) {
		throw new Error(error.message);
	}
}

export async function apiCreateExam(formData: FormData) {
	try {
		await request.post(pathUtils.join(prefix), formData);
	} catch (error: any) {
		if (!error.response) throw new Error(error.message);
		const message = error.response.data.message;
		if (error.response.data.errors) return Promise.reject(error.response.data.errors);
		throw new Error(message);
	}
}

export async function apiUpdateExam(formData: FormData, id: string | number) {
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

export async function apiDeleteExam(id: string | number) {
	try {
		await request.delete(pathUtils.join(prefix, id));
	} catch (error: any) {
		if (!error.response) throw new Error(error.message);
		const message = error.response.data.message;
		if (error.response.data.errors) return Promise.reject(error.response.data.errors);
		throw new Error(message);
	}
}

export async function apiUpdateExamStatus(status: 'start' | 'cancel', id: string | number) {
	const formData = new FormData();
	formData.append('status', status);
	try {
		await request.post(pathUtils.join(prefix, id, 'status'), formData);
	} catch (error: any) {
		if (!error.response) throw new Error(error.message);
		const message = error.response.data.message;
		if (error.response.data.errors) return Promise.reject(error.response.data.errors);
		throw new Error(message);
	}
}

export async function apiGetExamQuestions(id: string | number) {
	try {
		const res = await request.get(pathUtils.join(prefix, id, 'questions'));
		const { data } = res.data as ApiResponseWithData<ExamWithQuestion>;
		return data;
	} catch (error: any) {
		if (!error.response) throw new Error(error.message);
		const message = error.response.data.message;
		if (error.response.data.errors) return Promise.reject(error.response.data.errors);
		throw new Error(message);
	}
}

export async function apiSubmitExam(id: string | number, answers: number[], bypassKey?: string) {
	const formData = new FormData();
	if (bypassKey) formData.append('bypass_key', bypassKey);
	answers.forEach(answer => { formData.append('answers[]', String(answer)); });
	try {
		const res = await request.post(pathUtils.join(prefix, id, 'submit'), formData);
		const { data } = res.data as ApiResponseWithData<ExamResult>;
		return data;
	} catch (error: any) {
		if (!error.response) throw new Error(error.message);
		const message = error.response.data.message;
		if (error.response.data.errors) return Promise.reject(error.response.data.errors);
		throw new Error(message);
	}
}
