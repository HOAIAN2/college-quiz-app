import { useEffect, useState } from 'react';
import { HiOutlineWrenchScrewdriver } from 'react-icons/hi2';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { MdOutlineSecurity } from 'react-icons/md';
import { Link, useNavigate, useParams } from 'react-router-dom';
import appStyles from '../App.module.css';
import SettingsContent from '../components/SettingsContent';
import useLanguage from '../hooks/useLanguage';
import styles from '../styles/Settings.module.css';
import css from '../utils/css';

const STRICT_WIDTH = 800;

export default function Settings() {
	const language = useLanguage('page.settings');
	const [isWindowWidthExceeded, setIsWindowWidthExceeded] = useState(window.innerWidth > STRICT_WIDTH);
	const { name } = useParams();
	const navigate = useNavigate();
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
		{
			name: language?.security,
			to: 'security',
			icon: <MdOutlineSecurity />,
			isActive: true
		},
	];
	useEffect(() => {
		if (!settings.find(setting => setting.to === name) && isWindowWidthExceeded) {
			navigate(settings[0].to);
		}
	});
	useEffect(() => {
		const handleResize = () => {
			const currentWidth = window.innerWidth;
			if (currentWidth > STRICT_WIDTH && isWindowWidthExceeded) return;
			if (currentWidth <= STRICT_WIDTH && !isWindowWidthExceeded) return;
			setIsWindowWidthExceeded(pre => !pre);
		};
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [isWindowWidthExceeded]);
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
