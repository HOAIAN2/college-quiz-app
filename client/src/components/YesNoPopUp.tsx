import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { RxCross2 } from 'react-icons/rx'
import styles from '../styles/YesNoPopUp.module.css'
import Loading from './Loading'

type YesNoPopUpProps = {
	message: string
	mutateFunction: () => Promise<void>
	onMutateSuccess: () => void
	setShowPopUpMode: React.Dispatch<React.SetStateAction<boolean>>
	langYes?: string
	langNo?: string
}
export default function YesNoPopUp({
	message,
	mutateFunction,
	onMutateSuccess,
	setShowPopUpMode,
	langYes,
	langNo
}: YesNoPopUpProps) {
	const [hide, setHide] = useState(true)
	const handleClosePopUp = () => {
		const transitionTiming = getComputedStyle(document.documentElement).getPropertyValue('--transition-timing-fast')
		const timing = Number(transitionTiming.replace('s', '')) * 1000
		setHide(true)
		setTimeout(() => {
			setShowPopUpMode(false)
		}, timing)
	}
	const mutation = useMutation({
		mutationFn: mutateFunction,
		onSuccess: () => {
			onMutateSuccess()
			handleClosePopUp()
		}
	})
	useEffect(() => {
		setHide(false)
		document.addEventListener('keydown', e => {
			if (e.key === 'Escape') handleClosePopUp()
		}, { once: true })
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	return (
		<div
			className={
				[
					styles['yes-no-pop-up-container'],
					hide ? styles['hide'] : ''
				].join(' ')
			}>
			{mutation.isPending ? <Loading /> : null}
			<div
				className={
					[
						styles['yes-no-pop-up-form'],
						hide ? styles['hide'] : ''
					].join(' ')
				}>
				<div className={styles['header']}>
					<h2></h2>
					<div className={styles['esc-button']}
						onClick={handleClosePopUp}
					>
						<RxCross2 />
					</div>
				</div>
				<div
					className={
						[
							styles['form-data']
						].join(' ')
					}>
					<div
						className={
							[
								styles['message']
							].join(' ')
						}
					>
						<div className={styles['message-content']}>
							{message}
						</div>
					</div>
					<div className={styles['action-items']}>
						<button
							onClick={handleClosePopUp}
							className={
								[
									'action-item-d-white-border-red',
									mutation.isPending ? styles['pending'] : ''
								].join(' ')
							}
						>{langNo}</button>
						<button
							onClick={() => { mutation.mutate() }}
							className={
								[
									'action-item-d-white',
									mutation.isPending ? styles['pending'] : ''
								].join(' ')
							}>{langYes}
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
