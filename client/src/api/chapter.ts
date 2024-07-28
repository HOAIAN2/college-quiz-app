/* eslint-disable @typescript-eslint/no-explicit-any */
import request from '../config/api';
import encodeFormData from '../utils/encodeFormData';
import pathUtils from '../utils/pathUtils';

const prefix = 'chapters';

export async function apiCreateChapter(formData: FormData) {
	try {
		await request.post(pathUtils.join(prefix), formData);
	} catch (error: any) {
		if (!error.response) throw new Error(error.message);
		const message = error.response.data.message;
		if (error.response.data.errors) return Promise.reject(error.response.data.errors);
		throw new Error(message);
	}
}

export async function apiUpdateChapter(formData: FormData, id: string | number) {
	try {
		const encodedData = encodeFormData(formData);
		await request.put(pathUtils.join(prefix, id), encodedData, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		});
	} catch (error: any) {
		if (!error.response) throw new Error(error.message);
		const message = error.response.data.message;
		if (error.response.data.errors) return Promise.reject(error.response.data.errors);
		throw new Error(message);
	}
}

export async function apiDeleteChapter(id: string | number) {
	try {
		await request.delete(pathUtils.join(prefix, id));
	} catch (error: any) {
		if (!error.response) throw new Error(error.message);
		const message = error.response.data.message;
		if (error.response.data.errors) return Promise.reject(error.response.data.errors);
		throw new Error(message);
	}
}
