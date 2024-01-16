import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { apiGetRolePermissions } from '../api/role-permission'

export default function RolePermissions() {
    const { id } = useParams()
    const queryData = useQuery({
        queryKey: ['permissions', id],
        queryFn: () => apiGetRolePermissions(Number(id))
    })
    console.log(queryData.data)
    return (
        <div>RolePermissions</div>
    )
}