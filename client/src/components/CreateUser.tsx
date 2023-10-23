import { SyntheticEvent, useEffect, useState } from 'react'
import {
    RxCross2
} from 'react-icons/rx'
import Datetime from 'react-datetime'
import 'react-datetime/css/react-datetime.css'
import { reqCreateUser } from '../utils/user'
import { useMutation } from '@tanstack/react-query'
import CustomSelect from './CustomSelect'
import styles from '../styles/CreateUser.module.css'
import { useLanguage } from '../contexts/hooks'
import { CreateUserLanguage } from '../models/lang'

type CreateUserProps = {
    type: 'student' | 'teacher' | 'admin'
    setInsertMode: React.Dispatch<React.SetStateAction<boolean>>
}
export default function CreateUser({
    type,
    setInsertMode
}: CreateUserProps) {
    const [language, setLanguage] = useState<CreateUserLanguage>()
    const { appLanguage } = useLanguage()
    const [hide, setHide] = useState(true)
    const [gender, setGender] = useState('male')
    const [birthDate, setBirthDate] = useState<Date>(new Date())
    const handleTurnOffInsertMode = () => {
        const transitionTiming = getComputedStyle(document.documentElement).getPropertyValue('--transition-timing-fast')
        const timing = Number(transitionTiming.replace('s', '')) * 1000
        setHide(true)
        setTimeout(() => {
            setInsertMode(false)
        }, timing)
    }
    const handleCreateUser = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
        e.preventDefault()
        document.querySelectorAll('input[name]').forEach(element => {
            element.classList.remove(styles['error'])
            element.parentElement?.removeAttribute('data-error')
        })
        const submitter = e.nativeEvent.submitter as HTMLButtonElement
        const form = e.target as HTMLFormElement
        const formData = new FormData(form)
        formData.append('role', type !== undefined ? type : 'student')
        formData.append('gender', gender)
        formData.append('birth_date', birthDate.toISOString().split('T')[0])
        await reqCreateUser(formData)
        if (submitter.name === 'save') handleTurnOffInsertMode()
        else form.reset()
    }
    const handleOnInput = (e: React.FormEvent<HTMLFormElement>) => {
        const element = e.target as HTMLInputElement
        if (element) {
            element.classList.remove(styles['error'])
            element.parentElement?.removeAttribute('data-error')
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
        setHide(false)
    }, [])
    useEffect(() => {
        fetch(`/langs/component.create_user.${appLanguage}.json`)
            .then(res => res.json())
            .then((data: CreateUserLanguage) => {
                setLanguage(data)
            })
    }, [appLanguage])
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
                            language && type ? language[type] : ''
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
                            <label className={styles['required']} htmlFor="">{language?.name}</label>
                            <input
                                name='name'
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
                        <div className={styles['wrap-item']}>
                            <label className={styles['required']} htmlFor="">{language?.genders.gender}</label>
                            <CustomSelect
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
                                initialValue={birthDate}
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