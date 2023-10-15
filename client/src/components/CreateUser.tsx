import { SyntheticEvent, useEffect, useState } from 'react'
import {
    RxCross2
} from 'react-icons/rx'
import styles from '../styles/CreateUser.module.css'
import { reqCreateUser } from '../utils/user'

interface CreateUserProps {
    type?: 'student' | 'teacher' | 'admin'
    setInsertMode: React.Dispatch<React.SetStateAction<boolean>>
}
export default function CreateUser({
    setInsertMode
}: CreateUserProps) {
    const [hide, setHide] = useState(true)
    const handleTurnOffInsertMode = () => {
        setHide(true)
        setTimeout(() => {
            setInsertMode(false)
        }, 400)
    }
    const handleCreateUser = (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
        e.preventDefault()
        const submitter = e.nativeEvent.submitter as HTMLButtonElement
        const form = e.currentTarget
        const formData = new FormData(form)
        reqCreateUser(formData)
            .then(() => {
                if (submitter.name === 'save') handleTurnOffInsertMode()
                else form.reset()
            })
            .catch(e => {
                console.log(e)
            })
    }
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
                <form onSubmit={handleCreateUser} className={styles['form-data']}>
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
                    </div>
                    <div className={styles['action-items']}>
                        <button name='save' className='action-item-d'>Save</button>
                        <button name='save-more' className='action-item-d-white'>Save more</button>
                    </div>
                </form>
            </div>
        </div>
    )
}