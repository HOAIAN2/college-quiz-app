import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { SyntheticEvent, useEffect, useState } from 'react'
import Datetime from 'react-datetime'
import { RxCross2 } from 'react-icons/rx'
import { apiAutoCompleteFaculty } from '../api/faculty'
import { apiAutoCompleteSchoolClass } from '../api/school-class'
import { apiGetUserById, apiUpdateUser } from '../api/user'
import { AUTO_COMPLETE_DEBOUNCE } from '../config/env'
import { queryKeys } from '../constants/query-keys'
import useAppContext from '../hooks/useAppContext'
import useDebounce from '../hooks/useDebounce'
import useLanguage from '../hooks/useLanguage'
import { ComponentViewUserLang } from '../models/lang'
import styles from '../styles/global/ViewModel.module.css'
import languageUtils from '../utils/languageUtils'
import CustomDataList from './CustomDataList'
import CustomSelect from './CustomSelect'
import Loading from './Loading'

type ViewUserProps = {
	id: number
	onMutateSuccess: () => void
	setShowPopUp: React.Dispatch<React.SetStateAction<boolean>>
}
export default function ViewUser({
	id,
	onMutateSuccess,
	setShowPopUp
}: ViewUserProps) {
	const [hide, setHide] = useState(true)
	const language = useLanguage<ComponentViewUserLang>('component.view_user')
	const { permissions } = useAppContext()
	const [queryClass, setQueryClass] = useState('')
	const [queryFaculty, setQueryFaculty] = useState('')
	const debouceQueryClass = useDebounce(queryClass, AUTO_COMPLETE_DEBOUNCE)
	const debounceQueryFaculty = useDebounce(queryFaculty, AUTO_COMPLETE_DEBOUNCE)
	const queryClient = useQueryClient()
	const handleClosePopUp = () => {
		const transitionTiming = getComputedStyle(document.documentElement).getPropertyValue('--transition-timing-fast')
		const timing = Number(transitionTiming.replace('s', '')) * 1000
		setHide(true)
		setTimeout(() => {
			setShowPopUp(false)
		}, timing)
	}
	const queryData = useQuery({
		queryKey: [queryKeys.USER_DETAIL, { id: id }],
		queryFn: () => apiGetUserById(id)
	})
	const classQueryData = useQuery({
		queryKey: [queryKeys.AUTO_COMPLETE_SCHOOL_CLASS, { search: debouceQueryClass }],
		queryFn: () => apiAutoCompleteSchoolClass(debouceQueryClass),
		enabled: debouceQueryClass && permissions.has('school_class_view') ? true : false
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
	const handleUpdateUser = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
		e.preventDefault()
		document.querySelector(styles['form-data'])?.querySelectorAll<HTMLInputElement>('input[name]').forEach(node => {
			node.classList.remove('error')
			getParentElement(node).removeAttribute('data-error')
		})
		const form = e.target as HTMLFormElement
		const formData = new FormData(form)
		await apiUpdateUser(formData, id)
	}
	const { mutate, isPending } = useMutation({
		mutationFn: handleUpdateUser,
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
	const genderOptions = [
		{ value: 'male', label: language?.genders.male },
		{ value: 'female', label: language?.genders.female },
	]
	const statusOptions = [
		{ value: '1', label: language?.status.active },
		{ value: '0', label: language?.status.inactive },
	]
	useEffect(() => {
		setHide(false)
		document.addEventListener('keydown', e => {
			if (e.key === 'Escape') handleClosePopUp()
		}, { once: true })
		return () => {
			queryClient.removeQueries({ queryKey: [queryKeys.USER_DETAIL, { id: id }] })
			queryClient.removeQueries({ queryKey: [queryKeys.AUTO_COMPLETE_FACULTY] })
			queryClient.removeQueries({ queryKey: [queryKeys.AUTO_COMPLETE_SCHOOL_CLASS] })
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [queryClient, id])
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
					<h2 className={styles['title']}>{languageUtils.getFullName(queryData.data?.firstName, queryData.data?.lastName)}</h2>
					<div className={styles['esc-button']}
						onClick={handleClosePopUp}
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
											<label className={styles['required']} htmlFor='email'>{language?.email}</label>
											<input
												id='email'
												disabled={!permissions.has('user_update')}
												defaultValue={queryData.data.email}
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
												disabled={!permissions.has('user_update')}
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
											<label className={styles['required']} htmlFor='first_name'>{language?.firstName}</label>
											<input
												id='first_name'
												disabled={!permissions.has('user_update')}
												defaultValue={queryData.data.firstName}
												name='first_name'
												className={
													[
														'input-d',
														styles['input-item']
													].join(' ')
												} type='text' />
										</div>
										<div className={styles['wrap-item']}>
											<label className={styles['required']} htmlFor='last_name'>{language?.lastName}</label>
											<input
												id='last_name'
												disabled={!permissions.has('user_update')}
												defaultValue={queryData.data.lastName}
												name='last_name'
												className={
													[
														'input-d',
														styles['input-item']
													].join(' ')
												} type='text' />
										</div>
										<div className={styles['wrap-item']}>
											<label className={styles['required']} htmlFor='shortcode'>{language?.shortcode}</label>
											<input
												id='shortcode'
												disabled={!permissions.has('user_update')}
												defaultValue={queryData.data.shortcode}
												name='shortcode'
												className={
													[
														'input-d',
														styles['input-item']
													].join(' ')
												} type='text' />
										</div>
										{queryData.data.role.name === 'student' ?
											<div style={{ zIndex: 3 }} className={styles['wrap-item']}>
												<label className={styles['required']} htmlFor='school_class'>{language?.class}</label>
												<CustomDataList
													name='school_class'
													defaultOption={
														{
															label: queryData.data.schoolClass?.name,
															value: queryData.data.schoolClass ? String(queryData.data.schoolClass.id) : ''
														}
													}
													onInput={e => { setQueryClass(e.currentTarget.value) }}
													options={classQueryData.data ? classQueryData.data.map(item => {
														return {
															label: item.name,
															value: String(item.id)
														}
													}) : []}
												/>
											</div>
											: queryData.data.role.name === 'teacher' ?
												<div style={{ zIndex: 3 }} className={styles['wrap-item']}>
													<label className={styles['required']} htmlFor='faculty'>{language?.faculty}</label>
													<CustomDataList
														name='faculty'
														defaultOption={
															{
																label: queryData.data.faculty?.name,
																value: queryData.data.faculty ? String(queryData.data.faculty.id) : ''
															}
														}
														onInput={e => { setQueryFaculty(e.currentTarget.value) }}
														options={facultyQueryData.data ? facultyQueryData.data.map(item => {
															return {
																label: item.name,
																value: String(item.id)
															}
														}) : []}
													/>
												</div>
												: null
										}
										<div
											className={styles['wrap-item']}
											style={{ zIndex: 2 }}>
											<label className={styles['required']} htmlFor=''>{language?.genders.gender}</label>
											<CustomSelect
												name='gender'
												defaultOption={
													queryData.data.gender === 'male'
														? genderOptions[0] : genderOptions[1]
												}
												disabled={!permissions.has('user_update')}
												options={genderOptions}
												className={
													[
														styles['custom-select']
													].join(' ')
												}
											/>
										</div>
										<div className={styles['wrap-item']}>
											<label className={styles['required']} htmlFor='address'>{language?.address}</label>
											<input
												id='address'
												disabled={!permissions.has('user_update')}
												defaultValue={queryData.data.address}
												name='address'
												className={
													[
														'input-d',
														styles['input-item']
													].join(' ')
												} type='text' />
										</div>
										<div className={styles['wrap-item']}>
											<label className={styles['required']} htmlFor='birth_date'>{language?.birthDate}</label>
											<Datetime
												initialValue={new Date(queryData.data.birthDate)}
												inputProps={
													{
														id: 'birth_date',
														disabled: !permissions.has('user_view'),
														name: 'birth_date',
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
											<label className={styles['required']} htmlFor=''>{language?.status.accountStatus}</label>
											<CustomSelect
												name='is_active'
												defaultOption={
													queryData.data.isActive
														? statusOptions[0] : statusOptions[1]
												}
												disabled={!permissions.has('user_update')}
												options={statusOptions}
												className={
													[
														styles['custom-select']
													].join(' ')
												}
											/>
										</div>
										<div className={styles['wrap-item']}>
											<label htmlFor='password'>{language?.password}</label>
											<input
												id='password'
												disabled={!permissions.has('user_update')}
												placeholder={language?.leaveBlank}
												name='password'
												className={
													[
														'input-d',
														styles['input-item']
													].join(' ')
												} type='password' />
										</div>
									</div>
									{
										permissions.has('user_update') ?
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
