import { APP_NAME } from '../config/env';
import useAppContext from '../hooks/useAppContext';
import styles from '../styles/Footer.module.css';
import languageUtils from '../utils/languageUtils';

export default function Footer() {
	const { appLanguage } = useAppContext();
	return (
		<footer className={styles['footer']}>
			<ul>
				<li>
					{`${APP_NAME} @ ${new Date().getFullYear()}`}
				</li>
				<li><a>Terms</a></li>
				<li><a>Privacy</a></li>
				<li><a>Security</a></li>
				<li><a>Status</a></li>
				<li><a>Docs</a></li>
				<li><a>Contact</a></li>
				<li><a>About</a></li>
				<li>
					<select value={appLanguage.language}
						onChange={(e) => {
							appLanguage.setLanguage(e.currentTarget.value);
							languageUtils.setLanguage(e.currentTarget.value);
						}}>
						<option value='en'>English</option>
						<option value='vi'>Tiếng Việt</option>
					</select>
				</li>
			</ul>
		</footer>
	);
}
