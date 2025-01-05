/* eslint-disable @typescript-eslint/no-explicit-any */
import apiUtils from '~utils/apiUtils';
import request from '../config/api';
import { DashboarData } from '../models/dashboard';
import { ApiResponseWithData } from '../models/response';

const prefix = 'dashboard';

export async function apiGetDashboard() {
    try {
        const apiPath = prefix;
        const res = await request.get(apiPath);
        const { data } = res.data as ApiResponseWithData<DashboarData>;
        return data;
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}
