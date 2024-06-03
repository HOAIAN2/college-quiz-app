import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'sonner';
import languageUtils from '../utils/languageUtils';
import tokenUtils from '../utils/tokenUtils';
import { API_HOST, OVERRIDE_HTTP_METHOD } from './env';

const ignoreLoaders: string[] = [];

const request = axios.create({
	baseURL: API_HOST + '/api/',
	adapter: ['fetch', 'xhr', 'http']
});

request.interceptors.request.use(config => {
	config.headers['Accept-Language'] = languageUtils.getLanguage();
	const token = tokenUtils.getToken();
	if (config.method === 'get' && !ignoreLoaders.includes(config.url || '')) {
		config.onDownloadProgress = (progressEvent) => {
			const loaderElement = document.querySelector<HTMLDivElement>('#loader');
			if (progressEvent.progress && loaderElement) {
				const percent = 100 * progressEvent.progress;
				if (percent !== 100) requestAnimationFrame(() => { loaderElement.style.width = `${percent}%`; });
				else requestAnimationFrame(() => { loaderElement.style.width = '0%'; });
			}
		};
	}
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	if (OVERRIDE_HTTP_METHOD) {
		if (config.method !== 'get' && config.method !== 'post') {
			const override = config.method?.toUpperCase() as string;
			config.data = config.data || new FormData();
			if (config.data instanceof FormData) {
				config.data.append('_method', override);
			} else if (typeof config.data === 'object' && !(config.data instanceof URLSearchParams)) {
				config.data = config.data || {};
				config.data._method = config.method;
			} else if (config.data instanceof URLSearchParams) {
				config.data.append('_method', override);
			}
			config.method = 'post';
		}
	}
	if (!config.headers['Content-Type']) config.headers['Content-Type'] = 'multipart/form-data';
	return config;
});

request.interceptors.response.use(
	function (response) {
		if (response.data && response.headers['content-type'] === 'application/json')
			if (response.data.message && response.data.status === 'success') toast.success(response.data.message);
		return response;
	},
	function (error: AxiosError) {
		if (error.response?.status === 401) {
			if (tokenUtils.getToken()) {
				tokenUtils.removeToken();
				const cleanUrl = window.location.href.split('?')[0];
				window.location.href = cleanUrl;
				return Promise.reject(error);
			}
			return Promise.reject(error);
		}
		if (error.code?.startsWith('ERR_NETWORK')) {
			toast.error(error.message);
			return Promise.reject(error);
		}
		const response = error.response as AxiosResponse;
		if (response.data && response.headers['content-type'] === 'application/json') {
			if (response.data.message) toast.error(response.data.message);
		}
		return Promise.reject(error);
	}
);

export default request;
