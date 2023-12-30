import { useEffect, useState } from 'react'
import { RxCross2 } from 'react-icons/rx'
import { apiExportUsers } from '../api/user'
import { saveBlob } from '../helpers/saveBlob'
import useLanguage from '../hooks/useLanguage'
import { ExportUsersLanguage } from '../models/lang'
import { RoleName } from '../models/user'
import styles from '../styles/ExportUsers.module.css'

type ExportUsersProps = {
    role: RoleName
    setExportMode: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ExportUsers({
    role,
    setExportMode
}: ExportUsersProps) {
    const language = useLanguage<ExportUsersLanguage>('component.export_users')
    const [hide, setHide] = useState(true)
    const handleTurnOffImportMode = () => {
        const transitionTiming = getComputedStyle(document.documentElement).getPropertyValue('--transition-timing-fast')
        const timing = Number(transitionTiming.replace('s', '')) * 1000
        setHide(true)
        setTimeout(() => {
            setExportMode(false)
        }, timing)
    }
    const handleExportUsers = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const fields: string[] = []
        formData.forEach((value) => {
            fields.push(value as string)
        })
        apiExportUsers(role, fields)
            .then(res => {
                const fileName = `Export_${role}_${new Date().toISOString().split('T')[0]}.xlsx`
                saveBlob(res, fileName)
            })
    }
    useEffect(() => {
        setHide(false)
    }, [])
    return (
        <div className={
            [
                styles['export-users-container'],
                hide ? styles['hide'] : ''
            ].join(' ')
        }>
            <div
                className={
                    [
                        styles['export-users-form'],
                        hide ? styles['hide'] : ''
                    ].join(' ')
                }>
                <div className={styles['header']}>
                    <h2 className={styles['title']}></h2>
                    <div className={styles['esc-button']}
                        onClick={handleTurnOffImportMode}
                    >
                        <RxCross2 />
                    </div>
                </div>
                <form onSubmit={handleExportUsers} className={styles['form-data']}>
                    <div className={styles['group-inputs']}>
                        <div className={styles['wrap-item']}>
                            <label htmlFor='shortcode' className={styles['label']}>{language?.shortcode}</label>
                            <input id='shortcode' type='checkbox' name='fields[]' value='shortcode' />
                        </div>
                        <div className={styles['wrap-item']}>
                            <label htmlFor='first_name' className={styles['label']}>{language?.firstName}</label>
                            <input id='first_name' type='checkbox' name='fields[]' value='first_name' />
                        </div>
                        <div className={styles['wrap-item']}>
                            <label htmlFor='last_name' className={styles['label']}>{language?.lastName}</label>
                            <input id='last_name' type='checkbox' name='fields[]' value='last_name' />
                        </div>
                        <div className={styles['wrap-item']}>
                            <label htmlFor='email' className={styles['label']}>{language?.email}</label>
                            <input id='email' type='checkbox' name='fields[]' value='email' />
                        </div>
                        <div className={styles['wrap-item']}>
                            <label htmlFor='phone_number' className={styles['label']}>{language?.phoneNumber}</label>
                            <input id='phone_number' type='checkbox' name='fields[]' value='phone_number' />
                        </div>
                        <div className={styles['wrap-item']}>
                            <label htmlFor='gender' className={styles['label']}>{language?.genders.gender}</label>
                            <input id='gender' type='checkbox' name='fields[]' value='gender' />
                        </div>
                        <div className={styles['wrap-item']}>
                            <label htmlFor='address' className={styles['label']}>{language?.address}</label>
                            <input id='address' type='checkbox' name='fields[]' value='address' />
                        </div>
                        <div className={styles['wrap-item']}>
                            <label htmlFor='birth_date' className={styles['label']}>{language?.birthDate}</label>
                            <input id='birth_date' type='checkbox' name='fields[]' value='birth_date' />
                        </div>
                        {
                            role === 'student' ?
                                <div className={styles['wrap-item']}>
                                    <label htmlFor='school_class_id' className={styles['label']}>{language?.class}</label>
                                    <input id='school_class_id' type='checkbox' name='fields[]' value='school_class_id' />
                                </div>
                                : role === 'teacher' ?
                                    <div className={styles['wrap-item']}>
                                        <label htmlFor='faculty_id' className={styles['label']}>{language?.faculty}</label>
                                        <input id='faculty_id' type='checkbox' name='fields[]' value='faculty_id' />
                                    </div>
                                    : null
                        }
                    </div>
                    <div className={styles['action-items']}>
                        <button name='save' className='action-item-d'>{language?.save}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}