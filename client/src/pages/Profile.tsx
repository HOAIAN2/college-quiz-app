import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { SyntheticEvent, useEffect, useState } from 'react'
import Datetime from 'react-datetime'
import { apiGetUser, apiUpdateUser } from '../api/user'
import ChangePassword from '../components/ChangePassword'
import CustomSelect from '../components/CustomSelect'
import Loading from '../components/Loading'
import SuspenseLoading from '../components/SuspenseLoading'
import useAppContext from '../hooks/useAppContext'
import useLanguage from '../hooks/useLanguage'
import { PageProfileLang } from '../models/lang'
import styles from '../styles/Profile.module.css'

export default function Profile() {
    const language = useLanguage<PageProfileLang>('page.profile')
    const { user, appLanguage, permissions } = useAppContext()
    const [changePasswordMode, setChangePasswordMode] = useState(false)
    const queryClient = useQueryClient()
    const queryData = useQuery({
        queryKey: ['current-user'],
        queryFn: apiGetUser,
    })
    const getParentElement = (element: HTMLInputElement) => {
        let parent = element.parentElement as HTMLElement
        while (!parent.classList.contains(styles['wrap-item'])) parent = parent.parentElement as HTMLElement
        return parent
    }
    const handleOnInput = (e: React.FormEvent<HTMLFormElement>) => {
        const element = e.target as HTMLInputElement
        if (element) {
            element.classList.remove('error')
            getParentElement(element).removeAttribute('data-error')
        }
    }
    const handleUpdateUser = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
        e.preventDefault()
        if (!permissions.has('user_update')) return
        document.querySelector(styles['form-data'])?.querySelectorAll('input[name]').forEach(node => {
            const element = node as HTMLInputElement
            element.classList.remove('error')
            getParentElement(element).removeAttribute('data-error')
        })
        const form = e.target as HTMLFormElement
        const formData = new FormData(form)
        queryData.data && await apiUpdateUser(formData, queryData.data.user.id)
    }
    const { mutate, isPending } = useMutation({
        mutationFn: handleUpdateUser,
        onError: (error: object) => {
            if (typeof error === 'object') {
                for (const key in error) {
                    const element = document.querySelector(`input[data-selector='${key}'],[name='${key}']`) as HTMLInputElement
                    if (element) {
                        element.classList.add('error')
                        getParentElement(element).setAttribute('data-error', error[key as keyof typeof error][0] as string)
                    }
                }
            }
        },
        onSuccess: () => {
            apiGetUser()
                .then((data) => {
                    user.setUser(data.user)
                    permissions.setItems(data.permissions)
                })
        }
    })
    const genderOptions = [
        { value: 'male', label: language?.genders.male },
        { value: 'female', label: language?.genders.female },
    ]
    const fullName = appLanguage.language === 'vi'
        ? [
            queryData.data?.user.lastName,
            queryData.data?.user.firstName
        ].join(' ')
        :
        [
            queryData.data?.user.firstName,
            queryData.data?.user.lastName
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
                {
                    isPending ? <Loading /> : null
                }
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
                                    disabled={!permissions.has('user_update')}
                                    defaultValue={queryData.data.user.email}
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
                                    defaultValue={queryData.data.user.phoneNumber || ''}
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
                                    defaultValue={queryData.data.user.firstName}
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
                                    defaultValue={queryData.data.user.lastName}
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
                                    defaultValue={queryData.data.user.shortcode}
                                    name='shortcode'
                                    className={
                                        [
                                            'input-d',
                                            styles['input-item']
                                        ].join(' ')
                                    } type='text' />
                            </div>
                            {queryData.data?.user.role.name === 'student' ?
                                <div className={styles['wrap-item']}>
                                    <label className={styles['required']} htmlFor='school_class'>{language?.class}</label>
                                    <input
                                        id='school_class'
                                        disabled={!permissions.has('user_update')}
                                        defaultValue={queryData.data.user.schoolClass?.shortcode || ''}
                                        name='school_class'
                                        className={
                                            [
                                                'input-d',
                                                styles['input-item']
                                            ].join(' ')
                                        } type='text' />
                                </div> : queryData.data?.user.role.name === 'teacher'
                                    ? <div className={styles['wrap-item']}>
                                        <label className={styles['required']} htmlFor='faculty'>{language?.faculty}</label>
                                        <input
                                            id='faculty'
                                            disabled={!permissions.has('user_update')}
                                            defaultValue={queryData.data.user.faculty?.shortcode || ''}
                                            name='faculty'
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
                                        queryData.data.user.gender === 'male'
                                            ? genderOptions[0] : genderOptions[1]
                                    }
                                    options={genderOptions}
                                    disabled={!permissions.has('user_update')}
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
                                    defaultValue={queryData.data.user.address}
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
                                    initialValue={new Date(queryData.data.user.birthDate)}
                                    inputProps={
                                        {
                                            id: 'birth_date',
                                            disabled: !permissions.has('user_update'),
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
