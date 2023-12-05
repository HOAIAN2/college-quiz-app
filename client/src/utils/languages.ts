const languagesSupported = [
    'vi',
    'en'
]

export function getLanguage() {
    const localLanguage = localStorage.getItem('lang') as string
    if (languagesSupported.includes(localLanguage)) return localLanguage
    const language = navigator.language.includes('en') ? 'en' : navigator.language
    if (languagesSupported.includes(language)) return language
    return 'en'
}