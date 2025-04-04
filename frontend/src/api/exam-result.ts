/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from 'axios';
import { ExamResultWithAnswers, ExamResultWithExam, QueryExamResultsByUser } from '~models/exam-result';
import apiUtils from '~utils/api-utils';
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

export async function apiGetExamResultsByUser(id: string | number, query: QueryExamResultsByUser) {
    const searchParams = apiUtils.objectToSearchParams(query);
    try {
        const apiPath = `${prefix}/user/${id}`;
        const res = await request.get(apiPath, {
            params: searchParams
        });
        const { data } = res.data as ApiResponseWithData<ExamResultWithExam[]>;
        return data;
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}

export async function apiExportExamResultsByUser(id: string | number, defaultFileName: string, query: QueryExamResultsByUser) {
    const searchParams = apiUtils.objectToSearchParams(query);
    try {
        const apiPath = `${prefix}/user/${id}/export`;
        const res: AxiosResponse<Blob> = await request.get(apiPath, {
            params: searchParams,
            responseType: 'blob'
        });
        const contentDisposition = res.headers['content-disposition'] as string | undefined;
        const fileName = apiUtils.getFileNameFromContentDisposition(contentDisposition, defaultFileName);
        return { data: res.data, fileName };
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}
