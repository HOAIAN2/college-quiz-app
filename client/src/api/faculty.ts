/* eslint-disable @typescript-eslint/no-explicit-any */
import request from '../config/api';
import { Faculty, FacultyDetail, QueryFacultyType } from '../models/faculty';
import { ApiResponseWithData, Pagination } from '../models/response';
import encodeFormData from '../utils/encodeFormData';
import pathUtils from '../utils/pathUtils';

const prefix = 'faculty';

export async function apiAutoCompleteFaculty(search: string) {
	try {
		const res = await request.get(pathUtils.join(prefix, 'complete'), {
			params: {
				search: search
			}
		});
		const { data } = res.data as ApiResponseWithData<Faculty[]>;
		return data;
	} catch (error: any) {
		if (!error.response) throw new Error(error.message);
		const message = error.response.data.message;
		throw new Error(message);
	}
}
export async function apiGetFaculties(query?: QueryFacultyType) {
	try {
		const res = await request.get(pathUtils.join(prefix), {
			params: {
				page: query?.page || 1,
				per_page: query?.perPage || 10,
				search: query?.search
			}
		});
		const { data } = res.data as ApiResponseWithData<Pagination<FacultyDetail>>;
		return data;
	} catch (error: any) {
		throw new Error(error.message);
	}
}
export async function apiCreateFaculty(formData: FormData) {
	try {
		await request.post(pathUtils.join(prefix), formData);
	} catch (error: any) {
		if (!error.response) throw new Error(error.message);
		const message = error.response.data.message;
		if (error.response.data.errors) return Promise.reject(error.response.data.errors);
		throw new Error(message);
	}
}
export async function apiUpdateFaculty(formData: FormData, id: string | number) {
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
export async function apiGetFacultyById(id: string | number) {
	try {
		const res = await request.get(pathUtils.join(prefix, id));
		const { data } = res.data as ApiResponseWithData<FacultyDetail>;
		return data;
	} catch (error: any) {
		throw new Error(error.message);
	}
}
export async function apiDeleteFacultiesByIds(ids: (string | number)[]) {
	try {
		await request.delete(pathUtils.join(prefix), {
			params: {
				ids: ids,
			}
		});
	} catch (error: any) {
		throw new Error(error.message);
	}
}
