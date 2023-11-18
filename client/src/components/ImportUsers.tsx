import { useEffect, useState } from 'react'
import styles from '../styles/ImportUsers.module.css'
import { RxCross2 } from 'react-icons/rx'
import { useLanguage } from '../contexts/hooks'
import { ImportUsersLanguage } from '../models/lang'

type InsertUsersProps = {
    type: 'student' | 'teacher'
    setImportMode: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ImportUsers({
    type,
    setImportMode
}: InsertUsersProps) {
    const [language, setLanguage] = useState<ImportUsersLanguage>()
    const { appLanguage } = useLanguage()
    const [hide, setHide] = useState(true)
    const handleTurnOffImportMode = () => {
        const transitionTiming = getComputedStyle(document.documentElement).getPropertyValue('--transition-timing-fast')
        const timing = Number(transitionTiming.replace('s', '')) * 1000
        setHide(true)
        setTimeout(() => {
            setImportMode(false)
        }, timing)
    }
    useEffect(() => {
        setHide(false)
    }, [])
    useEffect(() => {
        fetch(`/langs/component.import_user.${appLanguage}.json`)
            .then(res => res.json())
            .then((data: ImportUsersLanguage) => {
                setLanguage(data)
            })
    }, [appLanguage])
    return (
        <div className={
            [
                styles['import-user-container'],
                hide ? styles['hide'] : ''
            ].join(' ')
        }>
            <div className={
                [
                    styles['import-user-form'],
                    hide ? styles['hide'] : ''
                ].join(' ')
            }>
                <div className={styles['header']}>
                    <h2 className={styles['title']}>{
                        [
                            language?.import,
                            language && type ? language[type] : ''
                        ].join(' ')
                    }</h2>
                    <div className={styles['esc-button']}
                        onClick={handleTurnOffImportMode}
                    >
                        <RxCross2 />
                    </div>
                </div>
                <div className={styles['action-items']}>
                    <button name='save' className='action-item-d'>{language?.save}</button>
                    <button name='download' className='action-item-d-white'>{language?.downloadTemplate}</button>
                </div>
            </div>
        </div>
    )
}