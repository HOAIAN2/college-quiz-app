import { LANG_KEY } from '../config/env';

const languagesSupported = [
	'vi',
	'en'
];

const languageUtils = {
	languageCodeName: languagesSupported.map(item => {
		return {
			value: item,
			label: new Intl.DisplayNames([item], {
				type: 'language'
			}).of(item)
		};
	}),
	getLanguage() {
		const localLanguage = localStorage.getItem(LANG_KEY) as string;
		if (languagesSupported.includes(localLanguage)) return localLanguage;
		const language = navigator.language.includes('en') ? 'en' : navigator.language;
		if (languagesSupported.includes(language)) return language;
		return 'en';
	},
	setLanguage(value: string) {
		localStorage.setItem(LANG_KEY, value);
	},
	getFullName(firstName?: string, lastName?: string) {
		if (this.getLanguage() === 'vi') return [lastName, firstName].join(' ');
		return [firstName, lastName].join(' ');
	},
	getLetterFromIndex(index: number) {
		let letters = '';
		while (index >= 0) {
			letters = String.fromCharCode((index % 26) + 65) + letters;
			index = Math.floor(index / 26) - 1;
		}
		return letters;
	},
	getShortHand(content: string) {
		return content.split(' ').map(item => {
			if (!item) return undefined;
			return item.trim()[0].toUpperCase();
		}).join('').replace(/Đ/g, 'D').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
	}
};

export default Object.freeze(languageUtils);
