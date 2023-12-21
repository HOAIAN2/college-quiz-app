import { useMutation, useQuery } from '@tanstack/react-query'
import { SyntheticEvent, useEffect, useState } from 'react'
import Datetime from 'react-datetime'
import { apiGetUsersById, apiUpdateUser } from '../api/user'
import useAppContext from '../hooks/useAppContext'
import useLanguage from '../hooks/useLanguage'
import { ViewUserLanguage } from '../models/lang'
import { UserDetail } from '../models/user'
import styles from '../styles/ViewUser.module.css'
import CustomSelect from './CustomSelect'
import FormInput from './FormInput'
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
    const [gender, setGender] = useState('male')
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
        formData.append('gender', gender)
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
    const options = [
        { value: 'male', label: language?.genders.male },
        { value: 'female', label: language?.genders.female },
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
                                <FormInput
                                    preventInput
                                    label={language?.email}
                                    name='email'
                                    required={true}
                                    type='text'
                                    defaultValue={queryData.data.user.email}
                                    wrapClassName={styles['wrap-item']}
                                    inputClassName={
                                        [
                                            'input-d',
                                            styles['input-item']
                                        ].join(' ')
                                    }
                                />
                                <FormInput
                                    preventInput
                                    label={language?.firstName}
                                    name='first_name'
                                    required={true}
                                    type='text'
                                    defaultValue={queryData.data.user.firstName}
                                    wrapClassName={styles['wrap-item']}
                                    inputClassName={
                                        [
                                            'input-d',
                                            styles['input-item']
                                        ].join(' ')
                                    }
                                />
                                <FormInput
                                    preventInput
                                    label={language?.lastName}
                                    name='last_name'
                                    required={true}
                                    type='text'
                                    defaultValue={queryData.data.user.lastName}
                                    wrapClassName={styles['wrap-item']}
                                    inputClassName={
                                        [
                                            'input-d',
                                            styles['input-item']
                                        ].join(' ')
                                    }
                                />
                                <FormInput
                                    preventInput
                                    label={language?.shortcode}
                                    name='shortcode'
                                    required={true}
                                    type='text'
                                    defaultValue={queryData.data.user.shortcode}
                                    wrapClassName={styles['wrap-item']}
                                    inputClassName={
                                        [
                                            'input-d',
                                            styles['input-item']
                                        ].join(' ')
                                    }
                                />
                                {queryData.data?.user.role.name === 'student' ?
                                    <FormInput
                                        preventInput
                                        label={language?.class}
                                        name='school_class_id'
                                        required={true}
                                        type='text'
                                        defaultValue={queryData.data.user.schoolClassId}
                                        wrapClassName={styles['wrap-item']}
                                        inputClassName={
                                            [
                                                'input-d',
                                                styles['input-item']
                                            ].join(' ')
                                        }
                                    />
                                    : null
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
                                <FormInput
                                    preventInput
                                    label={language?.address}
                                    name='address'
                                    required={true}
                                    type='text'
                                    defaultValue={queryData.data.user.address}
                                    wrapClassName={styles['wrap-item']}
                                    inputClassName={
                                        [
                                            'input-d',
                                            styles['input-item']
                                        ].join(' ')
                                    }
                                />
                                <div className={styles['wrap-item']}>
                                    <label className={styles['required']} htmlFor="">{language?.birthDate}</label>
                                    <Datetime
                                        initialValue={new Date(queryData.data.user.birthDate)}
                                        // onChange={(value) => {
                                        //     if (typeof value === 'string') return
                                        //     setBirthDate(value.toDate())
                                        // }}
                                        inputProps={
                                            {
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
                                <FormInput
                                    preventInput
                                    label={language?.password}
                                    name='address'
                                    required={true}
                                    type='text'
                                    placeHolder={language?.leaveBlank}
                                    wrapClassName={styles['wrap-item']}
                                    inputClassName={
                                        [
                                            'input-d',
                                            styles['input-item']
                                        ].join(' ')
                                    }
                                />
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