import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { reqGetUsersById } from '../utils/user'
import Loading from './Loading'
import { useAppContext } from '../contexts/hooks'
import { ViewUserLanguage } from '../models/lang'
import { UserDetail } from '../models/user'
import styles from '../styles/ViewUser.module.css'

type ViewUserProps = {
    id?: number | string,
    setUserDetail?: React.Dispatch<React.SetStateAction<UserDetail | null>>
}
export default function ViewUser({
    id,
    setUserDetail
}: ViewUserProps) {
    const [language, setLanguage] = useState<ViewUserLanguage>()
    const { appLanguage } = useAppContext()
    const queryData = useQuery({
        queryKey: [`user-${id}`],
        queryFn: () => {
            const currentPath = location.pathname.split('/')
            const currentId = currentPath.pop() || currentPath.pop() as string
            return reqGetUsersById(id || currentId)
        },
    })
    useEffect(() => {
        fetch(`/langs/component.view_user.${appLanguage.language}.json`)
            .then(res => res.json())
            .then((data: ViewUserLanguage) => {
                setLanguage(data)
            })
    }, [appLanguage.language])
    useEffect(() => {
        if (queryData.data?.user && setUserDetail) {
            setUserDetail(queryData.data)
        }
    }, [queryData.data, setUserDetail])
    return (
        <>
            {queryData.isLoading ?
                <Loading />
                : null}
            <div className={styles['form-data']}>
                <div className={
                    [
                        styles['form-content']
                    ].join(' ')
                }></div>
                <div className={styles['action-items']}>
                    <button name='save' className='action-item-d'>{language?.save}</button>
                </div>
            </div>
        </>
    )
}