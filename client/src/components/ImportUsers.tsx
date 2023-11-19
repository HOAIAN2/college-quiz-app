import { useEffect, useState } from 'react'
import styles from '../styles/ImportUsers.module.css'
import { RxCross2 } from 'react-icons/rx'
import { useLanguage } from '../contexts/hooks'
import { ImportUsersLanguage } from '../models/lang'
import {
    IoMdAddCircleOutline,
} from 'react-icons/io'
import { reqImportUsers } from '../utils/user'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { studentExcelTemplate, teacherExcelTemplate } from '../utils/api-config'
import { RoleName } from '../models/user'

type InsertUsersProps = {
    role: RoleName
    setImportMode: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ImportUsers({
    role,
    setImportMode
}: InsertUsersProps) {
    const [language, setLanguage] = useState<ImportUsersLanguage>()
    const { appLanguage } = useLanguage()
    const [hide, setHide] = useState(true)
    const queryClient = useQueryClient()
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
    const handleUploadFile = async () => {
        if (!file) return
        await reqImportUsers(file, role)
    }
    const mutation = useMutation({
        mutationFn: handleUploadFile,
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: ['student'] })
            queryClient.removeQueries({ queryKey: ['teacher'] })
            queryClient.removeQueries({ queryKey: ['dashboard'] })
        }
    })
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
            {mutation.isPending ?
                <div className='data-loading'
                    style={{ zIndex: 10 }}
                >Loading...</div> : null}
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
                            language && role ? language[role] : ''
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
                        styles['form-data']
                    ].join(' ')
                }>
                    <div className={
                        [
                            styles['drag-area']
                        ].join(' ')
                    }>
                        <div
                            onDragOver={(e) => {
                                e.currentTarget.classList.add(styles['drag'])
                            }}
                            onDrop={(e) => {
                                e.currentTarget.classList.remove(styles['drag'])
                            }}
                            onDragLeave={(e) => {
                                e.currentTarget.classList.remove(styles['drag'])
                            }}
                            className={
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
                                    file ? <div className={styles['file-name']} >{file.name}</div>
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
                        <button
                            onClick={() => { mutation.mutate() }}
                            name='save' className={
                                [
                                    'action-item-d',
                                    mutation.isPending ? styles['pending'] : ''
                                ].join(' ')
                            }>{language?.save}
                        </button>
                        <a
                            className='action-item-d-white'
                            href={
                                role == 'student' ? studentExcelTemplate
                                    : teacherExcelTemplate
                            }
                            download=''>{language?.downloadTemplate}</a>
                    </div>
                </div>
            </div>
        </div>
    )
}