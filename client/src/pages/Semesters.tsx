import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { LuBookOpenCheck } from 'react-icons/lu'
import { RiAddFill } from 'react-icons/ri'
import { useSearchParams } from 'react-router-dom'
import { apiGetSemesters } from '../api/semester'
import CreateSemester from '../components/CreateSemester'
import Loading from '../components/Loading'
import { queryKeys } from '../constants/query-keys'
import useAppContext from '../hooks/useAppContext'
import useDebounce from '../hooks/useDebounce'
import useLanguage from '../hooks/useLanguage'
import { PageSemestersLang } from '../models/lang'
import styles from '../styles/global/CardPage.module.css'

export default function Semesters() {
	const { permissions, appLanguage } = useAppContext()
	const [searchParams, setSearchParams] = useSearchParams()
	const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
	const queryDebounce = useDebounce(searchQuery)
	const language = useLanguage<PageSemestersLang>('page.subjects')
	const [showCreatePopUp, setShowCreatePopUp] = useState(false)
	const queryClient = useQueryClient()
	const queryData = useQuery({
		queryKey: [queryKeys.PAGE_SEMESTERS, { search: queryDebounce }],
		queryFn: () => apiGetSemesters(queryDebounce)
	})
	useEffect(() => {
		if (!searchParams.get('search') && !queryDebounce) return
		if (queryDebounce === '') searchParams.delete('search')
		else searchParams.set('search', queryDebounce)
		setSearchParams(searchParams)
	}, [queryDebounce, searchParams, setSearchParams])
	const onMutateSuccess = () => {
		[queryKeys.PAGE_SEMESTERS].forEach(key => {
			queryClient.refetchQueries({ queryKey: [key] })
		})
	}
	return (
		<>
			{showCreatePopUp === true ?
				<CreateSemester
					onMutateSuccess={onMutateSuccess}
					setShowPopup={setShowCreatePopUp}
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
									setShowCreatePopUp(true)
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
					<div className={styles['wrap-card-container']}>
						<div className={styles['card-container']}>
							{queryData.data ?
								queryData.data.map(item => {
									return (
										<div
											key={`subject-${item.id}`}
											// to={String(item.id)}
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
											<div className={styles['card-bottom']}>
												{
													[
														new Date(item.startDate).toLocaleDateString(appLanguage.language),
														new Date(item.endDate).toLocaleDateString(appLanguage.language),
													].join(' - ')
												}
											</div>
										</div>
									)
								}) : null}
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
