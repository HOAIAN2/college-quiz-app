import { useState } from 'react'
import { GrFormNext, GrFormPrevious } from 'react-icons/gr'
import { SetURLSearchParams } from 'react-router-dom'
import useLanguage from '../hooks/useLanguage'
import { FacultyDetail } from '../models/faculty'
import { ComponentFacultiesTableLang } from '../models/lang'
import { Pagination } from '../models/response'
import styles from '../styles/FacultiesTable.module.css'

type FacultiesTableProps = {
    data?: Pagination<FacultyDetail>
    searchParams: URLSearchParams
    onMutateSuccess: () => void
    setSearchParams: SetURLSearchParams
    // setSelectedRows: React.Dispatch<React.SetStateAction<Set<string | number>>>
}

export default function FacultiesTable({
    data,
    searchParams,
    // onMutateSuccess,
    setSearchParams
}: FacultiesTableProps) {
    const language = useLanguage<ComponentFacultiesTableLang>('component.faculties_table')
    const [viewMode, setViewMode] = useState(false)
    const [facultyId, seFacultyId] = useState<number>(0)
    const handleViewFaculty = (id: number) => {
        seFacultyId(id)
        setViewMode(true)
    }
    console.log(viewMode, facultyId)
    return (
        <>
            <div className={styles['table-content']}>
                <table className={styles['main']}>
                    <>
                        <thead>
                            <tr className={styles['table-header']}>
                                <th className={
                                    [
                                        styles['column'],
                                        styles['medium']
                                    ].join(' ')
                                }>{language?.header.shortcode}</th>
                                <th className={
                                    [
                                        styles['column'],
                                        styles['medium']
                                    ].join(' ')
                                }>{language?.header.name}</th>
                                <th className={
                                    [
                                        styles['column'],
                                        styles['medium']
                                    ].join(' ')
                                }>{language?.header.email}</th>
                                <th className={
                                    [
                                        styles['column'],
                                        styles['medium']
                                    ].join(' ')
                                }>{language?.header.phoneNumber}</th>
                                <th className={
                                    [
                                        styles['column'],
                                        styles['medium']
                                    ].join(' ')
                                }>
                                    {language?.header.leader}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data ?
                                    data.data.map(faculty => {
                                        return (
                                            <tr key={faculty.id}
                                                onClick={() => {
                                                    handleViewFaculty(faculty.id)
                                                }}
                                            >
                                                <td className={
                                                    [
                                                        styles['column'],
                                                        styles['medium']
                                                    ].join(' ')
                                                }>{faculty.shortcode}</td>
                                                <td className={
                                                    [
                                                        styles['column'],
                                                        styles['medium']
                                                    ].join(' ')
                                                }>{faculty.name}</td>
                                                <td className={
                                                    [
                                                        styles['column'],
                                                        styles['medium']
                                                    ].join(' ')
                                                }>{faculty.email}</td>
                                                <td className={
                                                    [
                                                        styles['column'],
                                                        styles['medium']
                                                    ].join(' ')
                                                }>{faculty.phoneNumber}</td>
                                                <td className={
                                                    [
                                                        styles['column'],
                                                        styles['medium']
                                                    ].join(' ')
                                                }>{faculty.phoneNumber}</td>
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
                                                <button key={'faculty' + link.label} className={
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
                                                <button key={'faculty' + link.label} className={
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