/* eslint-disable @typescript-eslint/no-explicit-any */
import apiUtils from '~utils/apiUtils';
import request from '../config/api';
import { Course, CourseDetail, QueryCourseType } from '../models/course';
import { ApiResponseWithData } from '../models/response';
import encodeFormData from '../utils/encodeFormData';

const prefix = 'courses';

export async function apiGetCourses(query: QueryCourseType) {
    try {
        const apiPath = prefix;
        const res = await request.get(apiPath, {
            params: {
                search: query.search,
                semester_id: query.semesterId
            }
        });
        const { data } = res.data as ApiResponseWithData<Course[]>;
        return data;
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}

export async function apiGetCourseById(id: string | number) {
    try {
        const apiPath = `${prefix}/${id}`;
        const res = await request.get(apiPath);
        const { data } = res.data as ApiResponseWithData<CourseDetail>;
        return data;
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}

export async function apiCreateCourse(formData: FormData) {
    try {
        const apiPath = prefix;
        await request.post(apiPath, formData);
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}

export async function apiUpdateCourse(formData: FormData, id: string | number) {
    try {
        const apiPath = `${prefix}/${id}`;
        const encodedData = encodeFormData(formData);
        await request.put(apiPath, encodedData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}

export async function apiDeleteCourse(id: string | number) {
    try {
        const apiPath = `${prefix}/${id}`;
        await request.delete(apiPath);
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}

export async function apiUpdateCourseStudents(studentIds: (string | number)[], id: string | number) {
    try {
        const apiPath = `${prefix}/${id}/students`;
        const encodedData = new URLSearchParams();
        studentIds.forEach(item => {
            encodedData.append('student_ids[]', String(item));
        });
        await request.put(apiPath, encodedData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}
