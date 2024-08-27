import styles from './styles/NotFound.module.css';

import useLanguage from '~hooks/useLanguage';

export default function NotFound() {
	const language = useLanguage('page.not_found');
	document.querySelector('.pre-load-container')?.classList.add('hide');
	return (
		<>
			<div className={styles['not-found']}>
				<div className={styles['title']}>404</div>
				<p style={{ fontSize: '16px', textAlign: 'center' }}>
					{language?.pageNotFound} <br />
					<a href="/" className={styles['go-home']}>
						{language?.goBackHome}
					</a>
				</p>
			</div>
		</>
	);
}
