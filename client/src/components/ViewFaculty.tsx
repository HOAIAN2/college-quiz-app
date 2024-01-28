import { useMutation, useQuery } from '@tanstack/react-query'
import { SyntheticEvent, useEffect, useState } from 'react'
import { RxCross2 } from 'react-icons/rx'
import { apiGetFacultyById, apiUpdateFaculty } from '../api/faculty'
import { apiAutoCompleteUser } from '../api/user'
import useAppContext from '../hooks/useAppContext'
import useDebounce from '../hooks/useDebounce'
import useLanguage from '../hooks/useLanguage'
import { ComponentViewFacultyLang } from '../models/lang'
import { User } from '../models/user'
import styles from '../styles/global/ViewModel.module.css'
import Loading from './Loading'

type ViewFacultyProps = {
    id: number
    onMutateSuccess: () => void
    setViewMode: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ViewFaculty({
    id,
    onMutateSuccess,
    setViewMode
}: ViewFacultyProps) {
    const [hide, setHide] = useState(true)
    const language = useLanguage<ComponentViewFacultyLang>('component.view_faculty')
    const { user, permissions, appLanguage } = useAppContext()
    const [queryUser, setQueryUser] = useState('')
    const debounceQueryUser = useDebounce(queryUser, 200) as string
    const handleTurnOffImportMode = () => {
        const transitionTiming = getComputedStyle(document.documentElement).getPropertyValue('--transition-timing-fast')
        const timing = Number(transitionTiming.replace('s', '')) * 1000
        setHide(true)
        setTimeout(() => {
            setViewMode(false)
        }, timing)
    }
    const queryData = useQuery({
        queryKey: ['faculty', id],
        queryFn: () => apiGetFacultyById(id)
    })
    const userQueryData = useQuery({
        queryKey: ['user-auto-complete', debounceQueryUser],
        queryFn: () => {
            return apiAutoCompleteUser('teacher', debounceQueryUser)
        },
        enabled: debounceQueryUser ? true : false
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
    const handleUpdateUser = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
        e.preventDefault()
        if (user.user?.role.name !== 'admin') return
        document.querySelector(styles['form-data'])?.querySelectorAll('input[name]').forEach(node => {
            const element = node as HTMLInputElement
            element.classList.remove(styles['error'])
            getParentElement(element).removeAttribute('data-error')
        })
        const form = e.target as HTMLFormElement
        const formData = new FormData(form)
        await apiUpdateFaculty(formData, id)
    }
    const { mutate, isPending } = useMutation({
        mutationFn: handleUpdateUser,
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
    const getFullName = (user: User | null) => {
        return appLanguage.language === 'vi'
            ? [
                user?.lastName,
                user?.firstName
            ].join(' ')
            :
            [
                user?.firstName,
                user?.lastName
            ].join(' ')
    }
    useEffect(() => {
        setHide(false)
    }, [])
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
                                                disabled={!permissions.has('faculty_update')}
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
                                                disabled={!permissions.has('faculty_update')}
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
                                            <label htmlFor='email'>{language?.email}</label>
                                            <input
                                                id='email'
                                                disabled={!permissions.has('faculty_update')}
                                                defaultValue={queryData.data.email || ''}
                                                name='email'
                                                className={
                                                    [
                                                        'input-d',
                                                        styles['input-item']
                                                    ].join(' ')
                                                } type='text' />
                                        </div>
                                        <div className={styles['wrap-item']}>
                                            <label htmlFor='phone_number'>{language?.phoneNumber}</label>
                                            <input
                                                id='phone_number'
                                                disabled={!permissions.has('faculty_update')}
                                                defaultValue={queryData.data.phoneNumber || ''}
                                                name='phone_number'
                                                className={
                                                    [
                                                        'input-d',
                                                        styles['input-item']
                                                    ].join(' ')
                                                } type='text' />
                                        </div>
                                        <div className={styles['wrap-item']}>
                                            <label htmlFor='leader'>{language?.leader}</label>
                                            <input
                                                id='leader'
                                                disabled={!permissions.has('faculty_update')}
                                                defaultValue={getFullName(queryData.data.leader) || ''}
                                                name='leader'
                                                onInput={e => { setQueryUser(e.currentTarget.value) }}
                                                className={
                                                    [
                                                        'input-d',
                                                        styles['input-item']
                                                    ].join(' ')
                                                } type='text'
                                                list='userList'
                                            />
                                            <datalist id='userList'>
                                                {
                                                    userQueryData.data ? userQueryData.data.map(item => {
                                                        return <option key={`user-${item.id}`} value={item.shortcode}>{getFullName(item)}</option>
                                                    }) : null
                                                }
                                            </datalist>
                                        </div>
                                    </div>
                                    {
                                        permissions.has('faculty_update') ?
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