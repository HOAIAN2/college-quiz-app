import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import {
	BiExport,
	BiImport
} from 'react-icons/bi'
import { MdDeleteOutline } from 'react-icons/md'
import { PiMicrosoftExcelLogoFill } from 'react-icons/pi'
import {
	RiAddFill
} from 'react-icons/ri'
import { useSearchParams } from 'react-router-dom'
import { apiDeleteUserByIds, apiGetUsersByType, apiImportUsers } from '../api/user'
import CreateUser from '../components/CreateUser'
import CustomSelect from '../components/CustomSelect'
import ExportUsers from '../components/ExportUsers'
import ImportData from '../components/ImportData'
import Loading from '../components/Loading'
import UsersTable from '../components/UsersTable'
import YesNoPopUp from '../components/YesNoPopUp'
import { queryKeys } from '../constants/query-keys'
import useAppContext from '../hooks/useAppContext'
import useDebounce from '../hooks/useDebounce'
import useLanguage from '../hooks/useLanguage'
import { PageUsersLang } from '../models/lang'
import { RoleName } from '../models/role'
import styles from '../styles/global/TablePage.module.css'
import css from '../utils/css'
import { importTemplateFileUrl } from '../utils/template'

type UsersProps = {
	role: RoleName
}
export default function Users({
	role
}: UsersProps) {
	const language = useLanguage<PageUsersLang>('page.users')
	const { permissions } = useAppContext()
	const [showCreatePopUp, setShowCreatePopUp] = useState(false)
	const [showExportPopUp, setShowExportPopUp] = useState(false)
	const [showImportPopUp, setShowImportPopUp] = useState(false)
	const [showDeletePopUp, setShowDeletePopUp] = useState(false)
	const [selectedUserIds, setSelectedUserIds] = useState<Set<string | number>>(new Set())
	const [searchParams, setSearchParams] = useSearchParams()
	const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
	const queryDebounce = useDebounce(searchQuery)
	const queryClient = useQueryClient()
	const queryData = useQuery({
		queryKey: [
			queryKeys.PAGE_USERS,
			{
				role: role,
				page: searchParams.get('page') || '1',
				perPage: searchParams.get('per_page') || '10',
				search: queryDebounce
			}
		],
		queryFn: () => apiGetUsersByType({
			role: role,
			page: Number(searchParams.get('page')),
			perPage: Number(searchParams.get('per_page')),
			search: queryDebounce
		})
	})
	const importFunction = async (file: File) => {
		return apiImportUsers(file, role)
	}
	const handleDeleteUsers = async () => {
		await apiDeleteUserByIds(Array.from(selectedUserIds))
	}
	const onMutateSuccess = () => {
		[queryKeys.PAGE_USERS, queryKeys.PAGE_DASHBOARD].forEach(key => {
			queryClient.refetchQueries({ queryKey: [key] })
		})
	}
	useEffect(() => {
		setSelectedUserIds(new Set())
	}, [queryData.data])
	useEffect(() => {
		return () => {
			if (!window.location.pathname.includes(role)) setSearchParams(new URLSearchParams())
		}
	})
	useEffect(() => {
		if (!searchParams.get('search') && !queryDebounce) return
		if (queryDebounce === '') searchParams.delete('search')
		else searchParams.set('search', queryDebounce)
		setSearchParams(searchParams)
	}, [queryDebounce, searchParams, setSearchParams])
	return (
		<>
			{showCreatePopUp === true ?
				<CreateUser
					role={role}
					onMutateSuccess={onMutateSuccess}
					setShowPopUp={setShowCreatePopUp}
				/> : null}
			{showExportPopUp === true ?
				<ExportUsers
					role={role}
					setExportMode={setShowExportPopUp}
				/> : null}
			{showDeletePopUp === true ?
				<YesNoPopUp
					message={language?.deleteMessage.replace('@n', String(selectedUserIds.size)) || ''}
					mutateFunction={handleDeleteUsers}
					setShowPopUp={setShowDeletePopUp}
					onMutateSuccess={onMutateSuccess}
					langYes={language?.langYes}
					langNo={language?.langNo}
				/> : null}
			{showImportPopUp === true ?
				<ImportData
					title={[
						language?.import,
						language ? language[role] : ''
					].join(' ')
					}
					icon={<PiMicrosoftExcelLogoFill />}
					teamplateUrl={importTemplateFileUrl[role]}
					importFunction={importFunction}
					setImportMode={setShowImportPopUp}
					onMutateSuccess={onMutateSuccess}
				/> : null}
			<main className='dashboard-d'>
				{
					permissions.hasAnyFormList(['user_view', 'user_create', 'user_update', 'user_delete'])
						?
						<section className='action-bar-d'>
							{
								permissions.has('user_create') ?
									<div className='action-item-d'
										onClick={() => {
											setShowCreatePopUp(true)
										}}
									>
										<RiAddFill /> {language?.add}
									</div>
									: null
							}
							{
								permissions.has('user_create') ?
									<div className='action-item-d-white'
										onClick={() => {
											setShowImportPopUp(true)
										}}
									>
										<BiImport /> {language?.import}
									</div>
									: null
							}
							{
								permissions.has('user_view') ?
									<div className='action-item-d-white'
										onClick={() => {
											setShowExportPopUp(true)
										}}
									>
										<BiExport /> {language?.export}
									</div>
									: null
							}
							{
								selectedUserIds.size > 0 && permissions.has('user_delete') ?
									<div
										onClick={() => {
											setShowDeletePopUp(true)
										}}
										className='action-item-d-white-border-red'>
										<MdDeleteOutline /> {language?.delete}
									</div>
									: null
							}
						</section>
						: null
				}
				<section className={styles['table-page-content']}>
					<div className={styles['filter-form']}>
						<div className={styles['wrap-input-item']}>
							<label>{language?.filter.perPage}</label>
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
								className={styles['custom-select']}
							/>
						</div>
						<div className={styles['wrap-input-item']}>
							<label>{language?.filter.search}</label>
							<input
								onInput={(e) => {
									setSearchQuery(e.currentTarget.value)
								}}
								defaultValue={queryDebounce}
								className={css('input-d', styles['input-item'])}
							/>
						</div>
					</div>
					<div className={styles['wrap-table']}>
						{
							queryData.isLoading ? <Loading /> : null
						}
						{!queryData.isError ?
							<UsersTable
								role={role}
								data={queryData.data}
								searchParams={searchParams}
								onMutateSuccess={onMutateSuccess}
								setSearchParams={setSearchParams}
								setSelectedRows={setSelectedUserIds}
							/>
							: null}
					</div>
				</section>
			</main>
		</>
	)
}
