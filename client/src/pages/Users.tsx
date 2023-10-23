import { useEffect, useState } from 'react'
import {
    RiAddFill
} from 'react-icons/ri'
import {
    BiImport,
    BiExport
} from 'react-icons/bi'
import CreateUser from '../components/CreateUser'
import { UsersLanguage } from '../models/lang'
import { useLanguage } from '../contexts/hooks'
import styles from '../styles/Users.module.css'

type UsersProps = {
    type: 'student' | 'teacher' | 'admin'
}
export default function Users({
    type
}: UsersProps) {
    const [language, setLanguage] = useState<UsersLanguage>()
    const { appLanguage } = useLanguage()
    const [insertMode, setInsertMode] = useState(false)
    useEffect(() => {
        fetch(`/langs/page.users.${appLanguage}.json`)
            .then(res => res.json())
            .then((data) => {
                setLanguage(data)
            })
    }, [appLanguage])
    return (
        <>
            {insertMode === true ?
                <CreateUser
                    type={type}
                    setInsertMode={setInsertMode}
                /> : null}
            <div
                className={
                    [
                        'dashboard-d'
                    ].join(' ')
                }
            >
                <div className={
                    [
                        'action-bar-d'
                    ].join(' ')
                }>
                    <div className={
                        [
                            'action-item-d'
                        ].join(' ')
                    }
                        onClick={() => {
                            setInsertMode(true)
                        }}
                    >
                        <RiAddFill /> {language?.add}
                    </div>
                    <div className={
                        [
                            'action-item-d-white'
                        ].join(' ')
                    }>
                        <BiImport /> {language?.import}
                    </div>
                    <div className={
                        [
                            'action-item-d-white'
                        ].join(' ')
                    }>
                        <BiExport /> {language?.export}
                    </div>
                </div>
                <div className={styles['users-content']}></div>
            </div>
        </>
    )
}