import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { MdDeleteOutline } from 'react-icons/md'
import { RiAddFill } from 'react-icons/ri'
import { useSearchParams } from 'react-router-dom'
import { apiDeleteFacultiesByIds, apiGetFaculties } from '../api/faculty'
import CreateFaculty from '../components/CreateFaculty'
import CustomSelect from '../components/CustomSelect'
import FacultiesTable from '../components/FacultiesTable'
import Loading from '../components/Loading'
import YesNoPopUp from '../components/YesNoPopUp'
import { queryKeys } from '../constants/query-keys'
import useAppContext from '../hooks/useAppContext'
import useDebounce from '../hooks/useDebounce'
import useLanguage from '../hooks/useLanguage'
import { PageFacultiesLang } from '../models/lang'
import styles from '../styles/global/TablePage.module.css'

export default function Faculties() {
	const { permissions } = useAppContext()
	const language = useLanguage<PageFacultiesLang>('page.faculties')
	const [showCreatePopUp, setShowCreatePopUp] = useState(false)
	const [showDeletePopUp, setShowDeletePopUp] = useState(false)
	const [searchParams, setSearchParams] = useSearchParams()
	const queryClient = useQueryClient()
	const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
	const queryDebounce = useDebounce(searchQuery)
	const [selectedFacultyIds, setSelectedFacultyIds] = useState<Set<string | number>>(new Set())
	const queryData = useQuery({
		queryKey: [
			queryKeys.PAGE_FACULTIES,
			{
				page: searchParams.get('page') || '1',
				perPage: searchParams.get('per_page') || '10',
				search: queryDebounce
			},
		],
		queryFn: () => apiGetFaculties({
			page: Number(searchParams.get('page')),
			perPage: Number(searchParams.get('per_page')),
			search: queryDebounce
		})
	})
	const handleDeleteFaculties = async () => {
		await apiDeleteFacultiesByIds(Array.from(selectedFacultyIds))
	}
	const onMutateSuccess = () => {
		[queryKeys.PAGE_FACULTIES].forEach(key => {
			queryClient.refetchQueries({ queryKey: [key] })
		})
	}
	useEffect(() => {
		setSelectedFacultyIds(new Set())
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
				<CreateFaculty
					onMutateSuccess={onMutateSuccess}
					setShowPopUp={setShowCreatePopUp}
				/> : null}
			{showDeletePopUp === true ?
				<YesNoPopUp
					message={language?.deleteMessage.replace('@n', String(selectedFacultyIds.size)) || ''}
					mutateFunction={handleDeleteFaculties}
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
					permissions.hasAnyFormList(['faculty_create', 'faculty_delete'])
						?
						<div className={
							[
								'action-bar-d'
							].join(' ')
						}>
							{
								permissions.has('faculty_create') ?
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
								selectedFacultyIds.size > 0 && permissions.has('faculty_delete') ?
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
							<FacultiesTable
								data={queryData.data}
								searchParams={searchParams}
								onMutateSuccess={onMutateSuccess}
								setSearchParams={setSearchParams}
								setSelectedRows={setSelectedFacultyIds}
							/>
							: null}
					</div>
				</div>
			</div>
		</>
	)
}
