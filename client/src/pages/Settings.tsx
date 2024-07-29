import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import appStyles from '../App.module.css';
import useLanguage from '../hooks/useLanguage';
import styles from '../styles/Settings.module.css';
import css from '../utils/css';

export default function Settings() {
	const language = useLanguage('page.settings');
	const { name } = useParams();
	const navigate = useNavigate();
	const settings = [
		{
			to: 'system',
			name: language?.system
		},
		{
			to: 'demo',
			name: 'Demo'
		},
		{
			to: 'demo1',
			name: 'Demo1'
		},
		{
			to: 'demo2',
			name: 'Demo2'
		},
	];
	useEffect(() => {
		if (!settings.find(setting => setting.to === name)) {
			navigate(settings[0].to);
		}
	});
	return (
		<main className={css(appStyles['dashboard-d'], styles['page-content'])}>
			<section className={styles['nav-bar']}>
				<ul>
					<h2 style={{ marginLeft: 10 }}>{language?.settings}</h2>
					{
						settings.map(setting => {
							return (
								<li key={`settings-${setting.to}`}
									className={
										css(
											styles['list-item'],
											setting.to === window.location.pathname.split('/')[2] ? styles['current'] : ''
										)
									}
								>
									<Link to={setting.to}>{setting.name}</Link>
								</li>
							);
						})
					}
				</ul>
			</section>
			<section className={styles['setting-content']}>
				<SettingsContent name={name!} />
			</section>
		</main>
	);
}

function SettingsContent({ name }: { name: string; }) {
	if (name === 'system') return (
		<>
			<article className={styles['article']}>
				<h2>Run Artisan command</h2>
				<p>Call run artisan command route in App</p>
				<label>Command</label>
				<input
					className={css(appStyles['input-d'], styles['input-item'])}
					placeholder='schedule:run'
				/>
				<button style={{ height: 40, width: 80 }} className={appStyles['action-item-d']}>Send</button>
			</article>
			<article className={styles['article']}>
				<h2>Log file</h2>
				<p>Comunicate with storage/logs/laravel.log file</p>
				<button style={{ height: 40, width: 80 }} className={appStyles['action-item-d']}>Download</button>
				<button style={{ height: 40, width: 80 }} className={appStyles['action-item-white-border-red-d']}>Delete</button>
			</article>
		</>
	);
	return null;
}
