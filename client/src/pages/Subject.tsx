import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { SyntheticEvent, useEffect, useState } from 'react'
import { LuBookOpenCheck } from 'react-icons/lu'
import { MdDeleteOutline } from 'react-icons/md'
import { RiAddFill } from 'react-icons/ri'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { apiDeleteSubject, apiGetSubjectById, apiUpdateSubject } from '../api/subject'
import CreateChapter from '../components/CreateChapter'
import Loading from '../components/Loading'
import ViewChapter from '../components/ViewChapter'
import YesNoPopUp from '../components/YesNoPopUp'
import { queryKeys } from '../constants/query-keys'
import useAppContext from '../hooks/useAppContext'
import useLanguage from '../hooks/useLanguage'
import { Chapter } from '../models/chapter'
import { PageSubjectLang } from '../models/lang'
import styles from '../styles/Subject.module.css'
import createFormUtils from '../utils/createFormUtils'

export default function Subject() {
	const { id } = useParams()
	const { permissions } = useAppContext()
	const language = useLanguage<PageSubjectLang>('page.subject')
	const [currentChapter, setCurrentChapter] = useState<Chapter>()
	const queryClient = useQueryClient()
	const [showDeletePopUp, setShowDeletePopUp] = useState(false)
	const [showViewChapterPopUp, setShowViewChapterPopUp] = useState(false)
	const [showCreateChapterPopUp, setShowCreateChapterPopUp] = useState(false)
	const navigate = useNavigate()
	const formUtils = createFormUtils(styles)
	const queryData = useQuery({
		queryKey: [queryKeys.PAGE_SUBJECT, { id: id }],
		queryFn: () => apiGetSubjectById(String(id))
	})
	const handleUpdateSubject = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
		e.preventDefault()
		if (!permissions.has('subject_update')) return
		document.querySelector(`.${styles['form-data']}`)?.querySelectorAll('input[name]').forEach(node => {
			const element = node as HTMLInputElement
			element.classList.remove('error')
			formUtils.getParentElement(element)?.removeAttribute('data-error')
		})
		const form = e.target as HTMLFormElement
		const formData = new FormData(form)
		queryData.data && await apiUpdateSubject(formData, queryData.data.id)
	}
	const { mutate, isPending } = useMutation({
		mutationFn: handleUpdateSubject,
		onError: (error: object) => { formUtils.showFormError(error) },
		onSuccess: () => { queryData.refetch() }
	})
	const handleDeletetSubject = async () => {
		await apiDeleteSubject(String(id))
	}
	const onMutateSuccess = () => {
		[queryKeys.PAGE_SUBJECTS].forEach(key => {
			queryClient.refetchQueries({ queryKey: [key] })
		})
		navigate('/subjects')
	}
	const defaultChapterNumber = queryData.data && queryData.data.chapters.length !== 0
		? Math.max(...queryData.data.chapters.map(chapter => chapter.chapterNumber)) + 1 : 1
	useEffect(() => {
		return () => {
			queryClient.removeQueries({ queryKey: [queryKeys.PAGE_SUBJECT, { id: id }] })
		}
	}, [id, queryClient])
	return (
		<>
			{
				showViewChapterPopUp && currentChapter ?
					<ViewChapter
						data={currentChapter}
						onMutateSuccess={() => { queryData.refetch() }}
						setShowPopUp={setShowViewChapterPopUp}
					/>
					: null
			}
			{showCreateChapterPopUp === true ?
				<CreateChapter
					defaultChapterNumber={defaultChapterNumber}
					subjectId={String(id)}
					onMutateSuccess={() => { queryData.refetch() }}
					setShowPopUp={setShowCreateChapterPopUp}
				/> : null}
			{showDeletePopUp === true ?
				<YesNoPopUp
					message={language?.deleteMessage || ''}
					mutateFunction={handleDeletetSubject}
					setShowPopUp={setShowDeletePopUp}
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
									onInput={e => { formUtils.handleOnInput(e) }}
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
										permissions.hasAnyFormList(['subject_update', 'subject_delete']) ?
											<div className={styles['action-items']}>
												{
													permissions.has('subject_update') ?
														<button name='save'
															className={
																[
																	'action-item-d',
																	isPending ? 'button-submitting' : ''
																].join(' ')
															}
														>{language?.save}</button> : null
												}
												{
													permissions.has('subject_delete') ?
														<button
															type='button'
															onClick={() => {
																setShowDeletePopUp(true)
															}}
															className={
																[
																	'action-item-d-white-border-red'
																].join(' ')
															}>
															<MdDeleteOutline /> {language?.delete}
														</button>
														: null
												}
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
												setShowCreateChapterPopUp(true)
											}}
										>
											<RiAddFill /> {language?.add}
										</div>
									</div>
									: null
							}
							<div className={styles['chapters-container']}>
								{
									queryData.data.chapters.sort((a, b) =>
										a.chapterNumber - b.chapterNumber
									)
										.map(chapter => {
											return (
												<div
													key={`chapter-${chapter.id}`}
													className={
														[
															'dashboard-card-d',
															styles['card'],
														].join(' ')
													}
													onClick={() => {
														setCurrentChapter(chapter)
														setShowViewChapterPopUp(true)
													}}
												>
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
								permissions.has('question_view') ?
									<Link
										to={`/questions/${id}`}
										state={queryData.data}
										className={styles['header']}>
										<h2 className={styles['title']}>
											{language?.questions}
										</h2>
									</Link>
									: null
							}
						</> : null
				}
			</div >
		</>
	)
}
