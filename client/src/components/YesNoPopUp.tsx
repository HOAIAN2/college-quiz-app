import { useEffect, useState } from 'react'
import { RxCross2 } from 'react-icons/rx'
import useAppContext from '../hooks/useAppContext'
import { YesNoPopUpLanguage } from '../models/lang'
import { useMutation } from '@tanstack/react-query'
import styles from '../styles/YesNoPopUp.module.css'
import Loading from './Loading'

type YesNoPopUpProps = {
    message: string
    mutateFunction: () => Promise<void>
    onMutateSuccess: () => void
    setShowPopUpMode: React.Dispatch<React.SetStateAction<boolean>>
}
export default function YesNoPopUp({
    message,
    mutateFunction,
    onMutateSuccess,
    setShowPopUpMode,
}: YesNoPopUpProps) {
    const [language, setLanguage] = useState<YesNoPopUpLanguage>()
    const { appLanguage } = useAppContext()
    const [hide, setHide] = useState(true)
    const handleTurnOffImportMode = () => {
        const transitionTiming = getComputedStyle(document.documentElement).getPropertyValue('--transition-timing-fast')
        const timing = Number(transitionTiming.replace('s', '')) * 1000
        setHide(true)
        setTimeout(() => {
            setShowPopUpMode(false)
        }, timing)
    }
    const mutation = useMutation({
        mutationFn: mutateFunction,
        onSuccess: () => {
            onMutateSuccess()
            handleTurnOffImportMode()
        }
    })
    useEffect(() => {
        setHide(false)
    }, [])
    useEffect(() => {
        fetch(`/langs/component.yes_no_pop_up.${appLanguage.language}.json`)
            .then(res => res.json())
            .then((data: YesNoPopUpLanguage) => {
                setLanguage(data)
            })
    }, [appLanguage.language])
    return (
        <div
            className={
                [
                    styles['yes-no-pop-up-container'],
                    hide ? styles['hide'] : ''
                ].join(' ')
            }>
            {mutation.isPending ? <Loading /> : null}
            <div
                className={
                    [
                        styles['yes-no-pop-up-form'],
                        hide ? styles['hide'] : ''
                    ].join(' ')
                }>
                <div className={styles['header']}>
                    <h2></h2>
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
                    <div
                        className={
                            [
                                styles['message']
                            ].join(' ')
                        }
                    >
                        <div className={styles['message-content']}>
                            {message}
                        </div>
                    </div>
                    <div className={styles['action-items']}>
                        <button
                            onClick={handleTurnOffImportMode}
                            className={
                                [
                                    'action-item-d-white-border-red',
                                    mutation.isPending ? styles['pending'] : ''
                                ].join(' ')
                            }
                        >{language?.no}</button>
                        <button
                            onClick={() => { mutation.mutate() }}
                            className={
                                [
                                    'action-item-d-white',
                                    mutation.isPending ? styles['pending'] : ''
                                ].join(' ')
                            }>{language?.yes}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}