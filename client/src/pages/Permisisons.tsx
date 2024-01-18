import { useQuery } from '@tanstack/react-query'
import { LuUsers2 } from 'react-icons/lu'
import { Link } from 'react-router-dom'
import { apiGetRolePermissionCount } from '../api/role-permission'
import Loading from '../components/Loading'
import useLanguage from '../hooks/useLanguage'
import { PagePermissionsLang } from '../models/lang'
import styles from '../styles/Permissions.module.css'

export default function Permisisons() {
    const language = useLanguage<PagePermissionsLang>('page.permissions')
    const queryData = useQuery({
        queryKey: ['permissions'],
        queryFn: () => apiGetRolePermissionCount()
    })
    return (
        <div
            className={
                [
                    'dashboard-d',
                    styles['permission-container']
                ].join(' ')
            }
        >
            {queryData.isLoading ?
                <Loading />
                : null}
            {
                queryData.data ?
                    <div className={styles['permission-content']}>
                        <ul className={styles['list-conatiner']}>
                            {
                                queryData.data.map((item) => {
                                    return (
                                        <li className={styles['list-item']}
                                            key={`role-${item.id}`}>
                                            <Link
                                                className={styles['list-anchor']}
                                                to={item.id.toString()}>
                                                <div className={styles['item-left']}>
                                                    <LuUsers2 />
                                                    <span className={styles['name']}>
                                                        {item.displayName}
                                                    </span>
                                                </div>
                                                <div className={styles['item-right']}>
                                                    <span
                                                        className={styles['name']}
                                                    >{language?.permissionsCount}</span>
                                                    <span
                                                        className={styles['name']}
                                                    >
                                                        {item.permissionsCount}
                                                    </span>
                                                </div>
                                            </Link>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                    : null
            }
        </div>
    )
}