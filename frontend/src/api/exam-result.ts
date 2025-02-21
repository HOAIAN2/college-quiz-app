/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExamResult, ExamResultWithAnswers } from '~models/exam-result';
import apiUtils from '~utils/apiUtils';
import request from '../config/api';
import { ApiResponseWithData } from '../models/response';

const prefix = 'exam-results';

export async function apiGetExamResult(id: string | number) {
    try {
        const apiPath = `${prefix}/${id}`;
        const res = await request.get(apiPath);
        const { data } = res.data as ApiResponseWithData<ExamResultWithAnswers>;
        return data;
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}

export async function apiRemarkExamResult(id: string | number, formData: FormData) {
    try {
        const apiPath = `${prefix}/${id}/remark`;
        await request.post(apiPath, formData);
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}

export async function apiCacelExamResult(id: string | number, formData: FormData) {
    try {
        const apiPath = `${prefix}/${id}/cancel`;
        await request.post(apiPath, formData);
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}

export async function apiGetResultsByUser(id: string | number) {
    try {
        const apiPath = `${prefix}/user/${id}`;
        const res = await request.get(apiPath);
        const { data } = res.data as ApiResponseWithData<ExamResult[]>;
        return data;
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}
