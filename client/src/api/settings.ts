/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from 'axios';
import request from '../config/api';
import pathUtils from '../utils/pathUtils';

const prefix = 'settings';

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
export async function apiDownloadLogFile() {
	try {
		const res: AxiosResponse<Blob> = await request.get(pathUtils.join(prefix, 'log'), {
			responseType: 'blob'
		});
		const contentDisposition = res.headers['content-disposition'] as string | undefined;
		return { data: res.data, contentDisposition };
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
