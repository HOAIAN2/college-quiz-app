import { useEffect, useState } from 'react'
import { RxCross2 } from 'react-icons/rx'
import useLanguage from '../hooks/useLanguage'
import { ComponentCreateExamLang } from '../models/lang'
import styles from '../styles/CreateExam.module.css'

type CreateExamProps = {
	onMutateSuccess: () => void
	setShowPopUp: React.Dispatch<React.SetStateAction<boolean>>
}
export default function CreateExam({
	// onMutateSuccess,
	setShowPopUp
}: CreateExamProps) {
	const [hide, setHide] = useState(true)
	const language = useLanguage<ComponentCreateExamLang>('component.create_exam')
	const handleClosePopUp = () => {
		const transitionTiming = getComputedStyle(document.documentElement).getPropertyValue('--transition-timing-fast')
		const timing = Number(transitionTiming.replace('s', '')) * 1000
		setHide(true)
		setTimeout(() => {
			setShowPopUp(false)
		}, timing)
	}
	useEffect(() => {
		setHide(false)
	}, [])
	return (
		<>
			<div className={
				[
					styles['create-exam-container'],
					hide ? styles['hide'] : ''
				].join(' ')
			}>
				{
					// isPending ? <Loading /> : null
				}
				<div className={
					[
						styles['create-exam-form'],
						hide ? styles['hide'] : ''
					].join(' ')
				}>
					<div className={styles['header']}>
						<h2 className={styles['title']}>{language?.create}</h2>
						<div className={styles['esc-button']}
							onClick={handleClosePopUp}
						>
							<RxCross2 />
						</div>
					</div>
					<div className={
						[
							styles['form-content']
						].join(' ')
					}>
						<form className={styles['form-data']}>
							<div className={styles['action-items']}>
								<button name='save'
									className={
										[
											'action-item-d',
											// isPending ? 'button-submitting' : ''
										].join(' ')
									}>{language?.save}</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	)
}
