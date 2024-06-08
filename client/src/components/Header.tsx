import { useEffect, useRef } from 'react';
import { AiOutlineUser } from 'react-icons/ai';
import {
	BiLogOut
} from 'react-icons/bi';
import { RxHamburgerMenu } from 'react-icons/rx';
import { Link } from 'react-router-dom';
import { apiLogout } from '../api/auth';
import useAppContext from '../hooks/useAppContext';
import useLanguage from '../hooks/useLanguage';
import styles from '../styles/Header.module.css';
import navBarStyles from '../styles/NavBar.module.css';
import languageUtils from '../utils/languageUtils';
import CustomSelect from './CustomSelect';

export default function Header() {
	const { DOM, user, appLanguage } = useAppContext();
	const language = useLanguage('component.header');
	const profileDropdownRef = useRef<HTMLDivElement>(null);
	const handleLogout = () => {
		apiLogout()
			.finally(() => {
				window.location.reload();
			});
	};
	const handleToggleDropdownProfile = () => {
		profileDropdownRef.current?.classList.toggle(styles['show']);
	};
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			const element = e.target as HTMLElement;
			if (element && !profileDropdownRef.current?.contains(element)) {
				profileDropdownRef.current?.classList.remove(styles['show']);
			}
		};
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, []);
	return (
		<header className={styles['header']}>
			<div id='loader'></div>
			<div className={styles['left-items']}>
				{
					user.user ?
						<>
							<div className={styles['toggle']} onClick={() => {
								DOM.sideBarRef.current?.classList.toggle(navBarStyles['hide']);
							}}>
								<RxHamburgerMenu />
							</div>
						</> : null
				}
				<Link to='/'>
					<img style={{ userSelect: 'none' }} height={30} src={'/favicon.ico'} alt="app icon" />
				</Link>
				<h1 style={{ userSelect: 'none' }} ref={DOM.titleRef} className={styles['app-title']}></h1>
			</div>
			<div className={styles['right-items']}>
				<div>
					<CustomSelect
						defaultOption={languageUtils.languageCodeName.find(lang => lang.value === appLanguage.language)!}
						options={languageUtils.languageCodeName}
						className={styles['select-language']}
						onChange={option => {
							appLanguage.setLanguage(option.value);
							languageUtils.setLanguage(option.value);
						}}
					/>
				</div>
				{
					user.user ?
						<>
							<div
								ref={profileDropdownRef}
								onClick={handleToggleDropdownProfile} className={styles['right-item']}>
								<AiOutlineUser />
								<div onClick={handleToggleDropdownProfile} className={styles['drop-down']}>
									<Link
										onClick={handleToggleDropdownProfile}
										to='/profile'
										className={styles['drop-item']}
										title={languageUtils.getFullName(user.user?.firstName, user.user?.lastName)}
									>
										<AiOutlineUser />
										<span>{language?.profile}</span>
									</Link>
									<div onClick={handleLogout} className={styles['drop-item']}>
										<BiLogOut />
										<span>{language?.logout}</span>
									</div>
								</div>
							</div>
						</> : null
				}
			</div>
		</header>
	);
}
