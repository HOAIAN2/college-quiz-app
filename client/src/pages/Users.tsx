import { useEffect, useState } from 'react'
import {
    RiAddFill
} from 'react-icons/ri'
import {
    BiImport,
    BiExport
} from 'react-icons/bi'
import CreateUser from '../components/CreateUser'
import { UsersLanguage } from '../models/lang'
import { useLanguage } from '../contexts/hooks'
import styles from '../styles/Users.module.css'
import { useQuery } from '@tanstack/react-query'
import { reqGetUsersByType, reqImportUsers } from '../utils/user'
import { useSearchParams } from 'react-router-dom'
import CustomSelect from '../components/CustomSelect'
import useDebounce from '../hooks/useDebounce'
import ImportData from '../components/ImportData'
import { RoleName } from '../models/user'
import UsersTable from '../components/UsersTable'
import { templateFileUrl } from '../utils/api-config'
import Loading from '../components/Loading'

type UsersProps = {
    role: RoleName
}
export default function Users({
    role
}: UsersProps) {
    const [language, setLanguage] = useState<UsersLanguage>()
    const { appLanguage } = useLanguage()
    const [insertMode, setInsertMode] = useState(false)
    const [importMode, setImportMode] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams()
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
    const queryDebounce = useDebounce(searchQuery, 300) as string
    const queryData = useQuery({
        queryKey: [role,
            searchParams.get('page') || '1',
            searchParams.get('per_page') || '10',
            searchParams.get('search')
        ],
        queryFn: () => reqGetUsersByType({
            role: role,
            page: Number(searchParams.get('page')),
            perPage: Number(searchParams.get('per_page')) as 10 | 20 | 30,
            search: searchParams.get('search') as string
        })
    })
    const importFunction = async (file: File) => {
        return reqImportUsers(file, role)
    }
    useEffect(() => {
        return () => {
            if (!window.location.pathname.includes(role)) setSearchParams(new URLSearchParams())
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
        if (!searchParams.get('search') && !queryDebounce) return
        if (queryDebounce === '') searchParams.delete('search')
        else searchParams.set('search', queryDebounce)
        setSearchParams(searchParams)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryDebounce])
    return (
        <>
            {insertMode === true ?
                <CreateUser
                    role={role}
                    setInsertMode={setInsertMode}
                /> : null}
            {importMode === true ?
                <ImportData
                    title={[
                        language?.import,
                        language ? language[role] : ''
                    ].join(' ')
                    }
                    teamplateUrl={templateFileUrl[role]}
                    queryKeys={[
                        'dashboard',
                        'student',
                        'teacher',
                        'admin'
                    ]}
                    importFunction={importFunction}
                    setImportMode={setImportMode}
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
                    }
                        onClick={() => {
                            setImportMode(true)
                        }}
                    >
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
                            <label htmlFor="">{language?.filter.perPage}</label>
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
                                    },
                                    {
                                        label: '40',
                                        value: '40'
                                    },
                                    {
                                        label: '50',
                                        value: '50'
                                    },
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
                            <label htmlFor="">{language?.filter.search}</label>
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
                    <div className={styles['wrap-table']}>
                        {queryData.isLoading ?
                            <Loading />
                            : null}
                        {!queryData.isError && queryData.data ?
                            <UsersTable
                                role={role}
                                data={queryData.data}
                                searchParams={searchParams}
                                setSearchParams={setSearchParams}
                            />
                            : null}
                    </div>
                </div>
            </div >
        </>
    )
}