import { useEffect } from 'react';
import { HiOutlineWrenchScrewdriver } from 'react-icons/hi2';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { Link, useNavigate, useParams } from 'react-router-dom';
import appStyles from '../App.module.css';
import SettingsContent from '../components/SettingsContent';
import useForceUpdate from '../hooks/useForceUpdate';
import useLanguage from '../hooks/useLanguage';
import styles from '../styles/Settings.module.css';
import css from '../utils/css';

const STRICT_WIDTH = 800;

export default function Settings() {
	const language = useLanguage('page.settings');
	const { name } = useParams();
	const navigate = useNavigate();
	const forceUpdate = useForceUpdate();
	const settings = [
		{
			name: language?.system,
			to: 'system',
			icon: <HiOutlineWrenchScrewdriver />,
			isActive: true
		},
		{
			name: language?.notifications,
			to: 'notifications',
			icon: <IoMdNotificationsOutline />,
			isActive: true
		},
	];
	useEffect(() => {
		if (name === undefined && window.innerWidth > STRICT_WIDTH) {
			navigate(settings[0].to);
		}
		if (name && !settings.find(setting => setting.to === name)) {
			navigate(settings[0].to);
		}
		window.addEventListener('resize', forceUpdate);
		return () => {
			window.removeEventListener('resize', forceUpdate);
		};
	});
	return (
		<main className={css(appStyles['dashboard-d'], styles['page-content'])}>
			{
				window.innerWidth > STRICT_WIDTH || name === undefined ?
					<section className={styles['nav-bar']}>
						<h2 style={{ marginLeft: 10 }}>{language?.settings}</h2>
						<ul>
							{
								settings.map(setting => {
									if (!setting.isActive) return;
									return (
										<li key={`settings-${setting.to}`}
											className={
												css(
													styles['list-item'],
													setting.to === window.location.pathname.split('/')[2] ? styles['current'] : ''
												)
											}
										>
											<Link to={setting.to}>
												{setting.icon}
												{setting.name}
											</Link>
										</li>
									);
								})
							}
						</ul>
					</section> : null
			}
			{
				name !== undefined ?
					<section className={styles['setting-content']}>
						<SettingsContent name={name!} />
					</section> : null
			}
		</main >
	);
}
