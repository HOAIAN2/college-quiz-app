import { SyntheticEvent, useEffect, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { apiGetUsersById, apiUpdateUser } from '../api/user'
import Loading from './Loading'
import Datetime from 'react-datetime'
import useAppContext from '../hooks/useAppContext'
import { ViewUserLanguage } from '../models/lang'
import { UserDetail } from '../models/user'
import styles from '../styles/ViewUser.module.css'
import CustomSelect from './CustomSelect'

type ViewUserProps = {
    id: number | string,
    setUserDetail?: React.Dispatch<React.SetStateAction<UserDetail | null>>
}
export default function ViewUser({
    id,
    setUserDetail
}: ViewUserProps) {
    const [language, setLanguage] = useState<ViewUserLanguage>()
    const { appLanguage } = useAppContext()
    const [gender, setGender] = useState('male')
    const [birthDate, setBirthDate] = useState<Date>(new Date())
    const queryData = useQuery({
        queryKey: ['user', id],
        queryFn: () => {
            const currentPath = location.pathname.split('/')
            const currentId = currentPath.pop() || currentPath.pop() as string
            return apiGetUsersById(id || currentId)
        },
    })
    const handleOnInput = (e: React.FormEvent<HTMLFormElement>) => {
        const element = e.target as HTMLInputElement
        if (element) {
            element.classList.remove(styles['error'])
            element.parentElement?.removeAttribute('data-error')
        }
    }
    const handleUpdateUser = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
        e.preventDefault()
        document.querySelectorAll('input[name]').forEach(element => {
            element.classList.remove(styles['error'])
            element.parentElement?.removeAttribute('data-error')
        })
        const form = e.target as HTMLFormElement
        const formData = new FormData(form)
        // formData.append('role', role !== undefined ? role : 'student')
        formData.append('gender', gender)
        formData.append('birth_date', birthDate.toISOString().split('T')[0])
        await apiUpdateUser(formData, id)
    }
    const { mutate } = useMutation({
        mutationFn: handleUpdateUser,
        onError: (error: object) => {
            if (typeof error === 'object') {
                for (const key in error) {
                    const element = document.querySelector(`input[name="${key}"]`) as HTMLInputElement
                    if (element) {
                        element.classList.add(styles['error'])
                        element.parentElement?.setAttribute('data-error', error[key as keyof typeof error][0] as string)
                    }
                }
            }
        },
    })
    const options = [
        { value: 'male', label: language?.genders.male },
        { value: 'female', label: language?.genders.female },
    ]
    useEffect(() => {
        fetch(`/langs/component.view_user.${appLanguage.language}.json`)
            .then(res => res.json())
            .then((data: ViewUserLanguage) => {
                setLanguage(data)
            })
    }, [appLanguage.language])
    useEffect(() => {
        if (queryData.data?.user) {
            setBirthDate(new Date(queryData.data.user.birthDate))
            setGender(queryData.data.user.gender)
        }
        if (queryData.data?.user && setUserDetail) {
            setUserDetail(queryData.data)
        }
    }, [queryData.data, setUserDetail])
    return (
        <>
            {queryData.isLoading ?
                <Loading />
                : null}
            <div className={styles['form-data']}>
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
                                        <label className={styles['required']} htmlFor="">{language?.email}</label>
                                        <input
                                            defaultValue={queryData.data.user.email}
                                            name='email'
                                            className={
                                                [
                                                    'input-d',
                                                    styles['input-item']
                                                ].join(' ')
                                            } type="text" />
                                    </div>
                                    <div className={styles['wrap-item']}>
                                        <label className={styles['required']} htmlFor="">{language?.firstName}</label>
                                        <input
                                            defaultValue={queryData.data.user.firstName}
                                            name='first_name'
                                            className={
                                                [
                                                    'input-d',
                                                    styles['input-item']
                                                ].join(' ')
                                            } type="text" />
                                    </div>
                                    <div className={styles['wrap-item']}>
                                        <label className={styles['required']} htmlFor="">{language?.lastName}</label>
                                        <input
                                            defaultValue={queryData.data.user.lastName}
                                            name='last_name'
                                            className={
                                                [
                                                    'input-d',
                                                    styles['input-item']
                                                ].join(' ')
                                            } type="text" />
                                    </div>
                                    <div className={styles['wrap-item']}>
                                        <label className={styles['required']} htmlFor="">{language?.shortcode}</label>
                                        <input
                                            defaultValue={queryData.data.user.shortcode}
                                            name='shortcode'
                                            className={
                                                [
                                                    'input-d',
                                                    styles['input-item']
                                                ].join(' ')
                                            } type="text" />
                                    </div>
                                    {queryData.data?.user.role.name === 'student' ?
                                        <div className={styles['wrap-item']}>
                                            <label className={styles['required']} htmlFor="">{language?.class}</label>
                                            <input
                                                defaultValue={queryData.data.user.class || ''}
                                                name='class'
                                                className={
                                                    [
                                                        'input-d',
                                                        styles['input-item']
                                                    ].join(' ')
                                                } type="text" />
                                        </div> : null
                                    }
                                    <div className={styles['wrap-item']}>
                                        <label className={styles['required']} htmlFor="">{language?.genders.gender}</label>
                                        <CustomSelect
                                            defaultOption={
                                                queryData.data.user.gender === 'male'
                                                    ? options[0] : options[1]
                                            }
                                            options={options}
                                            onChange={(option) => {
                                                setGender(option.value)
                                            }}
                                            className={
                                                [
                                                    styles['custom-select']
                                                ].join(' ')
                                            }
                                        />
                                    </div>
                                    <div className={styles['wrap-item']}>
                                        <label className={styles['required']} htmlFor="">{language?.address}</label>
                                        <input
                                            defaultValue={queryData.data.user.address}
                                            name='address'
                                            className={
                                                [
                                                    'input-d',
                                                    styles['input-item']
                                                ].join(' ')
                                            } type="text" />
                                    </div>
                                    <div className={styles['wrap-item']}>
                                        <label className={styles['required']} htmlFor="">{language?.birthDate}</label>
                                        <Datetime
                                            initialValue={new Date(queryData.data.user.birthDate)}
                                            onChange={(value) => {
                                                if (typeof value === 'string') return
                                                setBirthDate(value.toDate())
                                            }}
                                            inputProps={
                                                {
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
                                        <label htmlFor="">{language?.password}</label>
                                        <input
                                            name='password'
                                            className={
                                                [
                                                    'input-d',
                                                    styles['input-item']
                                                ].join(' ')
                                            } type="password" />
                                    </div>
                                </div>
                                <div className={styles['action-items']}>
                                    <button name='save' className='action-item-d'>{language?.save}</button>
                                </div>
                            </form>
                        ) : null
                    }
                </div>
            </div>
        </>
    )
}