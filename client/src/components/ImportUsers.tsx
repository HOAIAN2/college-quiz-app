import { useEffect, useState } from 'react'
import styles from '../styles/ImportUsers.module.css'
import { RxCross2 } from 'react-icons/rx'
import { useLanguage } from '../contexts/hooks'
import { ImportUsersLanguage } from '../models/lang'
import { IoMdAddCircleOutline } from 'react-icons/io'

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
    const [file, setFile] = useState<File>()
    const handleTurnOffImportMode = () => {
        const transitionTiming = getComputedStyle(document.documentElement).getPropertyValue('--transition-timing-fast')
        const timing = Number(transitionTiming.replace('s', '')) * 1000
        setHide(true)
        setTimeout(() => {
            setImportMode(false)
        }, timing)
    }
    const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.currentTarget.files
        if (!files) return setFile(undefined)
        const file = files[0]
        if (file) setFile(file)
        else setFile(undefined)
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
                <div className={
                    [
                        styles['drag-area']
                    ].join(' ')
                }>
                    <div className={
                        [
                            styles['drag-area-dashed']
                        ].join(' ')
                    }>
                        <div className={
                            [
                                styles['drag-area-content']
                            ].join(' ')
                        }>
                            {
                                file ? <div>{file.name}</div>
                                    :
                                    <IoMdAddCircleOutline />
                            }
                        </div>
                        <input
                            onChange={handleChangeFile}
                            accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                            type="file" name="file" />
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