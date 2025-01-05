/* eslint-disable @typescript-eslint/no-explicit-any */
import apiUtils from '~utils/apiUtils';
import request from '../config/api';
import { ApiResponseWithData } from '../models/response';
import { Semester } from '../models/semester';
import encodeFormData from '../utils/encodeFormData';

const prefix = 'semesters';

export async function apiGetSemesters(query: string) {
    try {
        const apiPath = prefix;
        const res = await request.get(apiPath, {
            params: {
                search: query
            }
        });
        const { data } = res.data as ApiResponseWithData<Semester[]>;
        return data;
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}

export async function apiGetSemesterById(id: string | number) {
    try {
        const apiPath = `${prefix}/${id}`;
        const res = await request.get(apiPath);
        const { data } = res.data as ApiResponseWithData<Semester>;
        return data;
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}

export async function apiCreateSemester(formData: FormData) {
    try {
        const apiPath = prefix;
        await request.post(apiPath, formData);
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}

export async function apiUpdateSemester(formData: FormData, id: string | number) {
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

export async function apiDeleteSemester(id: string | number) {
    try {
        const apiPath = `${prefix}/${id}`;
        await request.delete(apiPath);
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}

export async function apiAutoCompleteSemester(search: string) {
    try {
        const apiPath = `${prefix}/complete`;
        const res = await request.get(apiPath, {
            params: {
                search: search
            }
        });
        const { data } = res.data as ApiResponseWithData<Semester[]>;
        return data;
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}
