/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from 'axios';
import request from '../config/api';
import { ExamDetail, ExamInMonth, ExamResult, ExamWithQuestion, QueryExamType } from '../models/exam';
import { ApiResponseWithData } from '../models/response';
import apiUtils from '../utils/apiUtils';
import encodeFormData from '../utils/encodeFormData';

const prefix = 'exams';

export async function apiGetExamsByMonth(query: QueryExamType) {
    try {
        const apiPath = prefix;
        const res = await request.get(apiPath, {
            params: {
                month: query.month,
                year: query.year
            }
        });
        const { data } = res.data as ApiResponseWithData<ExamInMonth[]>;
        return data;
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}

export async function apiGetExamById(id: string | number) {
    try {
        const apiPath = `${prefix}/${id}`;
        const res = await request.get(apiPath);
        const { data } = res.data as ApiResponseWithData<ExamDetail>;
        return data;
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}

export async function apiCreateExam(formData: FormData) {
    try {
        const apiPath = prefix;
        await request.post(apiPath, formData);
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}

export async function apiUpdateExam(formData: FormData, id: string | number) {
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

export async function apiDeleteExam(id: string | number) {
    try {
        const apiPath = `${prefix}/${id}`;
        await request.delete(apiPath);
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}

export async function apiUpdateExamStatus(status: 'start' | 'cancel', id: string | number) {
    const formData = new FormData();
    formData.append('status', status);
    try {
        const apiPath = `${prefix}/${id}/status`;
        await request.post(apiPath, formData);
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}

export async function apiGetTakeExam(id: string | number) {
    try {
        const apiPath = `${prefix}/${id}/take`;
        const res = await request.get(apiPath);
        const { data } = res.data as ApiResponseWithData<ExamWithQuestion>;
        return data;
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}

export async function apiSubmitExam(id: string | number, answers: number[], bypassKey?: string) {
    const formData = new FormData();
    if (bypassKey) formData.append('bypass_key', bypassKey);
    answers.forEach(answer => { formData.append('answers[]', String(answer)); });
    try {
        const apiPath = `${prefix}/${id}/submit`;
        const res = await request.post(apiPath, formData);
        const { data } = res.data as ApiResponseWithData<ExamResult>;
        return data;
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}

export async function apiExportExamResult(id: string | number, defaultFileName: string) {
    try {
        const apiPath = `${prefix}/${id}/export-result`;
        const res: AxiosResponse<Blob> = await request.get(apiPath, {
            responseType: 'blob'
        });
        const contentDisposition = res.headers['content-disposition'] as string | undefined;
        const fileName = apiUtils.getFileNameFromContentDisposition(contentDisposition, defaultFileName);
        return { data: res.data, fileName };
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}

export async function apiSyncExamAnswersCache(id: string | number, answers: number[]) {
    try {
        const apiPath = `${prefix}/${id}/sync-cache`;
        const formData = new FormData();
        answers.forEach(answer => {
            formData.append('answers[]', String(answer));
        });
        const res = await request.post(apiPath, formData);
        const { data } = res.data as ApiResponseWithData<number[] | null>;
        return data;
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}
