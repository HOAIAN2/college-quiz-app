import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { SyntheticEvent, useEffect, useState } from 'react'
import Datetime from 'react-datetime'
import { RxCross2 } from 'react-icons/rx'
import { apiAutoCompleteFaculty } from '../api/faculty'
import { apiAutoCompleteClass } from '../api/school-class'
import { apiGetUserById, apiUpdateUser } from '../api/user'
import useAppContext from '../hooks/useAppContext'
import useDebounce from '../hooks/useDebounce'
import useLanguage from '../hooks/useLanguage'
import { ComponentViewUserLang } from '../models/lang'
import styles from '../styles/global/ViewModel.module.css'
import languageUtils from '../utils/languageUtils'
import CustomSelect from './CustomSelect'
import Loading from './Loading'

type ViewUserProps = {
    id: number
    onMutateSuccess: () => void
    setViewMode: React.Dispatch<React.SetStateAction<boolean>>
}
export default function ViewUser({
    id,
    onMutateSuccess,
    setViewMode
}: ViewUserProps) {
    const [hide, setHide] = useState(true)
    const language = useLanguage<ComponentViewUserLang>('component.view_user')
    const { user, permissions } = useAppContext()
    const [queryClass, setQueryClass] = useState('')
    const [queryFaculty, setQueryFaculty] = useState('')
    const debouceQueryClass = useDebounce(queryClass, 200) as string
    const debouceQueryFaculty = useDebounce(queryFaculty, 200) as string
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
        queryKey: ['user', id],
        queryFn: () => apiGetUserById(id)
    })
    const classQueryData = useQuery({
        queryKey: ['class-query', debouceQueryClass],
        queryFn: () => apiAutoCompleteClass(debouceQueryClass),
        enabled: debouceQueryClass && permissions.has('school_class_view') ? true : false
    })
    const facultyQueryData = useQuery({
        queryKey: ['faculty-query', debouceQueryFaculty],
        queryFn: () => apiAutoCompleteFaculty(debouceQueryFaculty),
        enabled: debouceQueryFaculty && permissions.has('faculty_view') ? true : false
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
        await apiUpdateUser(formData, id)
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
    const genderOptions = [
        { value: 'male', label: language?.genders.male },
        { value: 'female', label: language?.genders.female },
    ]
    const statusOptions = [
        { value: '1', label: language?.status.active },
        { value: '0', label: language?.status.inactive },
    ]
    useEffect(() => {
        if (queryData.data) {
            if (queryData.data.role.name === 'student')
                setQueryClass(queryData.data.schoolClass?.shortcode as string)
        }
    }, [queryData.data])
    useEffect(() => {
        setHide(false)
        return () => {
            queryClient.removeQueries({ queryKey: ['user', id] })
            queryClient.removeQueries({ queryKey: ['class-query'] })
            queryClient.removeQueries({ queryKey: ['faculty-query'] })
        }
    }, [queryClient, id])
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
                    <h2 className={styles['title']}>{languageUtils.getFullName(queryData.data?.firstName, queryData.data?.lastName)}</h2>
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
                                            <label className={styles['required']} htmlFor='email'>{language?.email}</label>
                                            <input
                                                id='email'
                                                disabled={!permissions.has('user_update')}
                                                defaultValue={queryData.data.email}
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
                                                disabled={!permissions.has('user_update')}
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
                                            <label className={styles['required']} htmlFor='first_name'>{language?.firstName}</label>
                                            <input
                                                id='first_name'
                                                disabled={!permissions.has('user_update')}
                                                defaultValue={queryData.data.firstName}
                                                name='first_name'
                                                className={
                                                    [
                                                        'input-d',
                                                        styles['input-item']
                                                    ].join(' ')
                                                } type='text' />
                                        </div>
                                        <div className={styles['wrap-item']}>
                                            <label className={styles['required']} htmlFor='last_name'>{language?.lastName}</label>
                                            <input
                                                id='last_name'
                                                disabled={!permissions.has('user_update')}
                                                defaultValue={queryData.data.lastName}
                                                name='last_name'
                                                className={
                                                    [
                                                        'input-d',
                                                        styles['input-item']
                                                    ].join(' ')
                                                } type='text' />
                                        </div>
                                        <div className={styles['wrap-item']}>
                                            <label className={styles['required']} htmlFor='shortcode'>{language?.shortcode}</label>
                                            <input
                                                id='shortcode'
                                                disabled={!permissions.has('user_update')}
                                                defaultValue={queryData.data.shortcode}
                                                name='shortcode'
                                                className={
                                                    [
                                                        'input-d',
                                                        styles['input-item']
                                                    ].join(' ')
                                                } type='text' />
                                        </div>
                                        {queryData.data.role.name === 'student' ?
                                            <div className={styles['wrap-item']}>
                                                <label className={styles['required']} htmlFor='school_class'>{language?.class}</label>
                                                <input
                                                    id='school_class'
                                                    disabled={!permissions.has('user_update')}
                                                    defaultValue={queryData.data.schoolClass?.shortcode || ''}
                                                    name='school_class'
                                                    onInput={(e) => { setQueryClass(e.currentTarget.value) }}
                                                    className={
                                                        [
                                                            'input-d',
                                                            styles['input-item']
                                                        ].join(' ')
                                                    }
                                                    list='classList'
                                                />
                                                <datalist id='classList'>
                                                    {
                                                        classQueryData.data ? classQueryData.data.map(item => {
                                                            return <option key={`class-${item.id}`} value={item.shortcode}>{item.name}</option>
                                                        }) : null
                                                    }
                                                </datalist>
                                            </div>
                                            : queryData.data.role.name === 'teacher' ?
                                                <div className={styles['wrap-item']}>
                                                    <label className={styles['required']} htmlFor='faculty_id'>{language?.faculty}</label>
                                                    <input
                                                        id='faculty_id'
                                                        disabled={!permissions.has('user_update')}
                                                        defaultValue={queryData.data.faculty?.shortcode || ''}
                                                        name='faculty_id'
                                                        value={queryFaculty}
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
                                                : null
                                        }
                                        <div
                                            className={styles['wrap-item']}
                                            style={{ zIndex: 10 }}>
                                            <label className={styles['required']} htmlFor=''>{language?.genders.gender}</label>
                                            <CustomSelect
                                                name='gender'
                                                defaultOption={
                                                    queryData.data.gender === 'male'
                                                        ? genderOptions[0] : genderOptions[1]
                                                }
                                                disabled={!permissions.has('user_update')}
                                                options={genderOptions}
                                                className={
                                                    [
                                                        styles['custom-select']
                                                    ].join(' ')
                                                }
                                            />
                                        </div>
                                        <div className={styles['wrap-item']}>
                                            <label className={styles['required']} htmlFor='address'>{language?.address}</label>
                                            <input
                                                id='address'
                                                disabled={!permissions.has('user_update')}
                                                defaultValue={queryData.data.address}
                                                name='address'
                                                className={
                                                    [
                                                        'input-d',
                                                        styles['input-item']
                                                    ].join(' ')
                                                } type='text' />
                                        </div>
                                        <div className={styles['wrap-item']}>
                                            <label className={styles['required']} htmlFor='birth_date'>{language?.birthDate}</label>
                                            <Datetime
                                                initialValue={new Date(queryData.data.birthDate)}
                                                inputProps={
                                                    {
                                                        id: 'birth_date',
                                                        disabled: !permissions.has('user_view'),
                                                        name: 'birth_date',
                                                        className: [
                                                            'input-d',
                                                            styles['input-item']
                                                        ].join(' ')
                                                    }
                                                }
                                                closeOnSelect={true}
                                                timeFormat={false}
                                            />
                                        </div>
                                        <div className={styles['wrap-item']}>
                                            <label className={styles['required']} htmlFor=''>{language?.status.accountStatus}</label>
                                            <CustomSelect
                                                name='is_active'
                                                defaultOption={
                                                    queryData.data.isActive
                                                        ? statusOptions[0] : statusOptions[1]
                                                }
                                                disabled={!permissions.has('user_update')}
                                                options={statusOptions}
                                                className={
                                                    [
                                                        styles['custom-select']
                                                    ].join(' ')
                                                }
                                            />
                                        </div>
                                        <div className={styles['wrap-item']}>
                                            <label htmlFor='password'>{language?.password}</label>
                                            <input
                                                id='password'
                                                readOnly={user.user?.role.name === 'admin' ? false : true}
                                                placeholder={language?.leaveBlank}
                                                name='password'
                                                className={
                                                    [
                                                        'input-d',
                                                        styles['input-item']
                                                    ].join(' ')
                                                } type='password' />
                                        </div>
                                    </div>
                                    {
                                        permissions.has('user_update') ?
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