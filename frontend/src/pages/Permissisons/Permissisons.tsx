import appStyles from '~styles/App.module.css';
import styles from './styles/Permissions.module.css';

import { useQuery } from '@tanstack/react-query';
import { LuUsers2 } from 'react-icons/lu';
import { Link, Navigate } from 'react-router-dom';
import { apiGetRolePermissionCount } from '~api/role-permission';
import Loading from '~components/Loading';
import QUERY_KEYS from '~constants/query-keys';
import useAppContext from '~hooks/useAppContext';
import useLanguage from '~hooks/useLanguage';
import css from '~utils/css';

export default function Permissisons() {
    const { permissions } = useAppContext();
    const language = useLanguage('page.permissions');
    const queryData = useQuery({
        queryKey: [QUERY_KEYS.PAGE_PERMISSIONS],
        queryFn: apiGetRolePermissionCount,
        enabled: permissions.has('role_permission_view')
    });
    if (!permissions.has('role_permission_view')) return <Navigate to='/' />;
    return (
        <div className={css(appStyles.dashboard, styles.permissionContainer)}>
            {
                queryData.isLoading ? <Loading /> : null}
            {
                queryData.data ?
                    <div className={styles.permissionContent}>
                        <ul className={styles.listConatiner}>
                            {
                                queryData.data.map((item) => {
                                    return (
                                        <li className={styles.listItem}
                                            key={`role-${item.id}`}>
                                            <Link
                                                className={styles.listAnchor}
                                                to={item.id.toString()}>
                                                <div className={styles.itemLeft}>
                                                    <LuUsers2 />
                                                    <span className={styles.name}>
                                                        {item.displayName}
                                                    </span>
                                                </div>
                                                <div className={styles.itemRight}>
                                                    <span
                                                        className={styles.name}
                                                    >{language?.permissionsCount}</span>
                                                    <span
                                                        className={styles.name}
                                                    >
                                                        {item.permissionsCount}
                                                    </span>
                                                </div>
                                            </Link>
                                        </li>
                                    );
                                })
                            }
                        </ul>
                    </div>
                    : null
            }
        </div>
    );
}
