import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { SyntheticEvent, useEffect, useState } from 'react'
import { RxCross2 } from 'react-icons/rx'
import { apiAutoCompleteFaculty } from '../api/faculty'
import { apiGetSchoolClassById, apiUpdateSchoolClass } from '../api/school-class'
import useAppContext from '../hooks/useAppContext'
import useDebounce from '../hooks/useDebounce'
import useLanguage from '../hooks/useLanguage'
import { ComponentViewSchoolClassLang } from '../models/lang'
import styles from '../styles/global/ViewModel.module.css'
import Loading from './Loading'

type ViewSchoolClassProps = {
    id: number
    onMutateSuccess: () => void
    setViewMode: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ViewSchoolClass({
    id,
    onMutateSuccess,
    setViewMode
}: ViewSchoolClassProps) {
    const [hide, setHide] = useState(true)
    const language = useLanguage<ComponentViewSchoolClassLang>('component.view_faculty')
    const { permissions } = useAppContext()
    const [queryFaculty, setQueryFaculty] = useState('')
    const debounceQueryFaculty = useDebounce(queryFaculty, 200) as string
    const queryClient = useQueryClient()
    const handleTurnOffImportMode = () => {
        const transitionTiming = getComputedStyle(document.documentElement).getPropertyValue('--transition-timing-fast')
        const timing = Number(transitionTiming.replace('s', '')) * 1000
        setHide(true)
        setTimeout(() => {
            setViewMode(false)
        }, timing)
    }
    const queryData = useQuery({
        queryKey: ['school-class', id],
        queryFn: () => apiGetSchoolClassById(id)
    })
    const facultyQueryData = useQuery({
        queryKey: ['faculty-query', debounceQueryFaculty],
        queryFn: () => apiAutoCompleteFaculty(debounceQueryFaculty),
        enabled: debounceQueryFaculty && permissions.has('faculty_view') ? true : false
    })
    const getParentElement = (element: HTMLInputElement) => {
        let parent = element.parentElement as HTMLElement
        while (!parent.classList.contains(styles['wrap-item'])) parent = parent.parentElement as HTMLElement
        return parent
    }
    const handleOnInput = (e: React.FormEvent<HTMLFormElement>) => {
        const element = e.target as HTMLInputElement
        if (element) {
            element.classList.remove(styles['error'])
            getParentElement(element).removeAttribute('data-error')
        }
    }
    const handleUpdateSchoolClass = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
        e.preventDefault()
        if (!permissions.has('school_class_update')) return
        document.querySelector(styles['form-data'])?.querySelectorAll('input[name]').forEach(node => {
            const element = node as HTMLInputElement
            element.classList.remove(styles['error'])
            getParentElement(element).removeAttribute('data-error')
        })
        const form = e.target as HTMLFormElement
        const formData = new FormData(form)
        await apiUpdateSchoolClass(formData, id)
    }
    const { mutate, isPending } = useMutation({
        mutationFn: handleUpdateSchoolClass,
        onError: (error: object) => {
            if (typeof error === 'object') {
                for (const key in error) {
                    const element = document.querySelector(`input[name='${key}']`) as HTMLInputElement
                    if (element) {
                        element.classList.add(styles['error'])
                        getParentElement(element).setAttribute('data-error', error[key as keyof typeof error][0] as string)
                    }
                }
            }
        },
        onSuccess: onMutateSuccess
    })
    useEffect(() => {
        setHide(false)
        return () => {
            queryClient.removeQueries({ queryKey: ['school-class', id] })
            queryClient.removeQueries({ queryKey: ['faculty-auto-complete'] })
        }
    }, [id, queryClient])
    return (
        <div
            className={
                [
                    styles['view-model-container'],
                    hide ? styles['hide'] : ''
                ].join(' ')
            }>
            {
                isPending ? <Loading /> : null
            }
            <div
                className={
                    [
                        styles['view-model-form'],
                        hide ? styles['hide'] : ''
                    ].join(' ')
                }>
                <div className={styles['header']}>
                    <h2 className={styles['title']}>{queryData.data?.name}</h2>
                    <div className={styles['esc-button']}
                        onClick={handleTurnOffImportMode}
                    >
                        <RxCross2 />
                    </div>
                </div>
                <>
                    {queryData.isLoading ?
                        <Loading />
                        : null}
                    <div className={
                        [
                            styles['form-content']
                        ].join(' ')
                    }>
                        {
                            queryData.data ? (
                                <form onSubmit={(e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
                                    mutate(e)
                                }}
                                    onInput={handleOnInput}
                                    className={styles['form-data']}>
                                    <div className={
                                        [
                                            styles['group-inputs']
                                        ].join(' ')
                                    }>
                                        <div className={styles['wrap-item']}>
                                            <label className={styles['required']} htmlFor='shortcode'>{language?.shortcode}</label>
                                            <input
                                                id='shortcode'
                                                disabled={!permissions.has('school_class_update')}
                                                defaultValue={queryData.data.shortcode}
                                                name='shortcode'
                                                className={
                                                    [
                                                        'input-d',
                                                        styles['input-item']
                                                    ].join(' ')
                                                } type='text' />
                                        </div>
                                        <div className={styles['wrap-item']}>
                                            <label className={styles['required']} htmlFor='name'>{language?.name}</label>
                                            <input
                                                id='name'
                                                disabled={!permissions.has('school_class_update')}
                                                defaultValue={queryData.data.name}
                                                name='name'
                                                className={
                                                    [
                                                        'input-d',
                                                        styles['input-item']
                                                    ].join(' ')
                                                } type='text' />
                                        </div>
                                        <div className={styles['wrap-item']}>
                                            <label className={styles['required']} htmlFor='faculty'>{language?.faculty}</label>
                                            <input
                                                id='faculty'
                                                disabled={!permissions.has('school_class_update')}
                                                defaultValue={queryData.data.faculty?.shortcode || ''}
                                                name='faculty'
                                                onInput={(e) => { setQueryFaculty(e.currentTarget.value) }}
                                                className={
                                                    [
                                                        'input-d',
                                                        styles['input-item']
                                                    ].join(' ')
                                                }
                                                list='facultyList'
                                            />
                                            <datalist id='facultyList'>
                                                {
                                                    facultyQueryData.data ? facultyQueryData.data.map(item => {
                                                        return <option key={`faculty-${item.id}`} value={item.shortcode}>{item.name}</option>
                                                    }) : null
                                                }
                                            </datalist>
                                        </div>
                                        {/* <div className={styles['wrap-item']}>
                                            <label htmlFor='phone_number'>{language?.phoneNumber}</label>
                                            <input
                                                id='phone_number'
                                                disabled={!permissions.has('school_class_update')}
                                                defaultValue={queryData.data.phoneNumber || ''}
                                                name='phone_number'
                                                className={
                                                    [
                                                        'input-d',
                                                        styles['input-item']
                                                    ].join(' ')
                                                } type='text' />
                                        </div> */}
                                    </div>
                                    {
                                        permissions.has('school_class_update') ?
                                            <div className={styles['action-items']}>
                                                <button name='save'
                                                    className={
                                                        [
                                                            'action-item-d',
                                                            isPending ? 'button-submitting' : ''
                                                        ].join(' ')
                                                    }
                                                >{language?.save}</button>
                                            </div>
                                            : null
                                    }
                                </form>
                            ) : null
                        }
                    </div>
                </>
            </div>
        </div>
    )
}