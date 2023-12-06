import { useEffect, useState } from 'react'
import { RxCross2 } from 'react-icons/rx'
// import { useNavigate } from 'react-router-dom'
import { UserDetail } from '../models/user'
import styles from '../styles/ViewUserPopUp.module.css'
import ViewUser from './ViewUser'

type ViewUserPopUpProps = {
    id: number
    setViewMode: React.Dispatch<React.SetStateAction<boolean>>
}
export default function ViewUserPopUp({
    id,
    setViewMode
}: ViewUserPopUpProps) {
    const [hide, setHide] = useState(true)
    const [userDetail, setUserDetail] = useState<UserDetail | null>(null)
    const handleTurnOffImportMode = () => {
        const transitionTiming = getComputedStyle(document.documentElement).getPropertyValue('--transition-timing-fast')
        const timing = Number(transitionTiming.replace('s', '')) * 1000
        setHide(true)
        setTimeout(() => {
            setViewMode(false)
        }, timing)
        // navigate(-1)
    }
    useEffect(() => {
        setHide(false)
    }, [])
    // useEffect(() => {
    //     const currentPath = location.pathname.split('/')
    //     const currentId = currentPath.pop() || currentPath.pop() as string
    //     if (id.toString() === currentId) return
    //     const newPath = !location.pathname.endsWith('/') ? location.pathname + '/' + id
    //         : location.pathname + id
    //     history.pushState({}, '', newPath)
    // }, [id])
    return (
        <div
            className={
                [
                    styles['view-user-container'],
                    hide ? styles['hide'] : ''
                ].join(' ')
            }>
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
                            userDetail?.user.lastName,
                            userDetail?.user.firstName
                        ].join(' ')
                    }</h2>
                    <div className={styles['esc-button']}
                        onClick={handleTurnOffImportMode}
                    >
                        <RxCross2 />
                    </div>
                </div>
                <ViewUser id={id} setUserDetail={setUserDetail} />
            </div>
        </div>
    )
}