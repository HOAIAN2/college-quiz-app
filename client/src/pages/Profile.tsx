import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { SyntheticEvent, useEffect, useState } from 'react'
import Datetime from 'react-datetime'
import { apiGetUser, apiUpdateUser } from '../api/user'
import ChangePassword from '../components/ChangePassword'
import CustomSelect from '../components/CustomSelect'
import SuspenseLoading from '../components/SuspenseLoading'
import { USER_ACTION } from '../contexts/UserContext'
import useAppContext from '../hooks/useAppContext'
import useLanguage from '../hooks/useLanguage'
import { ProfileLanguage } from '../models/lang'
import styles from '../styles/Profile.module.css'

export default function Profile() {
    const language = useLanguage<ProfileLanguage>('page.profile')
    const { user, appLanguage } = useAppContext()
    const [changePasswordMode, setChangePasswordMode] = useState(false)
    const queryClient = useQueryClient()
    const queryData = useQuery({
        queryKey: ['current-user'],
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
        if (queryData.data?.role.name !== 'admin') return
        document.querySelector(styles['form-data'])?.querySelectorAll('input[name]').forEach(node => {
            const element = node as HTMLInputElement
            element.classList.remove(styles['error'])
            getParentElement(element).removeAttribute('data-error')
        })
        const form = e.target as HTMLFormElement
        const formData = new FormData(form)
        await apiUpdateUser(formData, queryData.data.id)
    }
    const { mutate } = useMutation({
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
        onSuccess: () => {
            apiGetUser()
                .then((data) => {
                    user.dispatchUser({ type: USER_ACTION.SET, payload: data })
                })
        }
    })
    const genderOptions = [
        { value: 'male', label: language?.genders.male },
        { value: 'female', label: language?.genders.female },
    ]
    const fullName = appLanguage.language === 'vi'
        ? [
            queryData.data?.lastName,
            queryData.data?.firstName
        ].join(' ')
        :
        [
            queryData.data?.firstName,
            queryData.data?.lastName
        ].join(' ')
    useEffect(() => {
        return () => {
            queryClient.removeQueries({ queryKey: ['current-user'] })
        }
    }, [queryClient])
    if (!queryData.data) return <SuspenseLoading />
    return (
        <>
            {changePasswordMode === true ?
                <ChangePassword
                    setInsertMode={setChangePasswordMode}
                /> : null}
            <div className={
                [
                    'dashboard-d',
                    styles['profile-content']
                ].join(' ')
            }>
                <div className={
                    [
                        styles['form-content']
                    ].join(' ')
                }>
                    <div className={styles['header']}>
                        <h2 className={styles['title']}>{fullName}</h2>
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
                                <label className={styles['required']} htmlFor='email'>{language?.email}</label>
                                <input
                                    id='email'
                                    readOnly={queryData.data?.role.name === 'admin' ? false : true}
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
                                <label className={styles['required']} htmlFor='phone_number'>{language?.phoneNumber}</label>
                                <input
                                    id='phone_number'
                                    readOnly={queryData.data?.role.name === 'admin' ? false : true}
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
                                    readOnly={queryData.data?.role.name === 'admin' ? false : true}
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
                                    readOnly={queryData.data?.role.name === 'admin' ? false : true}
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
                                    readOnly={queryData.data?.role.name === 'admin' ? false : true}
                                    defaultValue={queryData.data.shortcode}
                                    name='shortcode'
                                    className={
                                        [
                                            'input-d',
                                            styles['input-item']
                                        ].join(' ')
                                    } type='text' />
                            </div>
                            {queryData.data?.role.name === 'student' ?
                                <div className={styles['wrap-item']}>
                                    <label className={styles['required']} htmlFor='school_class_id'>{language?.class}</label>
                                    <input
                                        id='school_class_id'
                                        readOnly={true}
                                        defaultValue={queryData.data.schoolClassId || ''}
                                        name='school_class_id'
                                        className={
                                            [
                                                'input-d',
                                                styles['input-item']
                                            ].join(' ')
                                        } type='text' />
                                </div> : null
                            }
                            <div className={styles['wrap-item']}>
                                <label className={styles['required']} htmlFor=''>{language?.genders.gender}</label>
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
                                <label className={styles['required']} htmlFor='address'>{language?.address}</label>
                                <input
                                    id='address'
                                    readOnly={queryData.data?.role.name === 'admin' ? false : true}
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
                                            readOnly: queryData.data?.role.name === 'admin' ? false : true,
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
                            queryData.data?.role.name === 'admin' ?
                                <div className={styles['action-items']}>
                                    <button name='save' className='action-item-d'>{language?.save}</button>
                                </div>
                                : null
                        }
                    </form>
                </div>
                <div className={styles['header']}>
                    <h2 className={styles['title']}>{language?.otherSection.other}</h2>
                </div>
                <div className={styles['other-section']}>
                    <button
                        className={
                            [
                                'button-d',
                                styles['button']
                            ].join(' ')
                        }
                        onClick={() => { setChangePasswordMode(true) }}>{language?.otherSection.changePassword}</button>
                </div>
            </div>
        </>
    )
}