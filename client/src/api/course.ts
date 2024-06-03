/* eslint-disable @typescript-eslint/no-explicit-any */
import request from '../config/api';
import { Course, CourseDetail, QueryCourseType } from '../models/course';
import { ApiResponseWithData } from '../models/response';
import encodeFormData from '../utils/encodeFormData';
import pathUtils from '../utils/pathUtils';

const prefix = 'course';

export async function apiGetCourses(query: QueryCourseType) {
	try {
		const res = await request.get(pathUtils.join(prefix), {
			params: {
				search: query.search,
				semester_id: query.semesterId
			}
		});
		const { data } = res.data as ApiResponseWithData<Course[]>;
		return data;
	} catch (error: any) {
		throw new Error(error.message);
	}
}

export async function apiGetCourseById(id: string | number) {
	try {
		const res = await request.get(pathUtils.join(prefix, id));
		const { data } = res.data as ApiResponseWithData<CourseDetail>;
		return data;
	} catch (error: any) {
		throw new Error(error.message);
	}
}

export async function apiCreateCourse(formData: FormData) {
	try {
		await request.post(pathUtils.join(prefix), formData);
	} catch (error: any) {
		if (!error.response) throw new Error(error.message);
		const message = error.response.data.message;
		if (error.response.data.errors) return Promise.reject(error.response.data.errors);
		throw new Error(message);
	}
}

export async function apiUpdateCourse(formData: FormData, id: string | number) {
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

export async function apiDeleteCourse(id: string | number) {
	try {
		await request.delete(pathUtils.join(prefix, id));
	} catch (error: any) {
		if (!error.response) throw new Error(error.message);
		const message = error.response.data.message;
		if (error.response.data.errors) return Promise.reject(error.response.data.errors);
		throw new Error(message);
	}
}

export async function apiUpdateCourseStudents(studentIds: (string | number)[], id: string | number) {
	try {
		const data = new URLSearchParams();
		studentIds.forEach(item => {
			data.append('student_ids[]', String(item));
		});
		await request.put(pathUtils.join(prefix, id, 'students'), data, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		});
	} catch (error: any) {
		throw new Error(error.message);
	}
}
