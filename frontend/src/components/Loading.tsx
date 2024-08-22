import useLanguage from '@hooks/useLanguage';

import appStyles from '@styles/App.module.css';

export default function Loading() {
	const language = useLanguage('component.loading');
	return (
		<div className={appStyles['data-loading']}
			style={{ zIndex: 10 }}
		> {language?.text}
		</div >
	);
}
