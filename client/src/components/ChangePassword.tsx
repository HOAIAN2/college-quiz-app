import { useEffect, useRef, useState } from 'react'
import { RxCross2 } from 'react-icons/rx'
import { useNavigate } from 'react-router-dom'
import { apiChangePassword } from '../api/auth'
import useLanguage from '../hooks/useLanguage'
import { ComponentChangePassword } from '../models/lang'
import styles from '../styles/ChangePassword.module.css'

type ChangePasswordProps = {
	setShowPopup: React.Dispatch<React.SetStateAction<boolean>>
}
export default function ChangePassword({
	setShowPopup
}: ChangePasswordProps) {
	const language = useLanguage<ComponentChangePassword>('component.change_password')
	const [blockSubmit, setBlockSubmit] = useState(true)
	const [isSubmitting, seIsSubmitting] = useState(false)
	const [hide, setHide] = useState(true)
	const buttonRef = useRef<HTMLButtonElement>(null)
	const navigate = useNavigate()
	const handleClosePopUp = () => {
		const transitionTiming = getComputedStyle(document.documentElement).getPropertyValue('--transition-timing-fast')
		const timing = Number(transitionTiming.replace('s', '')) * 1000
		setHide(true)
		setTimeout(() => {
			setShowPopup(false)
		}, timing)
	}
	const handlePreventSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		const formData = new FormData(e.currentTarget)
		for (const pair of formData.entries()) {
			const value = pair[1] as string
			if (!value.trim()) {
				return setBlockSubmit(true)
			}
		}
		setBlockSubmit(false)
	}
	const handleChangePassword = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (blockSubmit) return
		setBlockSubmit(true)
		seIsSubmitting(true)
		const formData = new FormData(e.currentTarget)
		buttonRef.current?.classList.add(styles['submitting'])
		apiChangePassword(formData)
			.then(() => {
				return navigate(0)
			})
			.catch(() => {
				setBlockSubmit(false)
				seIsSubmitting(false)
			}).finally(() => {
				buttonRef.current?.classList.remove(styles['submitting'])
			})
	}
	useEffect(() => {
		setHide(false)
		const handleEscEvent = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && document.activeElement?.nodeName !== 'INPUT') handleClosePopUp()
		}
		document.addEventListener('keydown', handleEscEvent)
		return () => {
			document.removeEventListener('keydown', handleEscEvent)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	return (
		<div className={
			[
				styles['change-password-container'],
				hide ? styles['hide'] : ''
			].join(' ')
		}>
			<div className={
				[
					styles['change-password-form'],
					hide ? styles['hide'] : ''
				].join(' ')
			}>
				<div className={styles['header']}>
					<h2 className={styles['title']}>{language?.title}</h2>
					<div className={styles['esc-button']}
						onClick={handleClosePopUp}
					>
						<RxCross2 />
					</div>
				</div>
				<form onSubmit={handleChangePassword}
					onInput={handlePreventSubmit}
					className={styles['form-data']}>
					<div className={
						[
							styles['group-inputs']
						].join(' ')
					}>
						<div className={styles['wrap-item']}>
							<label className={styles['required']} htmlFor="">{language?.password}</label>
							<input
								name='current_password'
								className={
									[
										'input-d',
										styles['input-item']
									].join(' ')
								} type="password" />
						</div>
						<div className={styles['wrap-item']}>
							<label className={styles['required']} htmlFor="">{language?.newPassword}</label>
							<input
								name='password'
								className={
									[
										'input-d',
										styles['input-item']
									].join(' ')
								} type="password" />
						</div>
						<div className={styles['wrap-item']}>
							<label className={styles['required']} htmlFor="">{language?.confirmPassword}</label>
							<input
								name='password_confirmation'
								className={
									[
										'input-d',
										styles['input-item']
									].join(' ')
								} type="password" />
						</div>
						<div className={styles['wrap-item']}>
							<button
								ref={buttonRef}
								className={
									[
										'button-d',
										styles['submit'],
										blockSubmit && !buttonRef.current?.classList.contains(styles['submitting'])
											? styles['blocking'] : ''
									].join(' ')}>{!isSubmitting && language?.title}</button>
						</div>
					</div>
				</form>
			</div >
		</div >
	)
}
