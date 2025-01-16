/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExamDetail, ExamResultWithAnswers } from '~models/exam-result';
import apiUtils from '~utils/apiUtils';
import request from '../config/api';
import { ApiResponseWithData } from '../models/response';

const prefix = 'exam-results';

export async function apiGetExamResults(examId: string | number) {
    try {
        const apiPath = prefix;
        const res = await request.get(apiPath, {
            params: {
                exam_id: examId
            }
        });
        const { data } = res.data as ApiResponseWithData<ExamDetail>;
        return data;
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}

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
