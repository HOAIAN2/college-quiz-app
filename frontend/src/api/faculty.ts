/* eslint-disable @typescript-eslint/no-explicit-any */
import apiUtils from '~utils/api-utils';
import request from '../config/api';
import { Faculty, FacultyDetail, QueryFacultyType } from '../models/faculty';
import { ApiResponseWithData, Pagination } from '../models/response';
import encodeFormData from '../utils/encode-form-data';

const prefix = 'faculties';

export async function apiAutoCompleteFaculty(search: string) {
    try {
        const apiPath = `${prefix}/complete`;
        const res = await request.get(apiPath, {
            params: {
                search: search
            }
        });
        const { data } = res.data as ApiResponseWithData<Faculty[]>;
        return data;
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}
export async function apiGetFaculties(query: QueryFacultyType) {
    const searchParams = apiUtils.objectToSearchParams(query);
    try {
        const apiPath = prefix;
        const res = await request.get(apiPath, {
            params: searchParams
        });
        const { data } = res.data as ApiResponseWithData<Pagination<FacultyDetail>>;
        return data;
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}
export async function apiCreateFaculty(formData: FormData) {
    try {
        const apiPath = prefix;
        await request.post(apiPath, formData);
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}
export async function apiUpdateFaculty(formData: FormData, id: string | number) {
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
export async function apiGetFacultyById(id: string | number) {
    try {
        const apiPath = `${prefix}/${id}`;
        const res = await request.get(apiPath);
        const { data } = res.data as ApiResponseWithData<FacultyDetail>;
        return data;
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}
export async function apiDeleteFacultiesByIds(ids: (string | number)[]) {
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
