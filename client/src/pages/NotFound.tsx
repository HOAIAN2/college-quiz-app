import { Link } from 'react-router-dom';
import useLanguage from '../hooks/useLanguage';
// import Footer from '../layouts/Footer';
import styles from '../styles/NotFound.module.css';

export default function NotFound() {
	const language = useLanguage('page.not_found');
	document.querySelector('.pre-load-container')?.classList.add('hide');
	return (
		<>
			<div className={styles['not-found']}>
				<div className={styles['title']}>404</div>
				<p style={{ fontSize: '16px', textAlign: 'center' }}>
					{language?.pageNotFound} <br />
					<Link to='/' className={styles['go-home']}>
						{language?.goBackHome}
					</Link>
				</p>
			</div>
			{/* <Footer /> */}
		</>
	);
}
