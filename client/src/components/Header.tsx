import { useEffect, useRef } from 'react'
import { AiOutlineUser } from 'react-icons/ai'
import {
	BiLogOut
} from 'react-icons/bi'
import {
	PiSidebarSimpleLight
} from 'react-icons/pi'
import { Link, useNavigate } from 'react-router-dom'
import { apiLogout } from '../api/auth'
import useAppContext from '../hooks/useAppContext'
import useLanguage from '../hooks/useLanguage'
import { ComponentHeaderLang } from '../models/lang'
import styles from '../styles/Header.module.css'
import navBarStyles from '../styles/NavBar.module.css'
import languageUtils from '../utils/languageUtils'
import CustomSelect from './CustomSelect'

const languageOptions = [
	{
		value: 'vi',
		label: 'Tiếng Việt'
	},
	{
		value: 'en',
		label: 'English'
	},
]
export default function Header() {
	const { DOM, user, appLanguage } = useAppContext()
	const language = useLanguage<ComponentHeaderLang>('component.header')
	// const profileDropdownRef = useRef<HTMLDivElement>(null)
	const navigate = useNavigate()
	const dropContainerRef = useRef<HTMLDivElement>(null)
	const handleLogout = () => {
		apiLogout()
			.finally(() => {
				navigate(0)
			})
	}
	const handleToggle = () => {
		dropContainerRef.current?.classList.toggle(styles['show'])
	}
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			const element = e.target as HTMLElement
			if (element && !dropContainerRef.current?.contains(element)) {
				dropContainerRef.current?.classList.remove(styles['show'])
			}
		}
		document.addEventListener('click', handleClickOutside)
		return () => {
			document.removeEventListener('click', handleClickOutside)
		}
	}, [])
	return (
		<header className={styles['header']}>
			<div id='loader'></div>
			<div className={styles['left-items']}>
				{
					user.user ?
						<>
							<div className={styles['toggle']} onClick={() => {
								DOM.sideBarRef.current?.classList.toggle(navBarStyles['hide'])
							}}>
								<PiSidebarSimpleLight />
							</div>
						</> : null
				}
				<h1 ref={DOM.titleRef} className={styles['app-title']}></h1>
			</div>
			<div className={styles['right-items']}>
				<div>
					<CustomSelect
						defaultOption={languageOptions.find(lang => lang.value === appLanguage.language)!}
						options={languageOptions}
						className={styles['select-language']}
						onChange={option => {
							appLanguage.setLanguage(option.value)
							languageUtils.setLanguage(option.value)
						}}
					/>
				</div>
				{
					user.user ?
						<>
							<div
								ref={dropContainerRef}
								onClick={handleToggle} className={styles['right-item']}>
								<AiOutlineUser />
								<div onClick={handleToggle} className={styles['drop-down']}>
									<Link to='/profile' className={styles['drop-item']}
										title={languageUtils.getFullName(user.user?.firstName, user.user?.lastName)}>
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
	)
}
