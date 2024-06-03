/* eslint-disable @typescript-eslint/no-explicit-any */
import request from '../config/api';
import { ApiResponseWithData, LoginResponse } from '../models/response';
import pathUtils from '../utils/pathUtils';
import tokenUtils from '../utils/tokenUtils';

const prefix = 'auth';

export async function apiLogin(form: FormData) {
	try {
		const res = await request.post(pathUtils.join(prefix, 'login'), form);
		const { data } = res.data as ApiResponseWithData<LoginResponse>;
		tokenUtils.setToken(data.token);
		return data.user;
	} catch (error: any) {
		if (!error.response) throw new Error(error.message);
		const message = error.response.data;
		throw new Error(message.message);
	}
}
export async function apiChangePassword(form: FormData) {
	try {
		await request.post(pathUtils.join(prefix, 'change-password'), form);
		tokenUtils.removeToken();
	} catch (error: any) {
		if (!error.response) throw new Error(error.message);
		const message = error.response.data.message;
		throw new Error(message);
	}
}
export async function apiLogout() {
	try {
		await request.post(pathUtils.join(prefix, 'logout'));
		tokenUtils.removeToken();
	} catch (error: any) {
		tokenUtils.removeToken();
		if (!error.response) throw new Error(error.message);
		const message = error.response.data.message;
		throw new Error(message);
	}
}
