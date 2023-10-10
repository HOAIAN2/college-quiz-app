import { useEffect, useState } from 'react'
import {
    RxCross2
} from 'react-icons/rx'
import styles from '../styles/CreateUser.module.css'

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
            </div>
        </div>
    )
}