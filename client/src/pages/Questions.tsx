import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { AiOutlineQuestionCircle } from 'react-icons/ai'
import { RiAddFill } from 'react-icons/ri'
import { useLocation, useParams, useSearchParams } from 'react-router-dom'
import { apiGetQuestions } from '../api/question'
import { apiGetSubjectById } from '../api/subject'
import CustomSelect from '../components/CustomSelect'
import Loading from '../components/Loading'
import { queryKeys } from '../constants/query-keys'
import useAppContext from '../hooks/useAppContext'
import useDebounce from '../hooks/useDebounce'
import useLanguage from '../hooks/useLanguage'
import { PageQuestionsLang } from '../models/lang'
import { SubjectDetail } from '../models/subject'
import styles from '../styles/global/CardPage.module.css'

export default function Questions() {
	const { state } = useLocation() as { state: SubjectDetail | null }
	const [subjectDetail, setSubjectDetail] = useState(state)
	const [searchParams, setSearchParams] = useSearchParams()
	const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
	const queryDebounce = useDebounce(searchQuery)
	const { permissions } = useAppContext()
	const { id } = useParams()
	const language = useLanguage<PageQuestionsLang>('page.questions')
	const queryData = useQuery({
		queryKey: [
			queryKeys.PAGE_QUESTIONS,
			{
				chapter: searchParams.get('chapter') || '10',
				search: queryDebounce
			},
		],
		queryFn: () => apiGetQuestions({
			subjectId: String(id),
			chapterId: searchParams.get('chapter'),
			search: queryDebounce
		})
	})
	useEffect(() => {
		apiGetSubjectById(String(id)).then(res => {
			setSubjectDetail(res)
		})
	}, [id])
	useEffect(() => {
		if (!searchParams.get('search') && !queryDebounce) return
		if (queryDebounce === '') searchParams.delete('search')
		else searchParams.set('search', queryDebounce)
		setSearchParams(searchParams)
	}, [queryDebounce, searchParams, setSearchParams])
	if (!subjectDetail) return null
	return (
		<>
			<div
				className={
					[
						'dashboard-d'
					].join(' ')
				}
			>
				<div className={
					[
						'action-bar-d'
					].join(' ')
				}>
					{
						permissions.has('user_create') ?
							<div className={
								[
									'action-item-d'
								].join(' ')
							}
								onClick={() => {
									// setShowCreatePopUp(true)
								}}
							>
								<RiAddFill /> {language?.add}
							</div>
							: null
					}
				</div>
				<div className={styles['page-content']}>
					{queryData.isLoading ?
						<Loading />
						: null}
					<div className={styles['filter-form']}>
						<div className={styles['wrap-input-item']}>
							<label htmlFor="">{language?.filter.chapter}</label>
							<CustomSelect
								defaultOption={
									{
										label: language?.unselect,
										value: ''
									}
								}
								options={
									[
										{
											label: language?.unselect,
											value: ''
										},
										...subjectDetail.chapters.map(chapter => ({
											value: String(chapter.id),
											label: `${chapter.chapterNumber}. ${chapter.name}`
										}))]
								}
								onChange={(option) => {
									if (option.value != '') searchParams.set('chapter', option.value)
									else searchParams.delete('chapter')
									setSearchParams(searchParams)
								}}
								className={
									[
										styles['custom-select']
									].join(' ')
								}
							/>
						</div>
						<div className={styles['wrap-input-item']}>
							<label htmlFor="">{language?.filter.search}</label>
							<input
								onInput={(e) => {
									setSearchQuery(e.currentTarget.value)
								}}
								name='search'
								defaultValue={queryDebounce}
								className={
									[
										'input-d',
										styles['input-item']
									].join(' ')
								} type="text" />
						</div>
					</div>
					<div className={styles['card-container']}>
						{queryData.data ?
							queryData.data.map(item => {
								return (
									<div
										key={`subject-${item.id}`}
										className={
											[
												'dashboard-card-d',
												styles['card'],
											].join(' ')
										}>
										<div className={styles['card-top']}>
											<AiOutlineQuestionCircle />
											{item.content}
										</div>
										<div className={styles['card-bottom']}>
											{language?.questionLevel[item.level]}
										</div>
									</div>
								)
							}) : null}
					</div>
				</div>
			</div>
		</>
	)
}
