import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import {
    BiExport,
    BiImport
} from 'react-icons/bi'
import { MdDeleteOutline } from 'react-icons/md'
import { PiMicrosoftExcelLogoFill } from 'react-icons/pi'
import {
    RiAddFill
} from 'react-icons/ri'
import { useSearchParams } from 'react-router-dom'
import { apiDeleteUserByIds, apiGetUsersByType, apiImportUsers } from '../api/user'
import CreateUser from '../components/CreateUser'
import CustomSelect from '../components/CustomSelect'
import ExportUsers from '../components/ExportUsers'
import ImportData from '../components/ImportData'
import Loading from '../components/Loading'
import UsersTable from '../components/UsersTable'
import YesNoPopUp from '../components/YesNoPopUp'
import useAppContext from '../hooks/useAppContext'
import useDebounce from '../hooks/useDebounce'
import useLanguage from '../hooks/useLanguage'
import { PageUsersLang } from '../models/lang'
import { RoleName } from '../models/role'
import styles from '../styles/global/TablePage.module.css'
import { importTemplateFileUrl } from '../utils/template'

type UsersProps = {
    role: RoleName
}
export default function Users({
    role
}: UsersProps) {
    const language = useLanguage<PageUsersLang>('page.users')
    const { permissions } = useAppContext()
    const [insertMode, setInsertMode] = useState(false)
    const [exportMode, setExportMode] = useState(false)
    const [importMode, setImportMode] = useState(false)
    const [showPopUpMode, setShowPopUpMode] = useState(false)
    const [selectedUserIds, setSelectedUserIds] = useState<Set<string | number>>(new Set())
    const [searchParams, setSearchParams] = useSearchParams()
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
    const queryDebounce = useDebounce(searchQuery) as string
    const queryClient = useQueryClient()
    const queryData = useQuery({
        queryKey: [role,
            searchParams.get('page') || '1',
            searchParams.get('per_page') || '10',
            searchParams.get('search')
        ],
        queryFn: () => apiGetUsersByType({
            role: role,
            page: Number(searchParams.get('page')),
            perPage: Number(searchParams.get('per_page')),
            search: searchParams.get('search') as string
        })
    })
    const importFunction = async (file: File) => {
        return apiImportUsers(file, role)
    }
    const handleDeleteUsers = async () => {
        return apiDeleteUserByIds(Array.from(selectedUserIds))
    }
    const onMutateSuccess = () => {
        const queryKeys = [
            'dashboard',
            'student',
            'teacher',
            'admin'
        ]
        queryKeys.forEach(key => {
            queryClient.refetchQueries({ queryKey: [key] })
        })
    }
    const getMessage = () => {
        if (!language) return ''
        return language.deleteMessage.replace('@n', String(selectedUserIds.size))
    }
    useEffect(() => {
        setSelectedUserIds(new Set())
    }, [queryData.data])
    useEffect(() => {
        return () => {
            if (!window.location.pathname.includes(role)) setSearchParams(new URLSearchParams())
        }
    })
    useEffect(() => {
        if (!searchParams.get('search') && !queryDebounce) return
        if (queryDebounce === '') searchParams.delete('search')
        else searchParams.set('search', queryDebounce)
        setSearchParams(searchParams)
    }, [queryDebounce, searchParams, setSearchParams])
    return (
        <>
            {insertMode === true ?
                <CreateUser
                    role={role}
                    onMutateSuccess={onMutateSuccess}
                    setInsertMode={setInsertMode}
                /> : null}
            {exportMode === true ?
                <ExportUsers
                    role={role}
                    setExportMode={setExportMode}
                /> : null}
            {showPopUpMode === true ?
                <YesNoPopUp
                    message={getMessage()}
                    mutateFunction={handleDeleteUsers}
                    setShowPopUpMode={setShowPopUpMode}
                    onMutateSuccess={onMutateSuccess}
                    langYes={language?.langYes}
                    langNo={language?.langNo}
                /> : null}
            {importMode === true ?
                <ImportData
                    title={[
                        language?.import,
                        language ? language[role] : ''
                    ].join(' ')
                    }
                    icon={<PiMicrosoftExcelLogoFill />}
                    teamplateUrl={importTemplateFileUrl[role]}
                    importFunction={importFunction}
                    setImportMode={setImportMode}
                    onMutateSuccess={onMutateSuccess}
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
                    {
                        permissions.has('user_create') ?
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
                            : null
                    }
                    {
                        permissions.has('user_create') ?
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
                            : null
                    }
                    {
                        permissions.has('user_view') ?
                            <div className={
                                [
                                    'action-item-d-white'
                                ].join(' ')
                            }
                                onClick={() => {
                                    setExportMode(true)
                                }}
                            >
                                <BiExport /> {language?.export}
                            </div>
                            : null
                    }
                    {
                        selectedUserIds.size > 0 && permissions.has('user_delete') ?
                            <div
                                onClick={() => {
                                    setShowPopUpMode(true)
                                }}
                                className={
                                    [
                                        'action-item-d-white-border-red'
                                    ].join(' ')
                                }>
                                <MdDeleteOutline /> {language?.delete}
                            </div>
                            : null
                    }
                </div>
                <div className={styles['table-page-content']}>
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
                        {!queryData.isError ?
                            <UsersTable
                                role={role}
                                data={queryData.data}
                                searchParams={searchParams}
                                onMutateSuccess={onMutateSuccess}
                                setSearchParams={setSearchParams}
                                setSelectedRows={setSelectedUserIds}
                            />
                            : null}
                    </div>
                </div>
            </div >
        </>
    )
}