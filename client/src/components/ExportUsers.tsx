import { useEffect, useState } from 'react'
import { RxCross2 } from 'react-icons/rx'
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
    // const language = useLanguage<ImportDataLanguage>('component.import_data')
    const [hide, setHide] = useState(true)
    const handleTurnOffImportMode = () => {
        const transitionTiming = getComputedStyle(document.documentElement).getPropertyValue('--transition-timing-fast')
        const timing = Number(transitionTiming.replace('s', '')) * 1000
        setHide(true)
        setTimeout(() => {
            setExportMode(false)
        }, timing)
    }
    console.log(role)
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
            </div>
        </div>
    )
}