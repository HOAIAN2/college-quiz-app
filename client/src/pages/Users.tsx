import { useState } from 'react'
import {
    RiAddFill
} from 'react-icons/ri'
import {
    BiImport,
    BiExport
} from 'react-icons/bi'
import CreateUser from '../components/CreateUser'
type UsersProps = {
    type?: 'student' | 'teacher' | 'admin'
}
export default function Users({
    type
}: UsersProps) {
    const [insertMode, setInsertMode] = useState(false)
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
                        <RiAddFill /> Add
                    </div>
                    <div className={
                        [
                            'action-item-d-white'
                        ].join(' ')
                    }>
                        <BiImport /> Import
                    </div>
                    <div className={
                        [
                            'action-item-d-white'
                        ].join(' ')
                    }>
                        <BiExport /> Export
                    </div>
                </div>
            </div>
        </>
    )
}