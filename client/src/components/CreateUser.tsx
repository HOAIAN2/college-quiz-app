import { useMutation } from '@tanstack/react-query'
import { SyntheticEvent, useEffect, useState } from 'react'
import Datetime from 'react-datetime'
import 'react-datetime/css/react-datetime.css'
import {
    RxCross2
} from 'react-icons/rx'
import { apiCreateUser } from '../api/user'
import useLanguage from '../hooks/useLanguage'
import { CreateUserLanguage } from '../models/lang'
import { RoleName } from '../models/user'
import styles from '../styles/CreateUser.module.css'
import CustomSelect from './CustomSelect'

type CreateUserProps = {
    role: RoleName
    setInsertMode: React.Dispatch<React.SetStateAction<boolean>>
}
export default function CreateUser({
    role,
    setInsertMode
}: CreateUserProps) {
    const language = useLanguage<CreateUserLanguage>('component.create_user')
    const [hide, setHide] = useState(true)
    const handleTurnOffInsertMode = () => {
        const transitionTiming = getComputedStyle(document.documentElement).getPropertyValue('--transition-timing-fast')
        const timing = Number(transitionTiming.replace('s', '')) * 1000
        setHide(true)
        setTimeout(() => {
            setInsertMode(false)
        }, timing)
    }
    const getParentElement = (element: HTMLInputElement) => {
        let parent = element.parentElement as HTMLElement
        while (!parent.classList.contains(styles['wrap-item'])) parent = parent.parentElement as HTMLElement
        return parent
    }
    const handleCreateUser = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
        e.preventDefault()
        document.querySelector(styles['form-data'])?.querySelectorAll('input[name]').forEach(node => {
            const element = node as HTMLInputElement
            element.classList.remove(styles['error'])
            getParentElement(element).removeAttribute('data-error')
        })
        const submitter = e.nativeEvent.submitter as HTMLButtonElement
        const form = e.target as HTMLFormElement
        const formData = new FormData(form)
        formData.append('role', role !== undefined ? role : 'student')
        await apiCreateUser(formData)
        if (submitter.name === 'save') handleTurnOffInsertMode()
        else form.reset()
    }
    const handleOnInput = (e: React.FormEvent<HTMLFormElement>) => {
        const element = e.target as HTMLInputElement
        if (element) {
            element.classList.remove(styles['error'])
            getParentElement(element).removeAttribute('data-error')
        }
    }
    const { mutate } = useMutation({
        mutationFn: handleCreateUser,
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
        setHide(false)
    }, [])
    return (
        <div className={
            [
                styles['create-user-container'],
                hide ? styles['hide'] : ''
            ].join(' ')
        }>
            <div className={
                [
                    styles['create-user-form'],
                    hide ? styles['hide'] : ''
                ].join(' ')
            }>
                <div className={styles['header']}>
                    <h2 className={styles['title']}>{
                        [
                            language?.create,
                            language && role ? language[role] : ''
                        ].join(' ')
                    }</h2>
                    <div className={styles['esc-button']}
                        onClick={handleTurnOffInsertMode}
                    >
                        <RxCross2 />
                    </div>
                </div>
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
                                name='shortcode'
                                className={
                                    [
                                        'input-d',
                                        styles['input-item']
                                    ].join(' ')
                                } type="text" />
                        </div>
                        {role === 'student' ?
                            <div className={styles['wrap-item']}>
                                <label className={styles['required']} htmlFor="">{language?.class}</label>
                                <input
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
                                defaultOption={options[0]}
                                options={options}
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
                                initialValue={new Date()}
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
                        <div className={styles['wrap-item']}>
                            <label className={styles['required']} htmlFor="">{language?.password}</label>
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
                        <button name='save-more' className='action-item-d-white'>{language?.saveMore}</button>
                    </div>
                </form>
            </div >
        </div >
    )
}