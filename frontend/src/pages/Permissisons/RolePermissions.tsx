import appStyles from '~styles/App.module.css';
import styles from './styles/RolePermissions.module.css';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { FiSave } from 'react-icons/fi';
import { Navigate, useParams } from 'react-router';
import { apiGetRolePermissions, apiUpdateRolePermissions } from '~api/role-permission';
import Loading from '~components/Loading';
import QUERY_KEYS from '~constants/query-keys';
import useAppContext from '~hooks/useAppContext';
import useLanguage from '~hooks/useLanguage';
import NotFound from '~pages/Errors/NotFound';
import css from '~utils/css';

export default function RolePermissions() {
    const { permissions, appLanguage, appTitle } = useAppContext();
    const language = useLanguage('page.role_permissions');
    const { id } = useParams();
    const disabledUpdate = !permissions.has('role_permission_grant');
    const queryClient = useQueryClient();
    const queryData = useQuery({
        queryKey: [QUERY_KEYS.PAGE_ROLE_PERMISSIONS, { id: id }],
        queryFn: () => apiGetRolePermissions(Number(id)),
        enabled: permissions.has('role_permission_view'),
        refetchOnWindowFocus: false,
        retry: false,
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
        return () => {
            queryClient.removeQueries({ queryKey: [QUERY_KEYS.PAGE_ROLE_PERMISSIONS, { id: id }] });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appLanguage.language]);
    if (!permissions.has('role_permission_view')) return <Navigate to='/' />;
    if (queryData.error) return (
        <main className={css(appStyles.dashboard, styles.rolePermissionContainer)}>
            <NotFound />
        </main>
    );
    return (
        <div className={css(appStyles.dashboard, styles.rolePermissionContainer)}
        >
            {
                queryData.isFetching || isPending ? <Loading /> : null
            }
            {
                queryData.data ?
                    <form
                        onSubmit={e => { mutate(e); }}
                        className={styles.permissionContainer}>
                        <ul className={styles.permissionList}>
                            {queryData.data.appPermissions.map(item => {
                                return (
                                    <li
                                        className={styles.permissionItem}
                                        key={`'permission-${item.id}`}
                                    >
                                        <input id={item.name}
                                            type='checkbox'
                                            name='ids[]'
                                            value={item.id}
                                            disabled={disabledUpdate}
                                            defaultChecked={hasPermission(item.name)}
                                        />
                                        <label htmlFor={item.name}>{item.displayName}</label>
                                    </li>
                                );
                            })}
                        </ul>
                        {
                            permissions.has('role_permission_grant')
                                ?
                                <div className={styles.actionItems}>
                                    <button name='save'
                                        className={appStyles.actionItem}>
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
