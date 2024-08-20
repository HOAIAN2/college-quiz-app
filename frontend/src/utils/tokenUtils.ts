import { TOKEN_KEY } from '../config/env';

const tokenUtils = {
	getToken() {
		return localStorage.getItem(TOKEN_KEY);
	},
	setToken(token: string) {
		localStorage.setItem(TOKEN_KEY, token);
	},
	removeToken() {
		localStorage.removeItem(TOKEN_KEY);
	}
};

export default Object.freeze(tokenUtils);
