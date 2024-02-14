import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { BiExport, BiImport } from 'react-icons/bi'
import { RiAddFill } from 'react-icons/ri'
import { useSearchParams } from 'react-router-dom'
import { apiGetSubjects } from '../api/subject'
import CustomSelect from '../components/CustomSelect'
import { queryKeys } from '../constants/query-keys'
import useAppContext from '../hooks/useAppContext'
import useDebounce from '../hooks/useDebounce'
import useLanguage from '../hooks/useLanguage'
import { PageSubjectsLang } from '../models/lang'
import styles from '../styles/Subjects.module.css'

export default function Subjects() {
	const { permissions } = useAppContext()
	const [searchParams, setSearchParams] = useSearchParams()
	const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
	const queryDebounce = useDebounce(searchQuery)
	const language = useLanguage<PageSubjectsLang>('page.subjects')
	const queryData = useQuery({
		queryKey: [
			queryKeys.PAGE_SUBJECTS,
			{
				page: searchParams.get('page') || '1',
				perPage: searchParams.get('per_page') || '10',
				search: searchParams.get('search')
			}
		],
		queryFn: () => apiGetSubjects({
			page: Number(searchParams.get('page')),
			perPage: Number(searchParams.get('per_page')),
			search: searchParams.get('search') as string
		})
	})
	useEffect(() => {
		if (!searchParams.get('search') && !queryDebounce) return
		if (queryDebounce === '') searchParams.delete('search')
		else searchParams.set('search', queryDebounce)
		setSearchParams(searchParams)
	}, [queryDebounce, searchParams, setSearchParams])
	queryData.data && console.log(queryData.data)
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
							// onClick={() => {
							// 	setInsertMode(true)
							// }}
							>
								<RiAddFill /> {language?.add}
							</div>
							: null
					}
					{
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
					}
					{
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
					}
				</div>
				<div className={styles['page-content']}>
					<div className={styles['filter-form']}>
						<div className={styles['wrap-input-item']}>
							<label htmlFor="">{language?.filter.perPage}</label>
							<CustomSelect
								defaultOption={
									{
										label: searchParams.get('per_page') || '10',
										value: searchParams.get('per_page') || '10'
									}
								}
								options={[
									{
										label: '10',
										value: '10'
									},
									{
										label: '20',
										value: '20'
									},
									{
										label: '30',
										value: '30'
									},
									{
										label: '40',
										value: '40'
									},
									{
										label: '50',
										value: '50'
									},
								]}
								onChange={(option) => {
									searchParams.set('per_page', option.value)
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
				</div>
			</div>
		</>
	)
}
