import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { LuBookOpenCheck } from 'react-icons/lu'
import { RiAddFill } from 'react-icons/ri'
import { Link, useSearchParams } from 'react-router-dom'
import { apiGetCourses } from '../api/course'
import { apiAutoCompleteSemester } from '../api/semester'
import CustomDataList from '../components/CustomDataList'
import Loading from '../components/Loading'
import { queryKeys } from '../constants/query-keys'
import useAppContext from '../hooks/useAppContext'
import useDebounce from '../hooks/useDebounce'
import useLanguage from '../hooks/useLanguage'
import { PageCoursesLang } from '../models/lang'
import styles from '../styles/global/CardPage.module.css'

export default function Courses() {
	const { permissions } = useAppContext()
	const [searchParams, setSearchParams] = useSearchParams()
	const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
	const queryDebounce = useDebounce(searchQuery)
	const [querySemester, setQuerySemester] = useState('')
	const debounceQuerySemester = useDebounce(querySemester)
	const language = useLanguage<PageCoursesLang>('page.courses')
	// const [showCreatePopUp, setShowCreatePopUp] = useState(false)
	// const queryClient = useQueryClient()
	const queryData = useQuery({
		queryKey: [queryKeys.COURSES_PAGE, {
			search: queryDebounce,
			semesterId: Number(searchParams.get('semester_id'))
		}],
		queryFn: () => apiGetCourses({
			search: queryDebounce,
			semesterId: Number(searchParams.get('semester_id')) || undefined
		})
	})
	const semesterQueryData = useQuery({
		queryKey: [queryKeys.AUTO_COMPLETE_SEMESTER, { search: debounceQuerySemester }],
		queryFn: () => apiAutoCompleteSemester(debounceQuerySemester),
		enabled: debounceQuerySemester ? true : false
	})
	useEffect(() => {
		if (!searchParams.get('search') && !queryDebounce) return
		if (queryDebounce === '') searchParams.delete('search')
		else searchParams.set('search', queryDebounce)
		setSearchParams(searchParams)
	}, [queryDebounce, searchParams, setSearchParams])
	// const onMutateSuccess = () => {
	// 	[queryKeys.COURSES_PAGE].forEach(key => {
	// 		queryClient.refetchQueries({ queryKey: [key] })
	// 	})
	// }
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
					{/* {
						permissions.has('user_create') ?
							<div className={
								[
									'action-item-d-white'
								].join(' ')
							}
							// onClick={() => {
							// 	setImportMode(true)
							// }}
							>
								<BiImport /> {language?.import}
							</div>
							: null
					} */}
					{/* {
						permissions.has('user_view') ?
							<div className={
								[
									'action-item-d-white'
								].join(' ')
							}
							// onClick={() => {
							// 	setExportMode(true)
							// }}
							>
								<BiExport /> {language?.export}
							</div>
							: null
					} */}
				</div>
				<div className={styles['page-content']}>
					{queryData.isLoading ?
						<Loading />
						: null}
					<div className={styles['filter-form']}>
						<div className={styles['wrap-input-item']}>
							<label htmlFor='semester_id'>{language?.filter.semester}</label>
							<CustomDataList
								name='semester_id'
								onInput={e => {
									setQuerySemester(e.currentTarget.value)
								}}
								options={semesterQueryData.data ? semesterQueryData.data.map(item => {
									return {
										label: item.name,
										value: String(item.id)
									}
								}) : []}
								onChange={(option) => {
									searchParams.set('semester_id', option.value)
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
