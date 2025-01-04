/* eslint-disable @typescript-eslint/no-explicit-any */
import apiUtils from '~utils/apiUtils';
import request from '../config/api';
import { Faculty, FacultyDetail, QueryFacultyType } from '../models/faculty';
import { ApiResponseWithData, Pagination } from '../models/response';
import encodeFormData from '../utils/encodeFormData';
import pathUtils from '../utils/pathUtils';

const prefix = 'faculties';

export async function apiAutoCompleteFaculty(search: string) {
    try {
        const res = await request.get(pathUtils.join(prefix, 'complete'), {
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
export async function apiGetFaculties(query?: QueryFacultyType) {
    try {
        const res = await request.get(pathUtils.join(prefix), {
            params: {
                page: query?.page || 1,
                per_page: query?.perPage || 10,
                search: query?.search
            }
        });
        const { data } = res.data as ApiResponseWithData<Pagination<FacultyDetail>>;
        return data;
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}
export async function apiCreateFaculty(formData: FormData) {
    try {
        await request.post(pathUtils.join(prefix), formData);
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}
export async function apiUpdateFaculty(formData: FormData, id: string | number) {
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
export async function apiGetFacultyById(id: string | number) {
    try {
        const res = await request.get(pathUtils.join(prefix, id));
        const { data } = res.data as ApiResponseWithData<FacultyDetail>;
        return data;
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}
export async function apiDeleteFacultiesByIds(ids: (string | number)[]) {
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
