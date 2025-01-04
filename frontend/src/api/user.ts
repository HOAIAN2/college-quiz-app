/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from 'axios';
import request from '../config/api';
import { ApiResponseWithData, ExportableResponse, Pagination } from '../models/response';
import { RoleName } from '../models/role';
import {
    ExportQueryUserType,
    QueryUserType,
    User,
    UserDetail,
    UserWithPermissions
} from '../models/user';
import apiUtils from '../utils/apiUtils';
import encodeFormData from '../utils/encodeFormData';
import pathUtils from '../utils/pathUtils';
import tokenUtils from '../utils/tokenUtils';

const prefix = 'users';

export async function apiGetUser() {
    if (!tokenUtils.getToken()) throw new Error('no token');
    try {
        const res = await request.get(pathUtils.join(prefix));
        const { data } = res.data as ApiResponseWithData<UserWithPermissions>;
        return data;
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}

export async function apiCreateUser(formData: FormData) {
    try {
        await request.post(pathUtils.join(prefix), formData);
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}

export async function apiUpdateUser(formData: FormData, id: string | number) {
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

export async function apiImportUsers(file: File, role: RoleName) {
    const formData = new FormData();
    formData.append('role', role);
    formData.append('file', file);
    try {
        await request.post(pathUtils.join(prefix, 'import'), formData);
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}

export async function apiGetUsersByType(query: QueryUserType) {
    try {
        const res = await request.get(pathUtils.join(prefix, 'query'), {
            params: {
                role: query.role,
                page: query.page || 1,
                per_page: query.perPage || 10,
                search: query.search,
                faculty_id: query.facultyId,
                school_class_id: query.schoolClassId
            }
        });
        const { data } = res.data as ApiResponseWithData<Pagination<UserDetail>>;
        return data;
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}

export async function apiGetUserById(id: string | number) {
    try {
        const res = await request.get(pathUtils.join(prefix, id));
        const { data } = res.data as ApiResponseWithData<UserDetail>;
        return data;
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}

export async function apiDeleteUserByIds(ids: (string | number)[]) {
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

export async function apiGetUserExportableFields(role: RoleName) {
    try {
        const res = await request.get(pathUtils.join(prefix, '/exportable'), {
            params: {
                role: role,
            },
        });
        const { data } = res.data as AxiosResponse<ExportableResponse[]>;
        return data;
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}

export async function apiExportUsers(query: ExportQueryUserType, defaultFileName: string) {
    try {
        const res: AxiosResponse<Blob> = await request.get(pathUtils.join(prefix, 'export'), {
            params: {
                role: query.role,
                fields: query.fields,
                search: query.search,
                faculty_id: query.facultyId,
                school_class_id: query.schoolClassId
            },
            responseType: 'blob'
        });
        const contentDisposition = res.headers['content-disposition'] as string | undefined;
        const fileName = apiUtils.getFileNameFromContentDisposition(contentDisposition, defaultFileName);
        return { data: res.data, fileName };
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}

export async function apiAutoCompleteUser(role: RoleName, search: string) {
    try {
        const res = await request.get(pathUtils.join(prefix, 'complete'), {
            params: {
                role: role,
                search: search
            }
        });
        const { data } = res.data as ApiResponseWithData<User[]>;
        return data;
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}

export async function apiGetAllUser(role: RoleName, search?: string) {
    try {
        const res = await request.get(pathUtils.join(prefix, 'all-user'), {
            params: {
                search: search,
                role: role
            }
        });
        const { data } = res.data as ApiResponseWithData<UserDetail[]>;
        return data;
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}
