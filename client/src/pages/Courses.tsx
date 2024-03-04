import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { LuBookOpenCheck } from 'react-icons/lu'
import { RiAddFill } from 'react-icons/ri'
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom'
import { apiGetCourses } from '../api/course'
import { apiGetSemesterById } from '../api/semester'
import Loading from '../components/Loading'
import { queryKeys } from '../constants/query-keys'
import useAppContext from '../hooks/useAppContext'
import useDebounce from '../hooks/useDebounce'
import useLanguage from '../hooks/useLanguage'
import { PageCoursesLang } from '../models/lang'
import { Semester } from '../models/semester'
import styles from '../styles/global/CardPage.module.css'

export default function Courses() {
	const { state } = useLocation() as { state: Semester | null }
	const [semesterDetail, setSemesterDetail] = useState(state)
	const { permissions, DOM } = useAppContext()
	const { id } = useParams()
	const [searchParams, setSearchParams] = useSearchParams()
	const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
	const queryDebounce = useDebounce(searchQuery)
	const language = useLanguage<PageCoursesLang>('page.courses')
	const queryData = useQuery({
		queryKey: [queryKeys.COURSES_PAGE, {
			search: queryDebounce,
			semesterId: Number(id)
		}],
		queryFn: () => apiGetCourses({
			search: queryDebounce,
			semesterId: Number(id) || undefined
		})
	})
	useEffect(() => {
		apiGetSemesterById(String(id))
			.then(res => {
				setSemesterDetail(res)
			})
	}, [id])
	useEffect(() => {
		if (!searchParams.get('search') && !queryDebounce) return
		if (queryDebounce === '') searchParams.delete('search')
		else searchParams.set('search', queryDebounce)
		setSearchParams(searchParams)
	}, [queryDebounce, searchParams, setSearchParams])
	useEffect(() => {
		if (language) {
			document.title = language?.title.replace('@semester', semesterDetail?.name || '')
			if (DOM.titleRef.current) DOM.titleRef.current.textContent = document.title
		}
	}, [semesterDetail, language, DOM.titleRef])
	if (!semesterDetail) return null
	return (
		<>
			{/* {showCreatePopUp === true ?
				<CreateSubject
					onMutateSuccess={onMutateSuccess}
					setShowPopUp={setShowCreatePopUp}
				/> : null} */}
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
					<div className={styles['wrap-card-container']}>
						<div className={styles['card-container']}>
							{queryData.data ?
								queryData.data.map(item => {
									return (
										<Link
											key={`subject-${item.id}`}
											to={String(item.id)}
											className={
												[
													'dashboard-card-d',
													styles['card'],
												].join(' ')
											}>
											<div className={styles['card-top']}>
												<LuBookOpenCheck />
												{item.name}
											</div>
											<div className={styles['card-bottom']}>{item.shortcode}</div>
										</Link>
									)
								}) : null}
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
