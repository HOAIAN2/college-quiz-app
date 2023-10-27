import { useEffect, useState } from 'react'
import {
    RiAddFill
} from 'react-icons/ri'
import {
    BiImport,
    BiExport
} from 'react-icons/bi'
import {
    GiFemale,
    GiMale
} from 'react-icons/gi'
import CreateUser from '../components/CreateUser'
import { UsersLanguage } from '../models/lang'
import { useLanguage } from '../contexts/hooks'
import styles from '../styles/Users.module.css'
import { useQuery } from '@tanstack/react-query'
import { reqGetUsersByType } from '../utils/user'
import { useSearchParams } from 'react-router-dom'

type UsersProps = {
    type: 'student' | 'teacher' | 'admin'
}
export default function Users({
    type
}: UsersProps) {
    const [language, setLanguage] = useState<UsersLanguage>()
    const { appLanguage } = useLanguage()
    const [insertMode, setInsertMode] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams()
    const queryData = useQuery({
        queryKey: [type, searchParams.get('page') || 1],
        queryFn: () => reqGetUsersByType('admin', Number(searchParams.get('page')))
    })
    useEffect(() => {
        fetch(`/langs/page.users.${appLanguage}.json`)
            .then(res => res.json())
            .then((data) => {
                setLanguage(data)
            })
    }, [appLanguage])
    console.log(queryData)
    return (
        <>
            {insertMode === true ?
                <CreateUser
                    type={type}
                    setInsertMode={setInsertMode}
                /> : null}
            <div
                className={
                    [
                        'dashboard-d'
                    ].join(' ')
                }
            >
                <div className={
                    [
                        'action-bar-d'
                    ].join(' ')
                }>
                    <div className={
                        [
                            'action-item-d'
                        ].join(' ')
                    }
                        onClick={() => {
                            setInsertMode(true)
                        }}
                    >
                        <RiAddFill /> {language?.add}
                    </div>
                    <div className={
                        [
                            'action-item-d-white'
                        ].join(' ')
                    }>
                        <BiImport /> {language?.import}
                    </div>
                    <div className={
                        [
                            'action-item-d-white'
                        ].join(' ')
                    }>
                        <BiExport /> {language?.export}
                    </div>
                </div>
                <div className={styles['users-content']}>
                    <form className={styles['filter-form']}></form>
                    <div className={styles['table-content']}>
                        {/* <div className={styles['table-loading']}>Loading...</div> */}
                        {queryData.isLoading ?
                            <div className={styles['table-loading']}>Loading...</div>
                            : null}
                        <table className={styles['main']}>
                            <tbody>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Gender</th>
                                </tr>
                                {
                                    !queryData.isError && queryData.data ? queryData.data.data.map(user => {
                                        return (
                                            <tr key={user.id}>
                                                <td>{user.id}</td>
                                                <td>{user.name}</td>
                                                <td>{user.gender == 'male' ? <GiMale /> : <GiFemale />}</td>
                                            </tr>
                                        )
                                    }) : null
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div >
        </>
    )
}