/* eslint-disable @typescript-eslint/no-explicit-any */
import request from '../config/api';
import { PersonalAccessToken } from '../models/auth';
import { ApiResponseWithData, LoginResponse } from '../models/response';
import pathUtils from '../utils/pathUtils';
import tokenUtils from '../utils/tokenUtils';

const prefix = 'auth';

export async function apiLogin(formData: FormData) {
	try {
		const res = await request.post(pathUtils.join(prefix, 'login'), formData);
		const { data } = res.data as ApiResponseWithData<LoginResponse>;
		if (data.token) tokenUtils.setToken(data.token);
		return data;
	} catch (error: any) {
		if (!error.response) throw new Error(error.message);
		const message = error.response.data;
		throw new Error(message.message);
	}
}
export async function apiChangePassword(formData: FormData) {
	try {
		await request.post(pathUtils.join(prefix, 'change-password'), formData);
		tokenUtils.removeToken();
	} catch (error: any) {
		if (!error.response) throw new Error(error.message);
		const message = error.response.data.message;
		throw new Error(message);
	}
}
export async function apiLogout() {
	try {
		await request.post(pathUtils.join(prefix, 'logout'), new FormData());
	} catch (error: any) {
		if (!error.response) throw new Error(error.message);
		const message = error.response.data.message;
		throw new Error(message);
	}
	finally {
		tokenUtils.removeToken();
	}
}
export async function apiSendEmailVerification(email: string) {
	const formData = new FormData();
	formData.append('email', email);
	try {
		await request.post(pathUtils.join(prefix, 'send-email-verification'), formData);
	} catch (error: any) {
		if (!error.response) throw new Error(error.message);
		const message = error.response.data.message;
		throw new Error(message);
	}
}
export async function apiVerifyEmail(email: string, verifyCode: string) {
	const formData = new FormData();
	formData.append('email', email);
	formData.append('verify_code', verifyCode);
	try {
		const res = await request.post(pathUtils.join(prefix, 'verify-email'), formData);
		const { data: { token } } = res.data as ApiResponseWithData<{ token: string; }>;
		tokenUtils.setToken(token);
	} catch (error: any) {
		if (!error.response) throw new Error(error.message);
		const message = error.response.data.message;
		throw new Error(message);
	}
}
export async function apiSendPasswordResetEmail(email: string) {
	const formData = new FormData();
	formData.append('email', email);
	try {
		await request.post(pathUtils.join(prefix, 'send-password-reset-email'), formData);
	} catch (error: any) {
		if (!error.response) throw new Error(error.message);
		const message = error.response.data.message;
		throw new Error(message);
	}
}
export async function apiVerifyPasswordResetCode(email: string, verifyCode: string) {
	const formData = new FormData();
	formData.append('email', email);
	formData.append('verify_code', verifyCode);
	try {
		await request.post(pathUtils.join(prefix, 'verify-password-reset-code'), formData);
	} catch (error: any) {
		if (!error.response) throw new Error(error.message);
		const message = error.response.data.message;
		throw new Error(message);
	}
}
export async function apiResetPassword(formData: FormData) {
	try {
		await request.post(pathUtils.join(prefix, 'reset-password'), formData);
	} catch (error: any) {
		if (!error.response) throw new Error(error.message);
		const message = error.response.data.message;
		throw new Error(message);
	}
}
export async function apiGetLoginSessions() {
	try {
		const res = await request.get(pathUtils.join(prefix, 'sessions'));
		const { data } = res.data as ApiResponseWithData<PersonalAccessToken[]>;
		return data;
	} catch (error: any) {
		if (!error.response) throw new Error(error.message);
		const message = error.response.data.message;
		throw new Error(message);
	}
}
export async function apiRevokeLoginSession(id: string | number) {
	try {
		await request.delete(pathUtils.join(prefix, 'sessions', id));
	} catch (error: any) {
		if (!error.response) throw new Error(error.message);
		const message = error.response.data.message;
		throw new Error(message);
	}
}
