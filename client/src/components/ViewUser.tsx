import { useEffect, useState } from 'react'
import { RxCross2 } from 'react-icons/rx'
import { useQuery } from '@tanstack/react-query'
import { reqGetUsersById } from '../utils/user'
import Loading from './Loading'
import { useLanguage } from '../contexts/hooks'
import { ViewUserLanguage } from '../models/lang'

import styles from '../styles/ViewUser.module.css'
import { useNavigate } from 'react-router-dom'

type ViewUserProps = {
    id: number
    setViewMode: React.Dispatch<React.SetStateAction<boolean>>
}
export default function ViewUser({
    id,
    setViewMode
}: ViewUserProps) {
    const [language, setLanguage] = useState<ViewUserLanguage>()
    const { appLanguage } = useLanguage()
    const [hide, setHide] = useState(true)
    const navigate = useNavigate()
    const handleTurnOffImportMode = () => {
        const transitionTiming = getComputedStyle(document.documentElement).getPropertyValue('--transition-timing-fast')
        const timing = Number(transitionTiming.replace('s', '')) * 1000
        setHide(true)
        setTimeout(() => {
            setViewMode(false)
        }, timing)
        navigate(-1)
    }
    const queryData = useQuery({
        queryKey: [`user-${id}`],
        queryFn: () => reqGetUsersById(id),
    })
    useEffect(() => {
        setHide(false)
    }, [])
    useEffect(() => {
        if (location.pathname.endsWith(id.toString())) return
        const newPath = !location.pathname.endsWith('/') ? location.pathname + '/' + id
            : location.pathname + id
        history.pushState({}, '', newPath)
    }, [id])
    useEffect(() => {
        fetch(`/langs/component.view_user.${appLanguage}.json`)
            .then(res => res.json())
            .then((data: ViewUserLanguage) => {
                setLanguage(data)
            })
    }, [appLanguage])
    return (
        <div
            className={
                [
                    styles['view-user-container'],
                    hide ? styles['hide'] : ''
                ].join(' ')
            }>
            {queryData.isLoading ?
                <Loading />
                : null}
            <div
                className={
                    [
                        styles['view-user-form'],
                        hide ? styles['hide'] : ''
                    ].join(' ')
                }>
                <div className={styles['header']}>
                    <h2 className={styles['title']}>{
                        [
                            queryData.data?.user.lastName,
                            queryData.data?.user.firstName
                        ].join(' ')
                    }</h2>
                    <div className={styles['esc-button']}
                        onClick={handleTurnOffImportMode}
                    >
                        <RxCross2 />
                    </div>
                </div>
                <div className={styles['form-data']}>
                    <div className={
                        [
                            styles['form-content']
                        ].join(' ')
                    }></div>
                    <div className={styles['action-items']}>
                        <button name='save' className='action-item-d'>{language?.save}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}