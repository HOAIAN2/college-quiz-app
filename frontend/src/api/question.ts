/* eslint-disable @typescript-eslint/no-explicit-any */
import apiUtils from '~utils/apiUtils';
import request from '../config/api';
import { QueryQuestionType, Question, QuestionDetail } from '../models/question';
import { ApiResponseWithData } from '../models/response';
import encodeFormData from '../utils/encodeFormData';

const prefix = 'questions';

export async function apiGetQuestions(query: QueryQuestionType) {
    const searchParams = apiUtils.objectToSearchParams(query);
    try {
        const apiPath = prefix;
        const res = await request.get(apiPath, {
            params: searchParams
        });
        const { data } = res.data as ApiResponseWithData<Question[]>;
        return data;
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}

export async function apiCreateQuestion(formData: FormData) {
    try {
        const apiPath = prefix;
        await request.post(apiPath, formData);
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}

export async function apiGetQuestionById(id: string | number) {
    try {
        const apiPath = `${prefix}/${id}`;
        const res = await request.get(apiPath);
        const { data } = res.data as ApiResponseWithData<QuestionDetail>;
        return data;
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}

export async function apiUpdateQuestion(formData: FormData, id: string | number) {
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

export async function apiDeleteQuestion(id: string | number) {
    try {
        const apiPath = `${prefix}/${id}`;
        await request.delete(apiPath);
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}

export async function apiImportQuestions(formData: FormData) {
    try {
        const apiPath = `${prefix}/import`;
        await request.post(apiPath, formData);
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}
