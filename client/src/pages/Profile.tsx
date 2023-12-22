import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { SyntheticEvent } from 'react'
import Datetime from 'react-datetime'
import { apiGetUser, apiUpdateUser } from '../api/user'
import CustomSelect from '../components/CustomSelect'
import Loading from '../components/Loading'
import useAppContext from '../hooks/useAppContext'
import useLanguage from '../hooks/useLanguage'
import { ProfileLanguage } from '../models/lang'
import styles from '../styles/Profile.module.css'

export default function Profile() {
    const language = useLanguage<ProfileLanguage>('page.profile')
    const { user } = useAppContext()
    const queryClient = useQueryClient()
    const queryData = useQuery({
        queryKey: ['user', user.user?.id],
        queryFn: () => {
            return apiGetUser()
        },
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
        await apiUpdateUser(formData, user.user.id)
    }
    const { mutate } = useMutation({
        mutationFn: handleUpdateUser,
        onError: (error: object) => {
            if (typeof error === 'object') {
                for (const key in error) {
                    const element = document.querySelector(`input[name="${key}"]`) as HTMLInputElement
                    if (element) {
                        element.classList.add(styles['error'])
                        getParentElement(element).setAttribute('data-error', error[key as keyof typeof error][0] as string)
                    }
                }
            }
        },
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: ['user', user.user?.id] })
        }
    })
    const genderOptions = [
        { value: 'male', label: language?.genders.male },
        { value: 'female', label: language?.genders.female },
    ]
    return (
        <div className={
            [
                'dashboard-d',
                styles['profile-content']
            ].join(' ')
        }>
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
                        <>
                            <div className={styles['header']}>
                                <h2 className={styles['title']}>{[
                                    queryData.data.lastName,
                                    queryData.data.firstName,
                                ].join(' ')}</h2>
                            </div>
                            <form onSubmit={(e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
                                mutate(e)
                            }}
                                onInput={handleOnInput}
                                className={styles['form-data']}>
                                <input name='is_active' defaultValue='1' hidden />
                                <div className={
                                    [
                                        styles['group-inputs']
                                    ].join(' ')
                                }>
                                    <div className={styles['wrap-item']}>
                                        <label className={styles['required']} htmlFor="">{language?.email}</label>
                                        <input
                                            readOnly={user.user?.role.name === 'admin' ? false : true}
                                            defaultValue={queryData.data.email}
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
                                            readOnly={user.user?.role.name === 'admin' ? false : true}
                                            defaultValue={queryData.data.firstName}
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
                                            readOnly={user.user?.role.name === 'admin' ? false : true}
                                            defaultValue={queryData.data.lastName}
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
                                            readOnly={user.user?.role.name === 'admin' ? false : true}
                                            defaultValue={queryData.data.shortcode}
                                            name='shortcode'
                                            className={
                                                [
                                                    'input-d',
                                                    styles['input-item']
                                                ].join(' ')
                                            } type="text" />
                                    </div>
                                    {queryData.data?.role.name === 'student' ?
                                        <div className={styles['wrap-item']}>
                                            <label className={styles['required']} htmlFor="">{language?.class}</label>
                                            <input
                                                readOnly={user.user?.role.name === 'admin' ? false : true}
                                                defaultValue={queryData.data.schoolClassId || ''}
                                                name='school_class_id'
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
                                            name='gender'
                                            defaultOption={
                                                queryData.data.gender === 'male'
                                                    ? genderOptions[0] : genderOptions[1]
                                            }
                                            options={genderOptions}
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
                                            readOnly={user.user?.role.name === 'admin' ? false : true}
                                            defaultValue={queryData.data.address}
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
                                            initialValue={new Date(queryData.data.birthDate)}
                                            inputProps={
                                                {
                                                    readOnly: user.user?.role.name === 'admin' ? false : true,
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
                                </div>
                                {
                                    user.user?.role.name === 'admin' ?
                                        <div className={styles['action-items']}>
                                            <button name='save' className='action-item-d'>{language?.save}</button>
                                        </div>
                                        : null
                                }
                            </form>
                        </>
                    ) : null
                }
            </div>
        </div>
    )
}