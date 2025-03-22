/* eslint-disable @typescript-eslint/no-explicit-any */
import apiUtils from '~utils/api-utils';
import request from '../config/api';
import { PersonalAccessToken } from '../models/auth';
import { ApiResponseWithData, LoginResponse } from '../models/response';
import tokenUtils from '../utils/token-utils';

const prefix = 'auth';

export async function apiLogin(formData: FormData) {
    try {
        const apiPath = `${prefix}/login`;
        const res = await request.post(apiPath, formData);
        const { data } = res.data as ApiResponseWithData<LoginResponse>;
        if (data.token) tokenUtils.setToken(data.token);
        return data;
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}
export async function apiChangePassword(formData: FormData) {
    try {
        const apiPath = `${prefix}/change-password`;
        await request.post(apiPath, formData);
        tokenUtils.removeToken();
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}
export async function apiLogout() {
    try {
        const apiPath = `${prefix}/logout`;
        await request.post(apiPath, new FormData());
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
    finally {
        tokenUtils.removeToken();
    }
}
export async function apiSendEmailVerification(email: string) {
    const formData = new FormData();
    formData.append('email', email);
    try {
        const apiPath = `${prefix}/send-email-verification`;
        await request.post(apiPath, formData);
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}
export async function apiVerifyEmail(email: string, verifyCode: string) {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('verify_code', verifyCode);
    try {
        const apiPath = `${prefix}/verify-email`;
        const res = await request.post(apiPath, formData);
        const { data: { token } } = res.data as ApiResponseWithData<{ token: string; }>;
        tokenUtils.setToken(token);
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}
export async function apiSendPasswordResetEmail(email: string) {
    const formData = new FormData();
    formData.append('email', email);
    try {
        const apiPath = `${prefix}/send-password-reset-email`;
        await request.post(apiPath, formData);
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}
export async function apiVerifyPasswordResetCode(email: string, verifyCode: string) {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('verify_code', verifyCode);
    try {
        const apiPath = `${prefix}/verify-password-reset-code`;
        await request.post(apiPath, formData);
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}
export async function apiResetPassword(formData: FormData) {
    try {
        const apiPath = `${prefix}/reset-password`;
        await request.post(apiPath, formData);
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}
export async function apiGetLoginSessions() {
    try {
        const apiPath = `${prefix}/sessions`;
        const res = await request.get(apiPath);
        const { data } = res.data as ApiResponseWithData<PersonalAccessToken[]>;
        return data;
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}
export async function apiRevokeLoginSession(id: string | number) {
    try {
        const apiPath = `${prefix}/sessions/${id}`;
        await request.delete(apiPath);
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}
