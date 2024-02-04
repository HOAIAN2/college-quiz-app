import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { apiGetRolePermissions, apiUpdateRolePermissions } from '../api/role-permission'
import Loading from '../components/Loading'
import useAppContext from '../hooks/useAppContext'
import useLanguage from '../hooks/useLanguage'
import { PageRolePermissionsLang } from '../models/lang'
import styles from '../styles/RolePermissions.module.css'

export default function RolePermissions() {
	const { DOM, permissions } = useAppContext()
	const language = useLanguage<PageRolePermissionsLang>('page.role_permissions')
	const { id } = useParams()
	const queryData = useQuery({
		queryKey: ['role-permissions', id],
		queryFn: () => apiGetRolePermissions(Number(id))
	})
	const handleUpdatePermission = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const form = e.target as HTMLFormElement
		const formData = new FormData(form)
		const permissionIds: (string | number)[] = []
		formData.forEach(value => {
			permissionIds.push(value.toString())
		})
		if (!permissions.has('role_permission_grant')) return
		if (!id) return
		await apiUpdateRolePermissions(id, permissionIds)
	}
	const hasPermission = (name: string) => {
		const result = queryData.data?.role.permissions.find((item) => {
			return item.name === name
		})
		return Boolean(result)
	}
	const { mutate, isPending } = useMutation({
		mutationFn: handleUpdatePermission,
		onSuccess: () => {
			queryData.refetch()
		}
	})
	useEffect(() => {
		if (queryData.data) {
			document.title = language ?
				language[queryData.data.role.name + 'Permissions' as keyof typeof language] : ''
			if (DOM.titleRef.current) {
				DOM.titleRef.current.textContent = document.title
			}
		}
	}, [DOM.titleRef, language, queryData.data])
	useEffect(() => {
		queryData.refetch()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [language])
	return (
		<div
			className={
				[
					'dashboard-d',
					styles['role-permission-container']
				].join(' ')
			}
		>
			{queryData.isLoading || isPending ?
				<Loading />
				: null}
			{
				queryData.data ?
					<form
						onSubmit={e => { mutate(e) }}
						className={styles['permission-container']}>
						<ul className={styles['permission-list']}>
							{queryData.data.appPermissions.map(item => {
								return (
									<li
										className={styles['permission-item']}
										key={`'permission-${item.id}`}
									>
										<input id={item.name}
											type='checkbox'
											name='ids[]'
											value={item.id}
											defaultChecked={hasPermission(item.name)}
										/>
										<label htmlFor={item.name} className={styles['label']}>{item.displayName}</label>
									</li>
								)
							})}
						</ul>
						<div className={styles['action-items']}>
							<button name='save' className='action-item-d'>{language?.save}</button>
						</div>
					</form>
					: null
			}
		</div>
	)
}
