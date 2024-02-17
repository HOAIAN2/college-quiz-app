import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { LuBookOpenCheck } from 'react-icons/lu'
import { RiAddFill } from 'react-icons/ri'
import { Link, useSearchParams } from 'react-router-dom'
import { apiGetSubjects } from '../api/subject'
import CreateSubject from '../components/CreateSubject'
import Loading from '../components/Loading'
import { queryKeys } from '../constants/query-keys'
import useAppContext from '../hooks/useAppContext'
import useDebounce from '../hooks/useDebounce'
import useLanguage from '../hooks/useLanguage'
import { PageSubjectsLang } from '../models/lang'
import styles from '../styles/global/CardPage.module.css'

export default function Subjects() {
	const { permissions } = useAppContext()
	const [searchParams, setSearchParams] = useSearchParams()
	const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
	const queryDebounce = useDebounce(searchQuery)
	const language = useLanguage<PageSubjectsLang>('page.subjects')
	const [insertMode, setInsertMode] = useState(false)
	const queryClient = useQueryClient()
	const queryData = useQuery({
		queryKey: [queryKeys.PAGE_SUBJECTS, { search: queryDebounce }],
		queryFn: () => apiGetSubjects(queryDebounce)
	})
	useEffect(() => {
		if (!searchParams.get('search') && !queryDebounce) return
		if (queryDebounce === '') searchParams.delete('search')
		else searchParams.set('search', queryDebounce)
		setSearchParams(searchParams)
	}, [queryDebounce, searchParams, setSearchParams])
	const onMutateSuccess = () => {
		[queryKeys.PAGE_SUBJECTS].forEach(key => {
			queryClient.refetchQueries({ queryKey: [key] })
		})
	}
	return (
		<>
			{insertMode === true ?
				<CreateSubject
					onMutateSuccess={onMutateSuccess}
					setShowPopUp={setInsertMode}
				/> : null}
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
									setInsertMode(true)
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
		</>
	)
}
