import { useQuery } from "@tanstack/react-query"
import { apiGetRolePermissionCount } from "../api/role-permission"
import Loading from "../components/Loading"

export default function Permisisons() {
    const queryData = useQuery({
        queryKey: [],
        queryFn: () => apiGetRolePermissionCount()
    })
    console.log(queryData.data)
    return (
        <>
            {queryData.isLoading ?
                <Loading />
                : null}
            <div
                className={
                    [
                        'dashboard-d'
                    ].join(' ')
                }
            >
            </div>
        </>
    )
}