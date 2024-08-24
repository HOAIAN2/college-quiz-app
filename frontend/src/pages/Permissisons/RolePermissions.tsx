import appStyles from '@styles/App.module.css';
import styles from './styles/RolePermissions.module.css';

import { apiGetRolePermissions, apiUpdateRolePermissions } from '@api/role-permission';
import Loading from '@components/Loading';
import QUERY_KEYS from '@constants/query-keys';
import useAppContext from '@hooks/useAppContext';
import useLanguage from '@hooks/useLanguage';
import { useMutation, useQuery } from '@tanstack/react-query';
import css from '@utils/css';
import { useEffect } from 'react';
import { FiSave } from 'react-icons/fi';
import { Navigate, useParams } from 'react-router-dom';

export default function RolePermissions() {
	const { permissions, appLanguage, appTitle } = useAppContext();
	const language = useLanguage('page.role_permissions');
	const { id } = useParams();
	const disabledUpdate = !permissions.has('role_permission_grant');
	const queryData = useQuery({
		queryKey: [QUERY_KEYS.PAGE_ROLE_PERMISSIONS, { id: id }],
		queryFn: () => apiGetRolePermissions(Number(id)),
		enabled: permissions.has('role_permission_view')
	});
	const handleUpdatePermission = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		const permissionIds: (string | number)[] = [];
		formData.forEach(value => {
			permissionIds.push(value.toString());
		});
		if (!id) return;
		await apiUpdateRolePermissions(id, permissionIds);
	};
	const hasPermission = (name: string) => {
		const result = queryData.data?.role.permissions.find((item) => {
			return item.name === name;
		});
		return Boolean(result);
	};
	const { mutate, isPending } = useMutation({
		mutationFn: handleUpdatePermission,
		onSuccess: () => {
			queryData.refetch();
		}
	});
	useEffect(() => {
		if (queryData.data && language) {
			appTitle.setAppTitle(language[queryData.data.role.name + 'Permissions' as keyof typeof language]);
		}
	}, [appTitle, language, queryData.data]);
	useEffect(() => {
		if (permissions.has('role_permission_view')) {
			queryData.refetch();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [permissions, appLanguage.language]);
	if (!permissions.has('role_permission_view')) return <Navigate to='/' />;
	return (
		<div className={css(appStyles['dashboard-d'], styles['role-permission-container'])}
		>
			{
				queryData.isFetching || isPending ? <Loading /> : null
			}
			{
				queryData.data ?
					<form
						onSubmit={e => { mutate(e); }}
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
											disabled={disabledUpdate}
											defaultChecked={hasPermission(item.name)}
										/>
										<label htmlFor={item.name} className={styles['label']}>{item.displayName}</label>
									</li>
								);
							})}
						</ul>
						{
							permissions.has('role_permission_grant')
								?
								<div className={styles['action-items']}>
									<button name='save'
										className={appStyles['action-item-d']}>
										<FiSave />{language?.save}
									</button>
								</div>
								: null
						}
					</form>
					: null
			}
		</div>
	);
}
