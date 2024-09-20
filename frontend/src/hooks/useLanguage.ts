import { useEffect, useState } from 'react';
import { Language } from '../models/language';
import useAppContext from './useAppContext';

const languageCache = new Map<string, Language[keyof Language]>();

export default function useLanguage<K extends keyof Language>(langFile: K) {
    const { appLanguage } = useAppContext();
    const cacheKey = `${appLanguage.language}_${langFile}`;

    const [language, setLanguage] = useState<Language[K] | undefined>(
        () => languageCache.get(cacheKey) as Language[K] | undefined
    );
    useEffect(() => {
        if (languageCache.has(cacheKey)) {
            setLanguage(languageCache.get(cacheKey) as Language[K]);
            return;
        }
        import(`../../assets/langs/${appLanguage.language}/${langFile}.ts`)
            .then((data) => {
                setLanguage(data.default);
                languageCache.set(cacheKey, data.default);
            });
    }, [appLanguage.language, cacheKey, langFile, language]);
    return language;
}
