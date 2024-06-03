import { useEffect, useState } from 'react';
import { Language } from '../models/language';
import useAppContext from './useAppContext';

export default function useLanguage<K extends keyof Language>(langFile: K) {
	const { appLanguage } = useAppContext();
	const [language, setLanguage] = useState<Language[K] | undefined>();
	useEffect(() => {
		import(`../../assets/langs/${appLanguage.language}/${langFile}.ts`)
			.then((data) => {
				setLanguage(data.default);
			});
	}, [appLanguage.language, langFile]);
	return language;
}
