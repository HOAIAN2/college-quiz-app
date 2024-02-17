import { useEffect, useState } from 'react'
import { GiFemale, GiMale } from 'react-icons/gi'
import { GrFormNext, GrFormPrevious } from 'react-icons/gr'
import { SetURLSearchParams } from 'react-router-dom'
import useAppContext from '../hooks/useAppContext'
import useLanguage from '../hooks/useLanguage'
import { ComponentUsersTableLang } from '../models/lang'
import { Pagination } from '../models/response'
import { RoleName } from '../models/role'
import { UserDetail } from '../models/user'
import styles from '../styles/global/Table.module.css'
import StatusBadge from './StatusBadge'
import ViewUser from './ViewUser'

type UsersTableProps = {
	role: RoleName
	data?: Pagination<UserDetail>
	searchParams: URLSearchParams
	onMutateSuccess: () => void
	setSearchParams: SetURLSearchParams
	setSelectedRows: React.Dispatch<React.SetStateAction<Set<string | number>>>
}
export default function UsersTable({
	role,
	data,
	searchParams,
	onMutateSuccess,
	setSearchParams,
	setSelectedRows
}: UsersTableProps) {
	const { permissions } = useAppContext()
	const language = useLanguage<ComponentUsersTableLang>('component.users_table')
	const [viewMode, setViewMode] = useState(false)
	const [checkAll, setCheckAll] = useState(false)
	const [userId, setUserId] = useState<number>(0)
	const handleViewUser = (id: number, e: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => {
		const target = e.target as Element
		if (target.nodeName === 'INPUT') {
			const checkBox = target as HTMLInputElement
			const perPage = Number(searchParams.get('per_page')) || 10
			if (checkBox.checked) setSelectedRows(pre => {
				pre.add(id)
				if (pre.size === perPage) setCheckAll(true)
				return structuredClone(pre)
			})
			else setSelectedRows(pre => {
				pre.delete(id)
				if (pre.size !== perPage) setCheckAll(false)
				return structuredClone(pre)
			})
			return
		}
		setUserId(id)
		setViewMode(true)
	}
	const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
		const currentTarget = e.currentTarget
		const selector = `.${styles['column-select']}>input`
		const allCheckBox = document.querySelectorAll(selector)
		allCheckBox.forEach(node => {
			const element = node as HTMLInputElement
			element.checked = currentTarget.checked
		})
		if (currentTarget.checked) {
			setSelectedRows(pre => {
				pre.clear()
				data && data.data.forEach(user => {
					pre.add(user.id)
				})
				return structuredClone(pre)
			})
			setCheckAll(true)
		}
		else {
			setSelectedRows(pre => {
				pre.clear()
				return structuredClone(pre)
			})
			setCheckAll(false)
		}
	}
	useEffect(() => {
		setCheckAll(false)
	}, [data])
	return (
		<>
			{viewMode === true ?
				<ViewUser
					id={userId}
					onMutateSuccess={onMutateSuccess}
					setShowPopUp={setViewMode}
				/> : null}
			<div className={styles['table-content']}>
				<table className={styles['main']}>
					<>
						<thead>
							<tr className={styles['table-header']}>
								{
									permissions.has('user_delete') ?
										<th className={
											[
												styles['column-select'],
												styles['column']
											].join(' ')
										}>
											<input type="checkbox"
												checked={checkAll}
												onChange={handleSelectAll} />
										</th>
										: null
								}
								<th className={
									[
										styles['column'],
										styles['medium']
									].join(' ')
								}>{language?.header.shortcode}</th>
								<th className={
									[
										styles['column'],
										styles['medium']
									].join(' ')
								}>{language?.header.name}</th>
								{role === 'student' ?
									<th className={
										[
											styles['column'],
											styles['medium']
										].join(' ')
									}>{language?.header.class}</th>
									: role === 'teacher' ?
										<th className={
											[
												styles['column'],
												styles['medium']
											].join(' ')
										}>{language?.header.faculty}</th>
										: null}
								<th className={
									[
										styles['column'],
										styles['medium']
									].join(' ')
								}>{language?.header.email}</th>
								<th className={
									[
										styles['column'],
										styles['medium']
									].join(' ')
								}>{language?.header.address}</th>
								<th className={
									[
										styles['column'],
										styles['medium']
									].join(' ')
								}>
									{language?.header.status}
								</th>
							</tr>
						</thead>
						<tbody>
							{
								data ?
									data.data.map(user => {
										return (
											<tr key={user.id}
												onClick={(e) => {
													handleViewUser(user.id, e)
												}}
											>
												{
													permissions.has('user_delete') ?
														<td className={
															[
																styles['column'],
																styles['small'],
																styles['column-select']
															].join(' ')
														}>
															<input type="checkbox" />
														</td>
														: null
												}
												<td className={
													[
														styles['column'],
														styles['medium']
													].join(' ')
												}>{user.shortcode}</td>
												<td className={
													[
														styles['column'],
														styles['large'],
														styles['column-content-name'],
														user.gender == 'male' ? styles['male'] : styles['female']
													].join(' ')
												}>
													{user.gender == 'male' ? <GiMale /> : <GiFemale />}
													{`${user.lastName} ${user.firstName}`}
												</td>
												{
													role === 'student' ?
														<td className={
															[
																styles['column'],
																styles['medium']
															].join(' ')
														}>{user.schoolClass?.name}</td>
														: role === 'teacher' ?
															<td className={
																[
																	styles['column'],
																	styles['medium']
																].join(' ')
															}>{user.faculty?.name}</td>
															: null
												}
												<td className={
													[
														styles['column'],
														styles['medium']
													].join(' ')
												}>{user.email}</td>
												<td className={
													[
														styles['column'],
														styles['medium']
													].join(' ')
												}>{user.address}</td>
												<td className={
													[
														styles['column'],
														styles['column-content-status'],
														styles['small']
													].join(' ')
												}>
													{
														user.isActive
															?
															<StatusBadge color='green' content={language?.status.active} />
															: <StatusBadge color='red' content={language?.status.inactive} />
													}
												</td>
											</tr>
										)
									}) : null
							}
						</tbody>
					</>
				</table>
				{
					data ?
						<div className={styles['table-footer']}>
							<span>
								{data.from} - {data.to} / {data.total}
							</span>
							<div className={styles['table-links']}>
								{
									<div className={styles['link-content']}>
										{data.links.map(link => {
											if (isNaN(Number(link.label))) return (
												<button key={role + link.label} className={
													[
														styles['next-previous'],
													].join(' ')
												}
													onClick={() => {
														if (!link.url) return
														const url = new URL(link.url)
														searchParams.set('page', url.searchParams.get('page') || '1')
														setSearchParams(searchParams)
													}}
												>
													{link.label === '...' ? '...' : link.label.includes('Next') ? <GrFormNext /> : <GrFormPrevious />}
												</button>
											)
											return (
												<button key={role + link.label} className={
													[
														'button-d',
														!link.active ? styles['inactive'] : ''
													].join(' ')
												}
													onClick={() => {
														if (!link.url) return
														const url = new URL(link.url)
														searchParams.set('page', url.searchParams.get('page') || '1')
														setSearchParams(searchParams)
													}}
												>{link.label}</button>
											)
										})}
									</div>
								}
							</div>
						</div> : null
				}
			</div>
		</>
	)
}
