import { Link } from 'react-router-dom';
import appStyles from '../App.module.css';
import Footer from '../components/Footer';
import useLanguage from '../hooks/useLanguage';
import styles from '../styles/NotFound.module.css';
import css from '../utils/css';

export default function NotFound() {
	const language = useLanguage('page.not_found');
	document.querySelector('.pre-load-container')?.classList.add('hide');
	return (
		<>
			<div className={styles['not-found']}>
				<div className={styles['title']}>404</div>
				<Link to='/' className={css(appStyles['action-item-d'], styles['go-home'])
				}>{language?.home}</Link>
			</div>
			<Footer />
		</>
	);
}
