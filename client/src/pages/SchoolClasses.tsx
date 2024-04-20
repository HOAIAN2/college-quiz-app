import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { MdDeleteOutline } from 'react-icons/md'
import { RiAddFill } from 'react-icons/ri'
import { useSearchParams } from 'react-router-dom'
import { apiDeleteSchoolClassIds, apiGetSchoolClasses } from '../api/school-class'
import CreateSchoolClass from '../components/CreateSchoolClass'
import CustomSelect from '../components/CustomSelect'
import Loading from '../components/Loading'
import SchoolClassesTable from '../components/SchoolClassesTable'
import YesNoPopUp from '../components/YesNoPopUp'
import { queryKeys } from '../constants/query-keys'
import useAppContext from '../hooks/useAppContext'
import useDebounce from '../hooks/useDebounce'
import useLanguage from '../hooks/useLanguage'
import { PageSchoolClassesLang } from '../models/lang'
import styles from '../styles/global/TablePage.module.css'

export default function SchoolClasses() {
	const { permissions } = useAppContext()
	const language = useLanguage<PageSchoolClassesLang>('page.school_classes')
	const [searchParams, setSearchParams] = useSearchParams()
	const [showCreatePopUp, setShowCreatePopUp] = useState(false)
	const [showDeletePopUp, setShowDeletePopUp] = useState(false)
	const [selectedSchoolClassIds, setSelectedSchoolClassIds] = useState<Set<string | number>>(new Set())
	const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
	const queryDebounce = useDebounce(searchQuery)
	const queryClient = useQueryClient()
	const queryData = useQuery({
		queryKey: [
			queryKeys.PAGE_SCHOOL_CLASSES,
			{
				page: searchParams.get('page') || '1',
				perPage: searchParams.get('per_page') || '10',
				search: queryDebounce
			},
		],
		queryFn: () => apiGetSchoolClasses({
			page: Number(searchParams.get('page')),
			perPage: Number(searchParams.get('per_page')),
			search: queryDebounce
		})
	})
	const handleDeleteSchoolClasses = async () => {
		await apiDeleteSchoolClassIds(Array.from(selectedSchoolClassIds))
	}
	const onMutateSuccess = () => {
		[queryKeys.PAGE_SCHOOL_CLASSES].forEach(key => {
			queryClient.refetchQueries({ queryKey: [key] })
		})
	}
	useEffect(() => {
		setSelectedSchoolClassIds(new Set())
	}, [queryData.data])
	useEffect(() => {
		if (!searchParams.get('search') && !queryDebounce) return
		if (queryDebounce === '') searchParams.delete('search')
		else searchParams.set('search', queryDebounce)
		setSearchParams(searchParams)
	}, [queryDebounce, searchParams, setSearchParams])
	return (
		<>
			{showCreatePopUp === true ?
				<CreateSchoolClass
					onMutateSuccess={onMutateSuccess}
					setShowPopUp={setShowCreatePopUp}
				/> : null}
			{showDeletePopUp === true ?
				<YesNoPopUp
					message={language?.deleteMessage.replace('@n', String(selectedSchoolClassIds.size)) || ''}
					mutateFunction={handleDeleteSchoolClasses}
					setShowPopUp={setShowDeletePopUp}
					onMutateSuccess={onMutateSuccess}
					langYes={language?.langYes}
					langNo={language?.langNo}
				/> : null}
			<div
				className={
					[
						'dashboard-d'
					].join(' ')
				}
			>
				{
					permissions.hasAnyFormList(['school_class_create', 'school_class_delete'])
						?
						<div className={
							[
								'action-bar-d'
							].join(' ')
						}>
							{
								permissions.has('school_class_create') ?
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
							{
								selectedSchoolClassIds.size > 0 && permissions.has('school_class_delete') ?
									<div
										onClick={() => {
											setShowDeletePopUp(true)
										}}
										className={
											[
												'action-item-d-white-border-red'
											].join(' ')
										}>
										<MdDeleteOutline /> {language?.delete}
									</div>
									: null
							}
						</div>
						: null
				}
				<div className={styles['table-page-content']}>
					<div className={styles['filter-form']}>
						<div className={styles['wrap-input-item']}>
							<label htmlFor="">{language?.filter.perPage}</label>
							<CustomSelect
								defaultOption={
									{
										label: '10',
										value: '10'
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
					<div className={styles['wrap-table']}>
						{queryData.isLoading ?
							<Loading />
							: null}
						{!queryData.isError ?
							<SchoolClassesTable
								data={queryData.data}
								searchParams={searchParams}
								onMutateSuccess={onMutateSuccess}
								setSearchParams={setSearchParams}
								setSelectedRows={setSelectedSchoolClassIds}
							/>
							: null}
					</div>
				</div>
			</div>
		</>
	)
}
