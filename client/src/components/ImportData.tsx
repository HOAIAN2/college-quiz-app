import { useMutation } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import {
    IoMdAddCircleOutline,
} from 'react-icons/io'
import { RxCross2 } from 'react-icons/rx'
import useLanguage from '../hooks/useLanguage'
import { ComponentImportDataLang } from '../models/lang'
import styles from '../styles/ImportData.module.css'
import Loading from './Loading'

type ImportDataProps = {
    title?: string
    teamplateUrl: string
    importFunction: (file: File) => Promise<void>
    onMutateSuccess: () => void
    setImportMode: React.Dispatch<React.SetStateAction<boolean>>
}
export default function ImportData({
    title,
    teamplateUrl,
    importFunction,
    onMutateSuccess,
    setImportMode,
}: ImportDataProps) {
    const language = useLanguage<ComponentImportDataLang>('component.import_data')
    const [hide, setHide] = useState(true)
    const [file, setFile] = useState<File>()
    const inputFileRef = useRef<HTMLInputElement>(null)
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
    const handleOnDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault()
        const currentTarget = e.currentTarget
        currentTarget.classList.remove(styles['drag'])
        const files = e.dataTransfer.files
        if (inputFileRef.current) inputFileRef.current.files = files
        const file = files[0]
        if (file) setFile(file)
        else setFile(undefined)
    }
    const handleUploadFile = async () => {
        if (!file) return
        await importFunction(file)
    }
    const mutation = useMutation({
        mutationFn: handleUploadFile,
        onSuccess: onMutateSuccess
    })
    useEffect(() => {
        setHide(false)
    }, [])
    return (
        <div
            className={
                [
                    styles['import-data-container'],
                    hide ? styles['hide'] : ''
                ].join(' ')
            }>
            {mutation.isPending ?
                <Loading /> : null}
            <div
                className={
                    [
                        styles['import-data-form'],
                        hide ? styles['hide'] : ''
                    ].join(' ')
                }>
                <div className={styles['header']}>
                    <h2 className={styles['title']}>{title}</h2>
                    <div className={styles['esc-button']}
                        onClick={handleTurnOffImportMode}
                    >
                        <RxCross2 />
                    </div>
                </div>
                <div
                    className={
                        [
                            styles['form-data']
                        ].join(' ')
                    }>
                    <div className={
                        [
                            styles['drag-area']
                        ].join(' ')
                    }>
                        <label htmlFor='file'
                            onDragOver={(e) => {
                                e.preventDefault()
                                e.currentTarget.classList.add(styles['drag'])
                            }}
                            onDragLeave={(e) => {
                                e.preventDefault()
                                e.currentTarget.classList.remove(styles['drag'])
                            }}
                            onDrop={handleOnDrop}
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
                                ref={inputFileRef}
                                id='file'
                                onChange={handleChangeFile}
                                accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                                type="file" name="file"
                                hidden
                            />
                        </label>
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
                            href={teamplateUrl}
                            download=''>{language?.downloadTemplate}</a>
                    </div>
                </div>
            </div>
        </div>
    )
}