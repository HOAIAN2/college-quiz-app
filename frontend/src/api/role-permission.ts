/* eslint-disable @typescript-eslint/no-explicit-any */
import apiUtils from '~utils/api-utils';
import request from '../config/api';
import {
    ApiResponseWithData,
    RolePermissionsResponse
} from '../models/response';
import { RoleWithPermissionCount } from '../models/role';

const prefix = 'role-permissions';

export async function apiGetRolePermissionCount() {
    try {
        const apiPath = prefix;
        const res = await request.get(apiPath);
        const { data } = res.data as ApiResponseWithData<RoleWithPermissionCount[]>;
        return data;
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}

export async function apiGetRolePermissions(id: number) {
    try {
        const apiPath = `${prefix}/${id}`;
        const res = await request.get(apiPath);
        const { data } = res.data as ApiResponseWithData<RolePermissionsResponse>;
        return data;
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}

export async function apiUpdateRolePermissions(id: number | string, permissionIds: (number | string)[]) {
    try {
        const encodedData = new URLSearchParams();
        permissionIds.forEach(item => {
            encodedData.append('ids[]', String(item));
        });
        const apiPath = `${prefix}/${id}`;
        await request.put(apiPath, encodedData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}
