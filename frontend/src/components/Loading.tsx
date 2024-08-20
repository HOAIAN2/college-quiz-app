import appStyles from '../App.module.css';
import useLanguage from '../hooks/useLanguage';

export default function Loading() {
	const language = useLanguage('component.loading');
	return (
		<div className={appStyles['data-loading']}
			style={{ zIndex: 10 }}
		> {language?.text}
		</div >
	);
}
