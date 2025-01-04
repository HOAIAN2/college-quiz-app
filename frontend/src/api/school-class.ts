/* eslint-disable @typescript-eslint/no-explicit-any */
import apiUtils from '~utils/apiUtils';
import request from '../config/api';
import { ApiResponseWithData, Pagination } from '../models/response';
import { QuerySchoolClassType, SchoolClass, SchoolClassDetail } from '../models/school-class';
import encodeFormData from '../utils/encodeFormData';
import pathUtils from '../utils/pathUtils';

const prefix = 'school-classes';

export async function apiAutoCompleteSchoolClass(search: string) {
    try {
        const res = await request.get(pathUtils.join(prefix, 'complete'), {
            params: {
                search: search
            }
        });
        const { data } = res.data as ApiResponseWithData<SchoolClass[]>;
        return data;
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}
export async function apiGetSchoolClasses(query?: QuerySchoolClassType) {
    try {
        const res = await request.get(pathUtils.join(prefix), {
            params: {
                page: query?.page || 1,
                per_page: query?.perPage || 10,
                search: query?.search
            }
        });
        const { data } = res.data as ApiResponseWithData<Pagination<SchoolClassDetail>>;
        return data;
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}
export async function apiGetSchoolClassById(id: string | number) {
    try {
        const res = await request.get(pathUtils.join(prefix, id));
        const { data } = res.data as ApiResponseWithData<SchoolClassDetail>;
        return data;
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}
export async function apiUpdateSchoolClass(formData: FormData, id: string | number) {
    try {
        const encodedData = encodeFormData(formData);
        await request.put(pathUtils.join(prefix, id), encodedData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}
export async function apiDeleteSchoolClassIds(ids: (string | number)[]) {
    try {
        await request.delete(pathUtils.join(prefix), {
            params: {
                ids: ids,
            }
        });
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}
export async function apiCreateSchoolClass(formData: FormData) {
    try {
        await request.post(pathUtils.join(prefix), formData);
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}
