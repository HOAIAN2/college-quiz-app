import { LANG_KEY } from '../config/env'

const languagesSupported = [
    'vi',
    'en'
]

const languageUtils = {
    getLanguage() {
        const localLanguage = localStorage.getItem(LANG_KEY) as string
        if (languagesSupported.includes(localLanguage)) return localLanguage
        const language = navigator.language.includes('en') ? 'en' : navigator.language
        if (languagesSupported.includes(language)) return language
        return 'en'
    },
    setLanguage(value: string) {
        localStorage.setItem(LANG_KEY, value)
    }
}

export default languageUtils