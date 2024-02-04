import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { SyntheticEvent, useEffect, useState } from 'react'
import { RxCross2 } from 'react-icons/rx'
import { apiAutoCompleteFaculty } from '../api/faculty'
import { apiGetSchoolClassById, apiUpdateSchoolClass } from '../api/school-class'
import { AUTO_COMPLETE_DEBOUNCE } from '../config/env'
import { queryKeys } from '../constants/query-keys'
import useAppContext from '../hooks/useAppContext'
import useDebounce from '../hooks/useDebounce'
import useLanguage from '../hooks/useLanguage'
import { ComponentViewSchoolClassLang } from '../models/lang'
import styles from '../styles/global/ViewModel.module.css'
import CustomDataList from './CustomDataList'
import Loading from './Loading'

type ViewSchoolClassProps = {
	id: number
	onMutateSuccess: () => void
	setViewMode: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ViewSchoolClass({
	id,
	onMutateSuccess,
	setViewMode
}: ViewSchoolClassProps) {
	const [hide, setHide] = useState(true)
	const language = useLanguage<ComponentViewSchoolClassLang>('component.view_school_class')
	const { permissions } = useAppContext()
	const [queryFaculty, setQueryFaculty] = useState('')
	const debounceQueryFaculty = useDebounce(queryFaculty, AUTO_COMPLETE_DEBOUNCE) as string
	const queryClient = useQueryClient()
	const handleTurnOffImportMode = () => {
		const transitionTiming = getComputedStyle(document.documentElement).getPropertyValue('--transition-timing-fast')
		const timing = Number(transitionTiming.replace('s', '')) * 1000
		setHide(true)
		setTimeout(() => {
			setViewMode(false)
		}, timing)
	}
	const queryData = useQuery({
		queryKey: [queryKeys.SCHOOL_CLASS_DETAIL, id],
		queryFn: () => apiGetSchoolClassById(id)
	})
	const facultyQueryData = useQuery({
		queryKey: [queryKeys.AUTO_COMPLETE_FACULTY, { search: debounceQueryFaculty }],
		queryFn: () => apiAutoCompleteFaculty(debounceQueryFaculty),
		enabled: debounceQueryFaculty && permissions.has('faculty_view') ? true : false
	})
	const getParentElement = (element: HTMLInputElement) => {
		let parent = element.parentElement as HTMLElement
		while (!parent.classList.contains(styles['wrap-item'])) parent = parent.parentElement as HTMLElement
		return parent
	}
	const handleOnInput = (e: React.FormEvent<HTMLFormElement>) => {
		const element = e.target as HTMLInputElement
		if (element) {
			element.classList.remove('error')
			getParentElement(element).removeAttribute('data-error')
		}
	}
	const handleUpdateSchoolClass = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
		e.preventDefault()
		document.querySelector(styles['form-data'])?.querySelectorAll<HTMLInputElement>('input[name]').forEach(node => {
			node.classList.remove('error')
			getParentElement(node).removeAttribute('data-error')
		})
		const form = e.target as HTMLFormElement
		const formData = new FormData(form)
		await apiUpdateSchoolClass(formData, id)
	}
	const { mutate, isPending } = useMutation({
		mutationFn: handleUpdateSchoolClass,
		onError: (error: object) => {
			if (typeof error === 'object') {
				for (const key in error) {
					const element = document.querySelector<HTMLInputElement>(`input[data-selector='${key}'],[name='${key}']`)
					if (element) {
						element.classList.add('error')
						getParentElement(element).setAttribute('data-error', error[key as keyof typeof error][0] as string)
					}
				}
			}
		},
		onSuccess: onMutateSuccess
	})
	useEffect(() => {
		setHide(false)
		return () => {
			queryClient.removeQueries({ queryKey: [queryKeys.SCHOOL_CLASS_DETAIL, { id: id }] })
			queryClient.removeQueries({ queryKey: [queryKeys.AUTO_COMPLETE_FACULTY] })
		}
	}, [id, queryClient])
	return (
		<div
			className={
				[
					styles['view-model-container'],
					hide ? styles['hide'] : ''
				].join(' ')
			}>
			{
				isPending ? <Loading /> : null
			}
			<div
				className={
					[
						styles['view-model-form'],
						hide ? styles['hide'] : ''
					].join(' ')
				}>
				<div className={styles['header']}>
					<h2 className={styles['title']}>{queryData.data?.name}</h2>
					<div className={styles['esc-button']}
						onClick={handleTurnOffImportMode}
					>
						<RxCross2 />
					</div>
				</div>
				<>
					{queryData.isLoading ?
						<Loading />
						: null}
					<div className={
						[
							styles['form-content']
						].join(' ')
					}>
						{
							queryData.data ? (
								<form onSubmit={(e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
									mutate(e)
								}}
									onInput={handleOnInput}
									className={styles['form-data']}>
									<div className={
										[
											styles['group-inputs']
										].join(' ')
									}>
										<div className={styles['wrap-item']}>
											<label className={styles['required']} htmlFor='shortcode'>{language?.shortcode}</label>
											<input
												id='shortcode'
												disabled={!permissions.has('school_class_update')}
												defaultValue={queryData.data.shortcode}
												name='shortcode'
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
												disabled={!permissions.has('school_class_update')}
												defaultValue={queryData.data.name}
												name='name'
												className={
													[
														'input-d',
														styles['input-item']
													].join(' ')
												} type='text' />
										</div>
										<div className={styles['wrap-item']}>
											<label className={styles['required']} htmlFor='faculty'>{language?.faculty}</label>
											<CustomDataList
												name='faculty'
												defaultOption={
													{
														label: queryData.data.faculty?.name,
														value: queryData.data.faculty ? String(queryData.data.faculty.id) : ''
													}}
												onInput={e => { setQueryFaculty(e.currentTarget.value) }}
												options={facultyQueryData.data ? facultyQueryData.data.map(item => {
													return {
														label: item.name,
														value: String(item.id)
													}
												}) : []}
											/>
										</div>
									</div>
									{
										permissions.has('school_class_update') ?
											<div className={styles['action-items']}>
												<button name='save'
													className={
														[
															'action-item-d',
															isPending ? 'button-submitting' : ''
														].join(' ')
													}
												>{language?.save}</button>
											</div>
											: null
									}
								</form>
							) : null
						}
					</div>
				</>
			</div>
		</div>
	)
}
