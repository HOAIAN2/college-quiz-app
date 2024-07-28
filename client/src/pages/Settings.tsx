import appStyles from '../App.module.css';
import styles from '../styles/Settings.module.css';
import css from '../utils/css';

export default function Settings() {
	return (
		<main className={css(appStyles['dashboard-d'], styles['page-content'])}>
			<h2>Settings</h2>
		</main>
	);
}
