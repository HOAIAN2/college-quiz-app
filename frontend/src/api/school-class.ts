/* eslint-disable @typescript-eslint/no-explicit-any */
import apiUtils from '~utils/apiUtils';
import request from '../config/api';
import { ApiResponseWithData, Pagination } from '../models/response';
import { QuerySchoolClassType, SchoolClass, SchoolClassDetail } from '../models/school-class';
import encodeFormData from '../utils/encodeFormData';

const prefix = 'school-classes';

export async function apiAutoCompleteSchoolClass(search: string) {
    try {
        const apiPath = `${prefix}/complete`;
        const res = await request.get(apiPath, {
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
export async function apiGetSchoolClasses(query: QuerySchoolClassType) {
    const searchParams = apiUtils.objectToSearchParams(query);
    try {
        const apiPath = prefix;
        const res = await request.get(apiPath, {
            params: searchParams
        });
        const { data } = res.data as ApiResponseWithData<Pagination<SchoolClassDetail>>;
        return data;
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}
export async function apiGetSchoolClassById(id: string | number) {
    try {
        const apiPath = `${prefix}/${id}`;
        const res = await request.get(apiPath);
        const { data } = res.data as ApiResponseWithData<SchoolClassDetail>;
        return data;
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}
export async function apiUpdateSchoolClass(formData: FormData, id: string | number) {
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
export async function apiDeleteSchoolClassIds(ids: (string | number)[]) {
    try {
        const apiPath = prefix;
        await request.delete(apiPath, {
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
        const apiPath = prefix;
        await request.post(apiPath, formData);
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}
