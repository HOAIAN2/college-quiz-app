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

type CreateUserProps = {
    type?: 'student' | 'teacher' | 'admin'
    setInsertMode: React.Dispatch<React.SetStateAction<boolean>>
}
export default function CreateUser({
    type,
    setInsertMode
}: CreateUserProps) {
    const [hide, setHide] = useState(true)
    const [gender, setGender] = useState('male')
    const [birthDate, setBirthDate] = useState<Date>(new Date())
    const handleTurnOffInsertMode = () => {
        const transitionTiming = getComputedStyle(document.documentElement).getPropertyValue('--transition-timing-fast')
        setHide(true)
        setTimeout(() => {
            setInsertMode(false)
        }, parseInt(transitionTiming.substring(0, transitionTiming.length)))
    }
    const handleCreateUser = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
        e.preventDefault()
        document.querySelectorAll('input[name]').forEach(element => {
            element.classList.remove(styles['error'])
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
    const { mutate } = useMutation({
        mutationFn: handleCreateUser,
        onError: (error) => {
            if (typeof error === 'object') {
                for (const key in error) {
                    document.querySelector(`input[name="${key}"]`)?.classList.add(styles['error'])
                }
            }
        },
    })
    const options = [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
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
                    <h2 className={styles['title']}>Tạo sinh viên</h2>
                    <div className={styles['esc-button']}
                        onClick={handleTurnOffInsertMode}
                    >
                        <RxCross2 />
                    </div>
                </div>
                <form onSubmit={(e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
                    mutate(e)
                }} className={styles['form-data']}>
                    <div className={
                        [
                            styles['group-inputs']
                        ].join(' ')
                    }>
                        {/* This div wrap one input item */}
                        <div className={styles['wrap-item']}>
                            <label htmlFor="">Email</label>
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
                            <label htmlFor="">Name</label>
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
                            <label htmlFor="">shortcode</label>
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
                            <label htmlFor="">Gender</label>
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
                            <label htmlFor="">Address</label>
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
                            <label htmlFor="">Birth date</label>
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
                            <label htmlFor="">Password</label>
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
                        <button name='save' className='action-item-d'>Save</button>
                        <button name='save-more' className='action-item-d-white'>Save more</button>
                    </div>
                </form>
            </div >
        </div >
    )
}