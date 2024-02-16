import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { SyntheticEvent, useEffect, useState } from 'react'
import { LuBookOpenCheck } from 'react-icons/lu'
import { MdDeleteOutline } from 'react-icons/md'
import { RiAddFill } from 'react-icons/ri'
import { useNavigate, useParams } from 'react-router-dom'
import { apiDeleteSubject, apiGetSubjectById, apiUpdateSubject } from '../api/subject'
import CreateChapter from '../components/CreateChapter'
import Loading from '../components/Loading'
import YesNoPopUp from '../components/YesNoPopUp'
import { queryKeys } from '../constants/query-keys'
import useAppContext from '../hooks/useAppContext'
import useLanguage from '../hooks/useLanguage'
import { PageSubjectLang } from '../models/lang'
import styles from '../styles/Subject.module.css'

export default function Subject() {
	const { id } = useParams()
	const { permissions } = useAppContext()
	const language = useLanguage<PageSubjectLang>('page.subject')
	const queryClient = useQueryClient()
	const [showDeletePopUp, setShowDeletePoUp] = useState(false)
	const [insertMode, setInsertMode] = useState(false)
	const navigate = useNavigate()
	const queryData = useQuery({
		queryKey: [queryKeys.PAGE_SUBJECT, { id: id }],
		queryFn: () => apiGetSubjectById(String(id))
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
		if (!permissions.has('subject_update')) return
		document.querySelector(styles['form-data'])?.querySelectorAll('input[name]').forEach(node => {
			const element = node as HTMLInputElement
			element.classList.remove('error')
			getParentElement(element).removeAttribute('data-error')
		})
		const form = e.target as HTMLFormElement
		const formData = new FormData(form)
		queryData.data && await apiUpdateSubject(formData, queryData.data.id)
	}
	const { mutate, isPending } = useMutation({
		mutationFn: handleUpdateUser,
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
	})
	const handleDeletetSubject = async () => {
		return await apiDeleteSubject(String(id))
	}
	const onMutateSuccess = () => {
		[queryKeys.PAGE_SUBJECTS].forEach(key => {
			queryClient.refetchQueries({ queryKey: [key] })
		})
		navigate('/subjects')
	}
	useEffect(() => {
		return () => {
			queryClient.removeQueries({ queryKey: [queryKeys.PAGE_SUBJECT, { id: id }] })
		}
	}, [id, queryClient])
	return (
		<>
			{insertMode === true ?
				<CreateChapter
					subjectId={String(id)}
					onMutateSuccess={() => { queryData.refetch() }}
					setInsertMode={setInsertMode}
				/> : null}
			{showDeletePopUp === true ?
				<YesNoPopUp
					message={language?.deleteMessage || ''}
					mutateFunction={handleDeletetSubject}
					setShowPopUpMode={setShowDeletePoUp}
					onMutateSuccess={onMutateSuccess}
					langYes={language?.langYes}
					langNo={language?.langNo}
				/> : null}
			<div className={
				[
					'dashboard-d',
					styles['page-content']
				].join(' ')
			}>
				{
					queryData.isLoading ? <Loading /> : null
				}
				{
					isPending ? <Loading /> : null
				}
				{
					queryData.data ?
						<>
							<div className={
								[
									styles['form-content']
								].join(' ')
							}>
								<div className={styles['header']}>
									<h2 className={styles['title']}>{queryData.data.name}</h2>
								</div>
								<form onSubmit={(e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
									mutate(e)
								}}
									onInput={handleOnInput}
									className={styles['form-data']}>
									<input name='is_active' defaultValue='1' hidden />
									<div className={
										[
											styles['group-inputs']
										].join(' ')
									}>
										<div className={styles['wrap-item']}>
											<label className={styles['required']} htmlFor='shortcode'>{language?.shortcode}</label>
											<input
												id='shortcode'
												disabled={!permissions.has('subject_update')}
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
												disabled={!permissions.has('subject_update')}
												defaultValue={queryData.data.name}
												name='name'
												className={
													[
														'input-d',
														styles['input-item']
													].join(' ')
												} type='text' />
										</div>
									</div>
									{
										permissions.has('subject_update') ?
											<div className={styles['action-items']}>
												<button name='save'
													className={
														[
															'action-item-d',
															// isPending ? 'button-submitting' : ''
														].join(' ')
													}
												>{language?.save}</button>
											</div>
											: null
									}
								</form>
							</div>
							<div className={styles['header']}>
								<h2 className={styles['title']}>{language?.chapters}</h2>
							</div>
							{
								permissions.has('subject_update') ?
									<div className={
										[
											'action-bar-d'
										].join(' ')
									}
										style={{ paddingLeft: '20px' }}
									>
										<div className={
											[
												'action-item-d'
											].join(' ')
										}
											onClick={() => {
												setInsertMode(true)
											}}
										>
											<RiAddFill /> {language?.add}
										</div>
									</div>
									: null
							}
							<div className={styles['chapters-container']}>
								{
									queryData.data.chapters.map(chapter => {
										return (
											<div
												key={`chapter-${chapter.id}`}
												className={
													[
														'dashboard-card-d',
														styles['card'],
													].join(' ')
												}>
												<div className={styles['card-top']}>
													<LuBookOpenCheck />
													{chapter.name}
												</div>
												<div className={styles['card-bottom']}>{chapter.chapterNumber}</div>
											</div>
										)
									})
								}
							</div>
							{
								permissions.has('subject_delete') ?
									<div className={styles['action-items']}>
										<div
											onClick={() => {
												setShowDeletePoUp(true)
											}}
											className={
												[
													'action-item-d-white-border-red'
												].join(' ')
											}>
											<MdDeleteOutline /> {language?.delete}
										</div>
									</div>
									: null
							}
						</> : null
				}
			</div >
		</>
	)
}
