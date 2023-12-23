import { useMutation, useQuery } from '@tanstack/react-query'
import { SyntheticEvent, useEffect } from 'react'
import Datetime from 'react-datetime'
import { apiGetUsersById, apiUpdateUser } from '../api/user'
import useAppContext from '../hooks/useAppContext'
import useLanguage from '../hooks/useLanguage'
import { ViewUserLanguage } from '../models/lang'
import { UserDetail } from '../models/user'
import styles from '../styles/ViewUser.module.css'
import CustomSelect from './CustomSelect'
import Loading from './Loading'

type ViewUserProps = {
    id: number | string,
    setUserDetail?: React.Dispatch<React.SetStateAction<UserDetail | null>>
}
export default function ViewUser({
    id,
    setUserDetail
}: ViewUserProps) {
    const language = useLanguage<ViewUserLanguage>('component.view_user')
    const { user } = useAppContext()
    const queryData = useQuery({
        queryKey: ['user', id],
        queryFn: () => {
            const currentPath = location.pathname.split('/')
            const currentId = currentPath.pop() || currentPath.pop() as string
            return apiGetUsersById(id || currentId)
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
                        getParentElement(element).setAttribute('data-error', error[key as keyof typeof error][0] as string)
                    }
                }
            }
        },
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
        if (queryData.data?.user && setUserDetail) {
            setUserDetail(queryData.data)
        }
    }, [queryData.data, setUserDetail])
    return (
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
                                    <label className={styles['required']} htmlFor="">{language?.email}</label>
                                    <input
                                        readOnly={user.user?.role.name === 'admin' ? false : true}
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
                                        readOnly={user.user?.role.name === 'admin' ? false : true}
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
                                        readOnly={user.user?.role.name === 'admin' ? false : true}
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
                                        readOnly={user.user?.role.name === 'admin' ? false : true}
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
                                            readOnly={user.user?.role.name === 'admin' ? false : true}
                                            defaultValue={queryData.data.user.schoolClassId || ''}
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
                                            queryData.data.user.gender === 'male'
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
                                <div className={styles['wrap-item']}>
                                    <label className={styles['required']} htmlFor="">{language?.status.accountStatus}</label>
                                    <CustomSelect
                                        name='is_active'
                                        defaultOption={
                                            queryData.data.user.isActive
                                                ? statusOptions[0] : statusOptions[1]
                                        }
                                        options={statusOptions}
                                        className={
                                            [
                                                styles['custom-select']
                                            ].join(' ')
                                        }
                                    />
                                </div>
                                <div className={styles['wrap-item']}>
                                    <label htmlFor="">{language?.password}</label>
                                    <input
                                        readOnly={user.user?.role.name === 'admin' ? false : true}
                                        placeholder={language?.leaveBlank}
                                        name='password'
                                        className={
                                            [
                                                'input-d',
                                                styles['input-item']
                                            ].join(' ')
                                        } type="password" />
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
                    ) : null
                }
            </div>
        </>
    )
}