import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { apiGetRolePermissions } from '../api/role-permission'
import Loading from '../components/Loading'
import styles from '../styles/RolePermissions.module.css'

export default function RolePermissions() {
    const { id } = useParams()
    const queryData = useQuery({
        queryKey: ['permissions', id],
        queryFn: () => apiGetRolePermissions(Number(id))
    })
    console.log(queryData.data)
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
        </div>
    )
}