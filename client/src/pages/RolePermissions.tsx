import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { apiGetRolePermissions } from '../api/role-permission'
import Loading from '../components/Loading'
import useAppContext from '../hooks/useAppContext'
import useLanguage from '../hooks/useLanguage'
import { PageRolePermissionsLang } from '../models/lang'
import styles from '../styles/RolePermissions.module.css'

export default function RolePermissions() {
    const { DOM } = useAppContext()
    const language = useLanguage<PageRolePermissionsLang>('page.role_permissions')
    const { id } = useParams()
    const queryData = useQuery({
        queryKey: ['role-permissions', id],
        queryFn: () => apiGetRolePermissions(Number(id))
    })
    const hasPermission = (name: string) => {
        const result = queryData.data?.role.permissions.find((item) => {
            return item.name === name
        })
        return Boolean(result)
    }
    useEffect(() => {
        if (queryData.data) {
            document.title = language ?
                language[queryData.data.role.name + 'Permissions' as keyof typeof language] : ''
            if (DOM.titleRef.current) {
                DOM.titleRef.current.textContent = document.title
            }
        }
    }, [DOM.titleRef, language, queryData.data])
    return (
        <div
            className={
                [
                    'dashboard-d',
                    styles['role-permission-container']
                ].join(' ')
            }
        >
            {queryData.isLoading ?
                <Loading />
                : null}
            {
                queryData.data ?
                    <div className={styles['permission-container']}>
                        <ul className={styles['permission-list']}>
                            {queryData.data.appPermissions.map(item => {
                                return (
                                    <li
                                        className={styles['permission-item']}
                                        key={`'permission-${item.id}`}
                                    >
                                        <input id={item.name}
                                            type='checkbox'
                                            name='fields[]'
                                            value={item.id}
                                            defaultChecked={hasPermission(item.name)}
                                        />
                                        <label htmlFor={item.name} className={styles['label']}>{item.displayName}</label>
                                    </li>
                                )
                            })}
                        </ul>
                        <div className={styles['action-items']}>
                            <button name='save' className='action-item-d'>{language?.student}</button>
                        </div>
                    </div>
                    : null
            }
        </div>
    )
}