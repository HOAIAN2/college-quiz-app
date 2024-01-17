import { useEffect, useState } from 'react'
import { RxCross2 } from 'react-icons/rx'
import { apiExportUsers } from '../api/user'
import { saveBlob } from '../helpers/saveBlob'
import useLanguage from '../hooks/useLanguage'
import { ComponentExportUsersLang } from '../models/lang'
import { RoleName } from '../models/role'
import styles from '../styles/ExportUsers.module.css'

type ExportUsersProps = {
    role: RoleName
    setExportMode: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ExportUsers({
    role,
    setExportMode
}: ExportUsersProps) {
    const language = useLanguage<ComponentExportUsersLang>('component.export_users')
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
                    <h2 className={styles['title']}>{language?.selectFields}</h2>
                    <div className={styles['esc-button']}
                        onClick={handleTurnOffImportMode}
                    >
                        <RxCross2 />
                    </div>
                </div>
                <form onSubmit={handleExportUsers} className={styles['form-data']}>
                    <div className={styles['group-inputs']}>
                        <div className={styles['wrap-item']}>
                            <input id='shortcode' type='checkbox' name='fields[]' value='shortcode' />
                            <label htmlFor='shortcode' className={styles['label']}>{language?.shortcode}</label>
                        </div>
                        <div className={styles['wrap-item']}>
                            <input id='first_name' type='checkbox' name='fields[]' value='first_name' />
                            <label htmlFor='first_name' className={styles['label']}>{language?.firstName}</label>
                        </div>
                        <div className={styles['wrap-item']}>
                            <input id='last_name' type='checkbox' name='fields[]' value='last_name' />
                            <label htmlFor='last_name' className={styles['label']}>{language?.lastName}</label>
                        </div>
                        <div className={styles['wrap-item']}>
                            <input id='email' type='checkbox' name='fields[]' value='email' />
                            <label htmlFor='email' className={styles['label']}>{language?.email}</label>
                        </div>
                        <div className={styles['wrap-item']}>
                            <input id='phone_number' type='checkbox' name='fields[]' value='phone_number' />
                            <label htmlFor='phone_number' className={styles['label']}>{language?.phoneNumber}</label>
                        </div>
                        <div className={styles['wrap-item']}>
                            <input id='gender' type='checkbox' name='fields[]' value='gender' />
                            <label htmlFor='gender' className={styles['label']}>{language?.genders.gender}</label>
                        </div>
                        <div className={styles['wrap-item']}>
                            <input id='address' type='checkbox' name='fields[]' value='address' />
                            <label htmlFor='address' className={styles['label']}>{language?.address}</label>
                        </div>
                        <div className={styles['wrap-item']}>
                            <input id='birth_date' type='checkbox' name='fields[]' value='birth_date' />
                            <label htmlFor='birth_date' className={styles['label']}>{language?.birthDate}</label>
                        </div>
                        {
                            role === 'student' ?
                                <div className={styles['wrap-item']}>
                                    <input id='school_class' type='checkbox' name='fields[]' value='school_class.shortcode' />
                                    <label htmlFor='school_class' className={styles['label']}>{language?.class}</label>
                                </div>
                                : role === 'teacher' ?
                                    <div className={styles['wrap-item']}>
                                        <input id='faculty' type='checkbox' name='fields[]' value='faculty.shortcode' />
                                        <label htmlFor='faculty' className={styles['label']}>{language?.faculty}</label>
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