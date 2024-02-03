import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { SyntheticEvent, useEffect, useState } from 'react'
import { RxCross2 } from 'react-icons/rx'
import { apiGetFacultyById, apiUpdateFaculty } from '../api/faculty'
import { apiAutoCompleteUser } from '../api/user'
import { AUTO_COMPLETE_DEBOUNCE } from '../config/env'
import useAppContext from '../hooks/useAppContext'
import useDebounce from '../hooks/useDebounce'
import useLanguage from '../hooks/useLanguage'
import { ComponentViewFacultyLang } from '../models/lang'
import styles from '../styles/global/ViewModel.module.css'
import languageUtils from '../utils/languageUtils'
import CustomDataList from './CustomDataList'
import Loading from './Loading'

type ViewFacultyProps = {
	id: number
	onMutateSuccess: () => void
	setViewMode: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ViewFaculty({
	id,
	onMutateSuccess,
	setViewMode
}: ViewFacultyProps) {
	const [hide, setHide] = useState(true)
	const language = useLanguage<ComponentViewFacultyLang>('component.view_faculty')
	const { permissions } = useAppContext()
	const [queryUser, setQueryUser] = useState('')
	const debounceQueryUser = useDebounce(queryUser, AUTO_COMPLETE_DEBOUNCE) as string
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
		queryKey: ['faculty', id],
		queryFn: () => apiGetFacultyById(id)
	})
	const userQueryData = useQuery({
		queryKey: ['user-auto-complete', debounceQueryUser],
		queryFn: () => apiAutoCompleteUser('teacher', debounceQueryUser),
		enabled: debounceQueryUser && permissions.has('user_view') ? true : false
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
	const handleUpdateFaculty = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
		e.preventDefault()
		if (!permissions.has('faculty_update')) return
		document.querySelector(styles['form-data'])?.querySelectorAll('input[name]').forEach(node => {
			const element = node as HTMLInputElement
			element.classList.remove('error')
			getParentElement(element).removeAttribute('data-error')
		})
		const form = e.target as HTMLFormElement
		const formData = new FormData(form)
		await apiUpdateFaculty(formData, id)
	}
	const { mutate, isPending } = useMutation({
		mutationFn: handleUpdateFaculty,
		onError: (error: object) => {
			if (typeof error === 'object') {
				for (const key in error) {
					const element = document.querySelector(`input[data-selector='${key}'],[name='${key}']`) as HTMLInputElement
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
			queryClient.removeQueries({ queryKey: ['faculty', id] })
			queryClient.removeQueries({ queryKey: ['user-auto-complete'] })
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
												disabled={!permissions.has('faculty_update')}
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
												disabled={!permissions.has('faculty_update')}
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
											<label htmlFor='email'>{language?.email}</label>
											<input
												id='email'
												disabled={!permissions.has('faculty_update')}
												defaultValue={queryData.data.email || ''}
												name='email'
												className={
													[
														'input-d',
														styles['input-item']
													].join(' ')
												} type='text' />
										</div>
										<div className={styles['wrap-item']}>
											<label htmlFor='phone_number'>{language?.phoneNumber}</label>
											<input
												id='phone_number'
												disabled={!permissions.has('faculty_update')}
												defaultValue={queryData.data.phoneNumber || ''}
												name='phone_number'
												className={
													[
														'input-d',
														styles['input-item']
													].join(' ')
												} type='text' />
										</div>
										<div className={styles['wrap-item']}>
											<label htmlFor='leader'>{language?.leader}</label>
											<CustomDataList
												name='leader'
												defaultOption={
													{
														label: languageUtils.getFullName(queryData.data.leader?.firstName, queryData.data.leader?.lastName),
														value: queryData.data.leader ? String(queryData.data.leader.id) : ''
													}
												}
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
									</div>
									{
										permissions.has('faculty_update') ?
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
