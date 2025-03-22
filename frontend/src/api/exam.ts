/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from 'axios';
import { ExamResult } from '~models/exam-result';
import { UserDetail } from '~models/user';
import request from '../config/api';
import { ExamDetail, ExamInMonth, ExamWithQuestion, QueryExamType } from '../models/exam';
import { ApiResponseWithData } from '../models/response';
import apiUtils from '../utils/api-utils';
import encodeFormData from '../utils/encode-form-data';

const prefix = 'exams';

export async function apiGetExamsByMonth(query: QueryExamType) {
    const searchParams = apiUtils.objectToSearchParams(query);
    try {
        const apiPath = prefix;
        const res = await request.get(apiPath, {
            params: searchParams
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

export async function apiGetExamResults(id: string | number) {
    try {
        const apiPath = `${prefix}/${id}/results`;
        const res = await request.get(apiPath);
        const { data } = res.data as ApiResponseWithData<{
            user: UserDetail;
            result: ExamResult | null;
        }[]>;
        return data;
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}

export async function apiSubmitExam(id: string | number, answers: number[]) {
    const formData = new FormData();
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
        const apiPath = `${prefix}/${id}/export-results`;
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
