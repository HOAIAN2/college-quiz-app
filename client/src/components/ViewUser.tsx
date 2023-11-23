import { useEffect, useState } from 'react'
import { RxCross2 } from 'react-icons/rx'
import { useQuery } from '@tanstack/react-query'
import { reqGetUsersById } from '../utils/user'
import Loading from './Loading'
import styles from '../styles/ViewUser.module.css'

type ViewUserProps = {
    id: number
    setViewMode: React.Dispatch<React.SetStateAction<boolean>>
}
export default function ViewUser({
    id,
    setViewMode
}: ViewUserProps) {
    const [hide, setHide] = useState(true)
    const handleTurnOffImportMode = () => {
        const transitionTiming = getComputedStyle(document.documentElement).getPropertyValue('--transition-timing-fast')
        const timing = Number(transitionTiming.replace('s', '')) * 1000
        setHide(true)
        setTimeout(() => {
            setViewMode(false)
        }, timing)
    }
    const queryData = useQuery({
        queryKey: [`user-${id}`],
        queryFn: () => reqGetUsersById(id)
    })
    useEffect(() => {
        setHide(false)
    }, [])
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
            </div>
        </div>
    )
}