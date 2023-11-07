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
import CustomSelect from '../components/CustomSelect'
import useDebounce from '../hooks/useDebounce'

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
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
    const queryDebounce = useDebounce(searchQuery, 300) as string
    const queryData = useQuery({
        queryKey: [type,
            searchParams.get('page') || '1',
            searchParams.get('per_page') || '10',
            searchParams.get('search')
        ],
        queryFn: () => reqGetUsersByType({
            type: type,
            page: Number(searchParams.get('page')),
            perPage: Number(searchParams.get('per_page')) as 10 | 20 | 30,
            search: searchParams.get('search') as string
        })
    })
    useEffect(() => {
        if (!searchParams.has('page')) {
            searchParams.set('page', '1')
            setSearchParams(searchParams)
        }
        if (!searchParams.has('per_page')) {
            searchParams.set('per_page', '10')
            setSearchParams(searchParams)
        }
        return () => {
            if (!window.location.pathname.includes(type)) setSearchParams(new URLSearchParams())
        }
    })
    useEffect(() => {
        fetch(`/langs/page.users.${appLanguage}.json`)
            .then(res => res.json())
            .then((data) => {
                setLanguage(data)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appLanguage])
    useEffect(() => {
        if (queryDebounce === '') searchParams.delete('search')
        else searchParams.set('search', queryDebounce)
        setSearchParams(searchParams)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryDebounce])
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
                    <div className={styles['filter-form']}>
                        <div className={styles['wrap-input-item']}>
                            <label htmlFor="">{language?.table.filter.perPage}</label>
                            <CustomSelect
                                defaultOption={
                                    {
                                        label: searchParams.get('per_page') || '10',
                                        value: searchParams.get('per_page') || '10'
                                    }
                                }
                                options={[
                                    {
                                        label: '10',
                                        value: '10'
                                    },
                                    {
                                        label: '20',
                                        value: '20'
                                    },
                                    {
                                        label: '30',
                                        value: '30'
                                    }
                                ]}
                                onChange={(option) => {
                                    searchParams.set('per_page', option.value)
                                    setSearchParams(searchParams)
                                }}
                                className={
                                    [
                                        styles['custom-select']
                                    ].join(' ')
                                }
                            />
                        </div>
                        <div className={styles['wrap-input-item']}>
                            <label htmlFor="">{language?.table.filter.search}</label>
                            <input
                                onInput={(e) => {
                                    setSearchQuery(e.currentTarget.value)
                                }}
                                name='search'
                                defaultValue={queryDebounce}
                                className={
                                    [
                                        'input-d',
                                        styles['input-item']
                                    ].join(' ')
                                } type="text" />
                        </div>
                    </div>
                    <div className={styles['table-content']}>
                        {/* <div className={styles['table-loading']}>Loading...</div> */}
                        {queryData.isLoading ?
                            <div className={styles['table-loading']}>Loading...</div>
                            : null}
                        {!queryData.isError && queryData.data ?
                            <div className={styles['wrap-table']}>
                                <table className={styles['main']}>
                                    <>
                                        <thead>
                                            <tr className={styles['table-header']}>
                                                <th className={styles['column-id']}>{language?.table.header.id}</th>
                                                <th className={styles['column-shortcode']}>{language?.table.header.shortcode}</th>
                                                <th className={styles['column-name']}>{language?.table.header.name}</th>
                                                {type === 'student' ? <th className={styles['column-class']}>{language?.table.header.class}</th> : null}
                                                <th className={styles['column-email']}>{language?.table.header.email}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
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
                                                                {`${user.lastName} ${user.firstName}`}
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
                                <div className={styles['table-footer']}>
                                    <span>
                                        {queryData.data.from} - {queryData.data.to} / {queryData.data.total}
                                    </span>
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
                                </div>
                            </div>
                            : null}
                    </div>
                </div>
            </div >
        </>
    )
}