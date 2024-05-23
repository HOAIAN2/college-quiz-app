import { useMutation } from '@tanstack/react-query'
import { SyntheticEvent, useEffect, useState } from 'react'
import Datetime from 'react-datetime'
import { FiSave } from 'react-icons/fi'
import { RxCross2 } from 'react-icons/rx'
import { apiCreateSemester } from '../api/semester'
import useLanguage from '../hooks/useLanguage'
import { ComponentCreateSemesterLang } from '../models/lang'
import styles from '../styles/global/CreateModel.module.css'
import createFormUtils from '../utils/createFormUtils'
import renderMonth from '../utils/renderMonth'
import Loading from './Loading'

type CreateSemesterProps = {
	onMutateSuccess: () => void
	setShowPopUp: React.Dispatch<React.SetStateAction<boolean>>
}

export default function CreateSemester({
	onMutateSuccess,
	setShowPopUp
}: CreateSemesterProps) {
	const [hide, setHide] = useState(true)
	const language = useLanguage<ComponentCreateSemesterLang>('component.create_semester')
	const handleClosePopUp = () => {
		const transitionTiming = getComputedStyle(document.documentElement).getPropertyValue('--transition-timing-fast')
		const timing = Number(transitionTiming.replace('s', '')) * 1000
		setHide(true)
		setTimeout(() => {
			setShowPopUp(false)
		}, timing)
	}
	const formUtils = createFormUtils(styles)
	const handleCreateFaculty = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
		e.preventDefault()
		document.querySelector(`.${styles['form-data']}`)?.querySelectorAll<HTMLInputElement>('input[name]').forEach(node => {
			node.classList.remove('error')
			formUtils.getParentElement(node)?.removeAttribute('data-error')
		})
		const submitter = e.nativeEvent.submitter as HTMLButtonElement
		const form = e.target as HTMLFormElement
		const formData = new FormData(form)
		await apiCreateSemester(formData)
		if (submitter.name === 'save') handleClosePopUp()
		else form.reset()
	}
	const { mutate, isPending } = useMutation({
		mutationFn: handleCreateFaculty,
		onError: (error: object) => { formUtils.showFormError(error) },
		onSuccess: onMutateSuccess
	})
	useEffect(() => {
		setHide(false)
	}, [])
	return (
		<div className={
			[
				styles['create-model-container'],
				hide ? styles['hide'] : ''
			].join(' ')
		}>
			{
				isPending ? <Loading /> : null
			}
			<div className={
				[
					styles['create-model-form'],
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
					<form onSubmit={(e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
						mutate(e)
					}}
						onInput={(e) => { formUtils.handleOnInput(e) }}
						className={styles['form-data']}>
						<div className={
							[
								styles['group-inputs']
							].join(' ')
						}>
							<div className={styles['wrap-item']}>
								<label className={styles['required']} htmlFor='name'>{language?.name}</label>
								<input
									id='name'
									name='name'
									className={
										[
											'input-d',
											styles['input-item']
										].join(' ')
									} type='text' />
							</div>
							<div className={styles['wrap-item']}>
								<label className={styles['required']} htmlFor='start_date'>{language?.startDate}</label>
								<Datetime
									initialValue={new Date()}
									renderMonth={renderMonth}
									inputProps={
										{
											id: 'start_date',
											name: 'start_date',
											className: [
												'input-d',
												styles['input-item']
											].join(' ')
										}
									}
									closeOnSelect={true}
									timeFormat={false}
								/>
							</div>
							<div className={styles['wrap-item']}>
								<label className={styles['required']} htmlFor='end_date'>{language?.endDate}</label>
								<Datetime
									initialValue={new Date()}
									renderMonth={renderMonth}
									inputProps={
										{
											id: 'end_date',
											name: 'end_date',
											className: [
												'input-d',
												styles['input-item']
											].join(' ')
										}
									}
									closeOnSelect={true}
									timeFormat={false}
								/>
							</div>
						</div>
						<div className={styles['action-items']}>
							<button name='save'
								className={
									[
										'action-item-d',
										isPending ? 'button-submitting' : ''
									].join(' ')
								}><FiSave />{language?.save}</button>
							<button name='save-more'
								className={
									[
										'action-item-d-white',
										isPending ? 'button-submitting' : ''
									].join(' ')
								}
							><FiSave />{language?.saveMore}</button>
						</div>
					</form>
				</div>
			</div >
		</div >
	)
}
