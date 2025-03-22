import { LANG_KEY } from '../config/env';

const languagesSupported = [
    'vi',
    'en'
];

const divMod = (n: number, m: number): [number, number] => [Math.floor(n / m), n % m];

// const createDurationFormatter = (locale: string, unitDisplay: 'long' | 'short' | 'narrow' = 'long') => {
//     const timeUnitFormatter = (locale: string, unit: 'hour' | 'minute', unitDisplay: 'long' | 'short' | 'narrow') =>
//         new Intl.NumberFormat(locale, { style: 'unit', unit, unitDisplay }).format;

//     const fmtHours = timeUnitFormatter(locale, 'hour', unitDisplay);
//     const fmtMinutes = timeUnitFormatter(locale, 'minute', unitDisplay);
//     const fmtList = new Intl.ListFormat(locale, { style: 'long', type: 'conjunction' });

//     return (minutes: number): string => {
//         const [hrs, mins] = divMod(minutes, 60);
//         return fmtList.format(
//             [hrs ? fmtHours(hrs) : null, mins ? fmtMinutes(mins) : null]
//                 .filter((v): v is string => v !== null) // Type guard to remove `null`
//         );
//     };
// };

// const createDurationFormatter = (locale: string, unitDisplay: 'long' | 'short' | 'narrow' = 'long', separator: string = ' ') => {
//     const timeUnitFormatter = (unit: 'hour' | 'minute') => 
//         new Intl.NumberFormat(locale, { style: 'unit', unit, unitDisplay }).format;

//     const fmtHours = timeUnitFormatter('hour');
//     const fmtMinutes = timeUnitFormatter('minute');

//     return (minutes: number): string => {
//         const [hrs, mins] = divMod(minutes, 60);
//         return [hrs ? fmtHours(hrs) : null, mins ? fmtMinutes(mins) : null]
//             .filter((v): v is string => v !== null) // Type guard to remove `null`
//             .join(separator);
//     };
// };

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
    },
    createDurationFormatter(locale: string, unitDisplay: 'long' | 'short' | 'narrow' = 'long', separator: string = ' ') {
        const timeUnitFormatter = (unit: 'hour' | 'minute') =>
            new Intl.NumberFormat(locale, { style: 'unit', unit, unitDisplay }).format;

        const fmtHours = timeUnitFormatter('hour');
        const fmtMinutes = timeUnitFormatter('minute');

        return (minutes: number): string => {
            const [hrs, mins] = divMod(minutes, 60);
            return [hrs ? fmtHours(hrs) : null, mins ? fmtMinutes(mins) : null]
                .filter((v): v is string => v !== null)
                .join(separator);
        };
    }
};

export default Object.freeze(languageUtils);
