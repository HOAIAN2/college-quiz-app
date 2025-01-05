/* eslint-disable @typescript-eslint/no-explicit-any */
import apiUtils from '~utils/apiUtils';
import request from '../config/api';
import { ApiResponseWithData } from '../models/response';
import { Subject, SubjectDetail } from '../models/subject';
import encodeFormData from '../utils/encodeFormData';

const prefix = 'subjects';

export async function apiGetSubjects(query: string) {
    try {
        const apiPath = prefix;
        const res = await request.get(apiPath, {
            params: {
                search: query
            }
        });
        const { data } = res.data as ApiResponseWithData<Subject[]>;
        return data;
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}

export async function apiGetSubjectById(id: string | number) {
    try {
        const apiPath = `${prefix}/${id}`;
        const res = await request.get(apiPath);
        const { data } = res.data as ApiResponseWithData<SubjectDetail>;
        return data;
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}

export async function apiCreateSubject(formData: FormData) {
    try {
        const apiPath = prefix;
        await request.post(apiPath, formData);
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}

export async function apiUpdateSubject(formData: FormData, id: string | number) {
    try {
        const apiPath = `${prefix}/${id}`;
        const data = encodeFormData(formData);
        await request.put(apiPath, data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}

export async function apiDeleteSubject(id: string | number) {
    try {
        const apiPath = `${prefix}/${id}`;
        await request.delete(apiPath);
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}

export async function apiAutoCompleteSubject(search: string) {
    try {
        const apiPath = `${prefix}/complete`;
        const res = await request.get(apiPath, {
            params: {
                search: search
            }
        });
        const { data } = res.data as ApiResponseWithData<Subject[]>;
        return data;
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}
