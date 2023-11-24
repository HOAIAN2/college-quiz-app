import { useEffect, useState } from 'react'
import { SetURLSearchParams } from 'react-router-dom'
import { GiFemale, GiMale } from 'react-icons/gi'
import { RoleName, UserPagination } from '../models/user'
import { useLanguage } from '../contexts/hooks'
import { UsersTableLanguage } from '../models/lang'
import { GrFormNext, GrFormPrevious } from 'react-icons/gr'
import ViewUserPopUp from './ViewUserPopUp'
import styles from '../styles/Users.Table.module.css'

type UsersTableProps = {
    role: RoleName
    data: UserPagination,
    searchParams: URLSearchParams,
    setSearchParams: SetURLSearchParams
}
export default function UsersTable({
    role,
    data,
    searchParams,
    setSearchParams
}: UsersTableProps) {
    const [language, setLanguage] = useState<UsersTableLanguage>()
    const [viewMode, setViewMode] = useState(false)
    const [userId, setUserId] = useState<number>(0)
    const { appLanguage } = useLanguage()
    const handleViewUser = (id: number) => {
        setUserId(id)
        setViewMode(true)
    }
    useEffect(() => {
        fetch(`/langs/page.users_table.${appLanguage}.json`)
            .then(res => res.json())
            .then((data) => {
                setLanguage(data)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appLanguage])
    return (
        <>
            {viewMode === true ?
                <ViewUserPopUp
                    id={userId}
                    setViewMode={setViewMode}
                /> : null}
            <div className={styles['table-content']}>
                <table className={styles['main']}>
                    <>
                        <thead>
                            <tr className={styles['table-header']}>
                                <th className={styles['column-id']}>{language?.header.id}</th>
                                <th className={styles['column-shortcode']}>{language?.header.shortcode}</th>
                                <th className={styles['column-name']}>{language?.header.name}</th>
                                {role === 'student' ?
                                    <th className={styles['column-class']}>{language?.header.class}</th>
                                    : null}
                                <th className={styles['column-email']}>{language?.header.email}</th>
                                <th className={styles['column-address']}>{language?.header.address}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.data.map(user => {
                                    return (
                                        <tr key={user.id}
                                            onClick={() => {
                                                handleViewUser(user.id)
                                            }}
                                        >
                                            <td className={styles['column-id']}>{user.id}</td>
                                            <td className={styles['column-content-shortcode']}>{user.shortcode}</td>
                                            <td className={
                                                [
                                                    styles['column-content-name'],
                                                    user.gender == 'male' ? styles['male'] : styles['female']
                                                ].join(' ')
                                            }>
                                                {user.gender == 'male' ? <GiMale /> : <GiFemale />}
                                                {`${user.lastName} ${user.firstName}`}
                                            </td>
                                            <td className={styles['column-content-class']}>{user.class}</td>
                                            <td className={styles['column-content-email']}>{user.email}</td>
                                            <td className={styles['column-content-address']}>{user.address}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </>
                </table>
                <div className={styles['table-footer']}>
                    <span>
                        {data.from} - {data.to} / {data.total}
                    </span>
                    <div className={styles['table-links']}>
                        {
                            <div className={styles['link-content']}>
                                {data.links.map(link => {
                                    if (isNaN(Number(link.label))) return (
                                        <button key={role + link.label} className={
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
                                        <button key={role + link.label} className={
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
                </div>
            </div>
        </>
    )
}