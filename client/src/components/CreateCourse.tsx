import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { SyntheticEvent, useEffect, useState } from 'react'
import { RxCross2 } from 'react-icons/rx'
import { apiCreateCourse } from '../api/course'
import { apiAutoCompleteSubject } from '../api/subject'
import { apiAutoCompleteUser } from '../api/user'
import { AUTO_COMPLETE_DEBOUNCE } from '../config/env'
import { queryKeys } from '../constants/query-keys'
import useDebounce from '../hooks/useDebounce'
import useLanguage from '../hooks/useLanguage'
import { ComponentCreateCourseLang } from '../models/lang'
import { Option } from '../models/option'
import { Semester } from '../models/semester'
import styles from '../styles/global/CreateModel.module.css'
import createFormUtils from '../utils/createFormUtils'
import languageUtils from '../utils/languageUtils'
import CustomDataList from './CustomDataList'
import Loading from './Loading'

type CreateCourseProps = {
	semester: Semester
	numberOfCourses: number
	onMutateSuccess: () => void
	setShowPopUp: React.Dispatch<React.SetStateAction<boolean>>
}
export default function CreateCourse({
	semester,
	numberOfCourses,
	onMutateSuccess,
	setShowPopUp
}: CreateCourseProps) {
	const [hide, setHide] = useState(true)
	const language = useLanguage<ComponentCreateCourseLang>('component.create_course')
	const [queryUser, setQueryUser] = useState('')
	const [querySubject, setQuerySubject] = useState('')
	const [shortcode, setShortcode] = useState('')
	const debounceQueryUser = useDebounce(queryUser, AUTO_COMPLETE_DEBOUNCE)
	const debounceQuerySubject = useDebounce(querySubject, AUTO_COMPLETE_DEBOUNCE)
	const queryClient = useQueryClient()
	const handleClosePopUp = () => {
		const transitionTiming = getComputedStyle(document.documentElement).getPropertyValue('--transition-timing-fast')
		const timing = Number(transitionTiming.replace('s', '')) * 1000
		setHide(true)
		setTimeout(() => {
			setShowPopUp(false)
		}, timing)
	}
	const formUtils = createFormUtils(styles)
	const userQueryData = useQuery({
		queryKey: [queryKeys.AUTO_COMPLETE_SUBJECT, { search: debounceQueryUser }],
		queryFn: () => apiAutoCompleteUser('teacher', debounceQueryUser),
		enabled: debounceQueryUser ? true : false
	})
	const subjectQueryData = useQuery({
		queryKey: [queryKeys.AUTO_COMPLETE_SUBJECT, { search: debounceQuerySubject }],
		queryFn: () => apiAutoCompleteSubject(debounceQuerySubject),
		enabled: debounceQuerySubject ? true : false
	})
	const handleCreateCourse = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
		e.preventDefault()
		document.querySelector(`.${styles['form-data']}`)?.querySelectorAll<HTMLInputElement>('input[name]').forEach(node => {
			node.classList.remove('error')
			formUtils.getParentElement(node)?.removeAttribute('data-error')
		})
		const submitter = e.nativeEvent.submitter as HTMLButtonElement
		const form = e.target as HTMLFormElement
		const formData = new FormData(form)
		await apiCreateCourse(formData)
		if (submitter.name === 'save') handleClosePopUp()
		else form.reset()
	}
	const { mutate, isPending } = useMutation({
		mutationFn: handleCreateCourse,
		onError: (error: object) => { formUtils.showFormError(error) },
		onSuccess: onMutateSuccess
	})
	const handleSetShortcode = (option: Option) => {
		const startDate = new Date(semester.startDate)
		const endDate = new Date(semester.endDate)
		const name = [
			startDate.getDate(),
			startDate.getMonth() + 1,
			endDate.getDate(),
			endDate.getMonth() + 1,
			languageUtils.getShortHand(option.label!),
			numberOfCourses + 1
		].join('')
		setShortcode(name)
	}
	useEffect(() => {
		setHide(false)
		const handleEscEvent = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && document.activeElement?.nodeName !== 'INPUT') handleClosePopUp()
		}
		document.addEventListener('keydown', handleEscEvent)
		return () => {
			document.removeEventListener('keydown', handleClosePopUp)
			queryClient.removeQueries({ queryKey: [queryKeys.AUTO_COMPLETE_USER] })
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [queryClient])
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
						<input name='semester_id' value={semester.id} readOnly hidden />
						<div className={
							[
								styles['group-inputs']
							].join(' ')
						}>
							<div className={styles['wrap-item']}>
								<label className={styles['required']} htmlFor='shortcode'>{language?.shortcode}</label>
								<input
									id='shortcode'
									name='shortcode'
									value={shortcode}
									onInput={e => { setShortcode(e.currentTarget.value) }}
									className={
										[
											'input-d',
											styles['input-item']
										].join(' ')
									} type='text' />
							</div>
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
							<div
								style={{ zIndex: 2 }}
								className={styles['wrap-item']}>
								<label className={styles['required']} htmlFor='teacher_id'>{language?.teacher}</label>
								<CustomDataList
									name='teacher_id'
									onInput={e => { setQueryUser(e.currentTarget.value) }}
									options={userQueryData.data ? userQueryData.data.map(item => {
										return {
											label: languageUtils.getFullName(item.firstName, item.lastName),
											value: String(item.id)
										}
									}) : []}
									className={
										[
											styles['custom-select']
										].join(' ')
									}
								/>
							</div>
							<div className={styles['wrap-item']}>
								<label className={styles['required']} htmlFor='subject_id'>{language?.subject}</label>
								<CustomDataList
									name='subject_id'
									onInput={e => { setQuerySubject(e.currentTarget.value) }}
									options={subjectQueryData.data ? subjectQueryData.data.map(item => {
										return {
											label: item.name,
											value: String(item.id)
										}
									}) : []}
									onChange={handleSetShortcode}
									className={
										[
											styles['custom-select']
										].join(' ')
									}
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
								}>{language?.save}</button>
							<button name='save-more'
								className={
									[
										'action-item-d-white',
										isPending ? 'button-submitting' : ''
									].join(' ')
								}
							>{language?.saveMore}</button>
						</div>
					</form>
				</div>
			</div >
		</div >
	)
}
