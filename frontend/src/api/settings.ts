/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from 'axios';
import { ApiResponseWithData } from '~models/response';
import { Setting } from '~models/setting';
import request from '../config/api';
import apiUtils from '../utils/apiUtils';

const prefix = 'settings';

export async function apiGetAllSettings() {
    try {
        const apiPath = prefix;
        const res = await request.get(apiPath);
        const { data } = res.data as ApiResponseWithData<Setting[]>;
        return data;
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}
export async function apiUpdateSettings(formData: FormData) {
    try {
        const apiPath = prefix;
        await request.post(apiPath, formData);
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}
export async function apiGetCallableCommands() {
    try {
        const apiPath = `${prefix}/commands`;
        const res = await request.get(apiPath);
        const { data } = res.data as ApiResponseWithData<string[]>;
        return data;
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}
export async function apiRunArtisan(command: string) {
    const formData = new FormData();
    formData.set('command', command);
    try {
        const apiPath = `${prefix}/run-artisan`;
        await request.post(apiPath, formData);
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}
export async function apiDownloadLogFile(defaultFileName: string) {
    try {
        const apiPath = `${prefix}/log`;
        const res: AxiosResponse<Blob> = await request.get(apiPath, {
            responseType: 'blob'
        });
        const contentDisposition = res.headers['content-disposition'] as string | undefined;
        const fileName = apiUtils.getFileNameFromContentDisposition(contentDisposition, defaultFileName);
        return { data: res.data, fileName };
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}
export async function apiDeleteLogFile() {
    try {
        const apiPath = `${prefix}/log`;
        await request.delete(apiPath);
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}
