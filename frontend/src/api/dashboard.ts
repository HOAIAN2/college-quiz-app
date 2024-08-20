/* eslint-disable @typescript-eslint/no-explicit-any */
import request from '../config/api';
import { DashboarData } from '../models/dashboard';
import { ApiResponseWithData } from '../models/response';
import pathUtils from '../utils/pathUtils';

const prefix = 'dashboard';

export async function apiGetDashboard() {
	try {
		const res = await request.get(pathUtils.join(prefix));
		const { data } = res.data as ApiResponseWithData<DashboarData>;
		return data;
	} catch (error: any) {
		if (!error.response) throw new Error(error.message);
		const message = error.response.data.message;
		throw new Error(message);
	}
}
