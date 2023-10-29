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
import {
    GrFormNext,
    GrFormPrevious,
} from 'react-icons/gr'
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
        queryFn: () => reqGetUsersByType({
            type: type,
            page: Number(searchParams.get('page')),
            perPage: 10
        })
    })
    useEffect(() => {
        if (!searchParams.has('page')) {
            searchParams.set('page', '1')
            setSearchParams(searchParams)
        }
        fetch(`/langs/page.users.${appLanguage}.json`)
            .then(res => res.json())
            .then((data) => {
                setLanguage(data)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appLanguage])
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
                        {!queryData.isError && queryData.data ?
                            <>
                                <table className={styles['main']}>
                                    <>
                                        <tbody>
                                            <tr className={styles['table-header']}>
                                                <th className={styles['column-id']}>ID</th>
                                                <th className={styles['column-shortcode']}>Shortcode</th>
                                                <th className={styles['column-name']}>Name</th>
                                                {type === 'student' ? <th className={styles['column-class']}>Class</th> : null}
                                                <th className={styles['column-email']}>Email</th>
                                            </tr>
                                            {
                                                queryData.data.data.map(user => {
                                                    return (
                                                        <tr key={user.id}>
                                                            <td className={styles['column-id']}>{user.id}</td>
                                                            <td className={styles['column-content-shortcode']}>{user.shortcode}</td>
                                                            <td className={
                                                                [
                                                                    styles['column-content-name'],
                                                                    user.gender == 'male' ? styles['male'] : styles['female']
                                                                ].join(' ')
                                                            }>
                                                                {user.gender == 'male' ? <GiMale /> : <GiFemale />}
                                                                {user.name}
                                                            </td>
                                                            <td className={styles['column-content-class']}>{user.class}</td>
                                                            <td className={styles['column-content-email']}>{user.email}</td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </>
                                </table>
                                <div className={styles['table-links']}>
                                    {
                                        <div className={styles['link-content']}>
                                            {queryData.data.links.map(link => {
                                                if (isNaN(Number(link.label))) return (
                                                    <button key={type + link.label} className={
                                                        [
                                                            styles['next-previous'],
                                                        ].join(' ')
                                                    }
                                                        onClick={() => {
                                                            if (!link.url) return
                                                            const url = new URL(link.url)
                                                            searchParams.set('page', url.searchParams.get('page') || '1')
                                                            setSearchParams(searchParams)
                                                        }}
                                                    >
                                                        {link.label === '...' ? '...' : link.label.includes('Next') ? <GrFormNext /> : <GrFormPrevious />}
                                                        {/* {link.label.includes('Next') ? <GrFormNext /> : <GrFormPrevious />} */}
                                                    </button>
                                                )
                                                return (
                                                    <button key={type + link.label} className={
                                                        [
                                                            'button-d',
                                                            !link.active ? styles['inactive'] : ''
                                                        ].join(' ')
                                                    }
                                                        onClick={() => {
                                                            if (!link.url) return
                                                            const url = new URL(link.url)
                                                            searchParams.set('page', url.searchParams.get('page') || '1')
                                                            setSearchParams(searchParams)
                                                        }}
                                                    >{link.label}</button>
                                                )
                                            })}
                                        </div>
                                    }
                                </div>
                            </>
                            : null}
                    </div>
                </div>
            </div >
        </>
    )
}