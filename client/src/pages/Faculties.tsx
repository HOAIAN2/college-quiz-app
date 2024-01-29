import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { BiExport, BiImport } from 'react-icons/bi'
import { MdDeleteOutline } from 'react-icons/md'
import { RiAddFill } from 'react-icons/ri'
import { useSearchParams } from 'react-router-dom'
import { apiDeleteFacultiesByIds, apiGetFaculties } from '../api/faculty'
import CreateFaculty from '../components/CreateFaculty'
import CustomSelect from '../components/CustomSelect'
import FacultiesTable from '../components/FacultiesTable'
import Loading from '../components/Loading'
import YesNoPopUp from '../components/YesNoPopUp'
import useAppContext from '../hooks/useAppContext'
import useDebounce from '../hooks/useDebounce'
import useLanguage from '../hooks/useLanguage'
import { PageFacultiesLang } from '../models/lang'
import styles from '../styles/global/TablePage.module.css'

export default function Faculties() {
    const { permissions } = useAppContext()
    const language = useLanguage<PageFacultiesLang>('page.faculties')
    const [insertMode, setInsertMode] = useState(false)
    const [showPopUpMode, setShowPopUpMode] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams()
    const queryClient = useQueryClient()
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
    const queryDebounce = useDebounce(searchQuery) as string
    const [selectedFacultyIds, setSelectedFacultyIds] = useState<Set<string | number>>(new Set())
    const queryData = useQuery({
        queryKey: [
            'faculties',
            searchParams.get('page') || '1',
            searchParams.get('per_page') || '10',
            searchParams.get('search')
        ],
        queryFn: () => apiGetFaculties({
            page: Number(searchParams.get('page')),
            perPage: Number(searchParams.get('per_page')),
            search: searchParams.get('search') as string
        })
    })
    const handleDeleteFaculties = async () => {
        return apiDeleteFacultiesByIds(Array.from(selectedFacultyIds))
    }
    const getMessage = () => {
        if (!language) return ''
        return language.deleteMessage.replace('@n', String(selectedFacultyIds.size))
    }
    const onMutateSuccess = () => {
        const queryKeys = [
            'faculties',
        ]
        queryKeys.forEach(key => {
            queryClient.refetchQueries({ queryKey: [key] })
        })
    }
    useEffect(() => {
        setSelectedFacultyIds(new Set())
    }, [queryData.data])
    useEffect(() => {
        if (!searchParams.get('search') && !queryDebounce) return
        if (queryDebounce === '') searchParams.delete('search')
        else searchParams.set('search', queryDebounce)
        setSearchParams(searchParams)
    }, [queryDebounce, searchParams, setSearchParams])
    return (
        <>
            {insertMode === true ?
                <CreateFaculty
                    onMutateSuccess={onMutateSuccess}
                    setInsertMode={setInsertMode}
                /> : null}
            {showPopUpMode === true ?
                <YesNoPopUp
                    message={getMessage()}
                    mutateFunction={handleDeleteFaculties}
                    setShowPopUpMode={setShowPopUpMode}
                    onMutateSuccess={onMutateSuccess}
                    langYes={language?.langYes}
                    langNo={language?.langNo}
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
                        permissions.has('faculty_create') ?
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
                        permissions.has('faculty_create') ?
                            <div className={
                                [
                                    'action-item-d-white'
                                ].join(' ')
                            }
                                onClick={() => {
                                    // setImportMode(true)
                                }}
                            >
                                <BiImport /> {language?.import}
                            </div>
                            : null
                    }
                    {
                        permissions.has('faculty_view') ?
                            <div className={
                                [
                                    'action-item-d-white'
                                ].join(' ')
                            }
                                onClick={() => {
                                    // setExportMode(true)
                                }}
                            >
                                <BiExport /> {language?.export}
                            </div>
                            : null
                    }
                    {
                        selectedFacultyIds.size > 0 && permissions.has('user_delete') ?
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
                                        label: '10',
                                        value: '10'
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
                            <FacultiesTable
                                data={queryData.data}
                                searchParams={searchParams}
                                onMutateSuccess={onMutateSuccess}
                                setSearchParams={setSearchParams}
                                setSelectedRows={setSelectedFacultyIds}
                            />
                            : null}
                    </div>
                </div>
            </div>
        </>
    )
}