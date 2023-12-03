import { useEffect, useState } from 'react'
import { SetURLSearchParams } from 'react-router-dom'
import { GiFemale, GiMale } from 'react-icons/gi'
import { RoleName, UserPagination } from '../models/user'
import { useAppContext } from '../contexts/hooks'
import { UsersTableLanguage } from '../models/lang'
import { GrFormNext, GrFormPrevious } from 'react-icons/gr'
import ViewUserPopUp from './ViewUserPopUp'
import styles from '../styles/Users.Table.module.css'

type UsersTableProps = {
    role: RoleName
    data?: UserPagination,
    searchParams: URLSearchParams,
    setSearchParams: SetURLSearchParams,
    setSelectedRows: React.Dispatch<React.SetStateAction<Set<string | number>>>
}
export default function UsersTable({
    role,
    data,
    searchParams,
    setSearchParams,
    setSelectedRows
}: UsersTableProps) {
    const [language, setLanguage] = useState<UsersTableLanguage>()
    const [viewMode, setViewMode] = useState(false)
    const [checkAll, setCheckAll] = useState(false)
    const [userId, setUserId] = useState<number>(0)
    const { appLanguage } = useAppContext()
    const handleViewUser = (id: number, e: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => {
        const target = e.target as Element
        if (target.nodeName === 'INPUT') {
            const checkBox = target as HTMLInputElement
            if (checkBox.checked) setSelectedRows(pre => {
                pre.add(id)
                return structuredClone(pre)
            })
            else setSelectedRows(pre => {
                pre.delete(id)
                return structuredClone(pre)
            })
        }
        setUserId(id)
        setViewMode(true)
    }
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        const currentTarget = e.currentTarget
        const selector = `.${styles['column-select']}>input`
        const allCheckBox = document.querySelectorAll(selector)
        allCheckBox.forEach(node => {
            const element = node as HTMLInputElement
            element.checked = currentTarget.checked
        })
        if (currentTarget.checked) {
            setSelectedRows(pre => {
                pre.clear()
                data && data.data.forEach(user => {
                    pre.add(user.id)
                })
                return structuredClone(pre)
            })
            setCheckAll(true)
        }
        else {
            setSelectedRows(pre => {
                pre.clear()
                return structuredClone(pre)
            })
            setCheckAll(false)
        }

    }
    useEffect(() => {
        fetch(`/langs/component.users_table.${appLanguage.language}.json`)
            .then(res => res.json())
            .then((data) => {
                setLanguage(data)
            })
    }, [appLanguage.language])
    useEffect(() => {
        if (!data) setCheckAll(false)
    }, [data])
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
                                <th className={styles['column-select']}>
                                    <input type="checkbox"
                                        checked={checkAll}
                                        onChange={handleSelectAll} />
                                </th>
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
                                data ?
                                    data.data.map(user => {
                                        return (
                                            <tr key={user.id}
                                                onClick={(e) => {
                                                    handleViewUser(user.id, e)
                                                }}
                                            >
                                                <td className={styles['column-select']}>
                                                    <input type="checkbox" />
                                                </td>
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
                                    }) : null
                            }
                        </tbody>
                    </>
                </table>
                {
                    data ?
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
                        </div> : null
                }
            </div>
        </>
    )
}