/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from 'axios';
import { ApiResponseWithData } from '~models/response';
import request from '../config/api';
import apiUtils from '../utils/apiUtils';
import pathUtils from '../utils/pathUtils';

const prefix = 'settings';

export async function apiGetCallableCommands() {
    try {
        const res = await request.get(pathUtils.join(prefix, 'commands'));
        const { data } = res.data as ApiResponseWithData<string[]>;
        return data;
    } catch (error: any) {
        if (!error.response) throw new Error(error.message);
        const message = error.response.data.message;
        if (error.response.data.errors) return Promise.reject(error.response.data.errors);
        throw new Error(message);
    }
}
export async function apiRunArtisan(command: string) {
    const formData = new FormData();
    formData.set('command', command);
    try {
        await request.post(pathUtils.join(prefix, 'run-artisan'), formData);
    } catch (error: any) {
        if (!error.response) throw new Error(error.message);
        const message = error.response.data.message;
        if (error.response.data.errors) return Promise.reject(error.response.data.errors);
        throw new Error(message);
    }
}
export async function apiDownloadLogFile(defaultFileName: string) {
    try {
        const res: AxiosResponse<Blob> = await request.get(pathUtils.join(prefix, 'log'), {
            responseType: 'blob'
        });
        const contentDisposition = res.headers['content-disposition'] as string | undefined;
        const fileName = apiUtils.getFileNameFromContentDisposition(contentDisposition, defaultFileName);
        return { data: res.data, fileName };
    } catch (error: any) {
        if (!error.response) throw new Error(error.message);
        const message = error.response.data.message;
        if (error.response.data.errors) return Promise.reject(error.response.data.errors);
        throw new Error(message);
    }
}
export async function apiDeleteLogFile() {
    try {
        await request.delete(pathUtils.join(prefix, 'log'));
    } catch (error: any) {
        if (!error.response) throw new Error(error.message);
        const message = error.response.data.message;
        if (error.response.data.errors) return Promise.reject(error.response.data.errors);
        throw new Error(message);
    }
}
