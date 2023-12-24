import { useMutation } from '@tanstack/react-query'
import { SyntheticEvent, useState } from 'react'
import Datetime from 'react-datetime'
import { apiUpdateUser } from '../api/user'
import ChangePassword from '../components/ChangePassword'
import CustomSelect from '../components/CustomSelect'
import useAppContext from '../hooks/useAppContext'
import useLanguage from '../hooks/useLanguage'
import { ProfileLanguage } from '../models/lang'
import styles from '../styles/Profile.module.css'

export default function Profile() {
    const language = useLanguage<ProfileLanguage>('page.profile')
    const { user, appLanguage } = useAppContext()
    const [changePasswordMode, setChangePasswordMode] = useState(false)
    // const queryClient = useQueryClient()
    // const queryData = useQuery({
    //     queryKey: ['user', user.user?.id],
    //     queryFn: () => {
    //         return apiGetUser()
    //     },
    // })
    const getParentElement = (element: HTMLInputElement) => {
        let parent = element.parentElement as HTMLElement
        while (!parent.classList.contains(styles['wrap-item'])) parent = parent.parentElement as HTMLElement
        return parent
    }
    const handleOnInput = (e: React.FormEvent<HTMLFormElement>) => {
        const element = e.target as HTMLInputElement
        if (element) {
            element.classList.remove(styles['error'])
            getParentElement(element).removeAttribute('data-error')
        }
    }
    const handleUpdateUser = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
        e.preventDefault()
        if (user.user?.role.name !== 'admin') return
        document.querySelector(styles['form-data'])?.querySelectorAll('input[name]').forEach(node => {
            const element = node as HTMLInputElement
            element.classList.remove(styles['error'])
            getParentElement(element).removeAttribute('data-error')
        })
        const form = e.target as HTMLFormElement
        const formData = new FormData(form)
        await apiUpdateUser(formData, user.user.id)
    }
    const { mutate } = useMutation({
        mutationFn: handleUpdateUser,
        onError: (error: object) => {
            if (typeof error === 'object') {
                for (const key in error) {
                    const element = document.querySelector(`input[name="${key}"]`) as HTMLInputElement
                    if (element) {
                        element.classList.add(styles['error'])
                        getParentElement(element).setAttribute('data-error', error[key as keyof typeof error][0] as string)
                    }
                }
            }
        },
        // onSuccess: () => {
        //     queryClient.removeQueries({ queryKey: ['user', user.user?.id] })
        // }
    })
    const genderOptions = [
        { value: 'male', label: language?.genders.male },
        { value: 'female', label: language?.genders.female },
    ]
    const fullName = appLanguage.language === 'vi'
        ? [
            user.user?.lastName,
            user.user?.firstName
        ].join(' ')
        :
        [
            user.user?.firstName,
            user.user?.lastName
        ].join(' ')
    // useEffect(() => {
    //     return () => {
    //         queryClient.removeQueries({ queryKey: ['user', user.user?.id] })
    //     }
    // }, [queryClient, user.user?.id])
    return (
        <>
            {changePasswordMode === true ?
                <ChangePassword
                    setInsertMode={setChangePasswordMode}
                /> : null}
            <div className={
                [
                    'dashboard-d',
                    styles['profile-content']
                ].join(' ')
            }>
                {/* {queryData.isLoading ?
                    <Loading />
                    : null} */}
                <div className={
                    [
                        styles['form-content']
                    ].join(' ')
                }>
                    {
                        user.user ? (
                            <>
                                <div className={styles['header']}>
                                    <h2 className={styles['title']}>{fullName}</h2>
                                </div>
                                <form onSubmit={(e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
                                    mutate(e)
                                }}
                                    onInput={handleOnInput}
                                    className={styles['form-data']}>
                                    <input name='is_active' defaultValue='1' hidden />
                                    <div className={
                                        [
                                            styles['group-inputs']
                                        ].join(' ')
                                    }>
                                        <div className={styles['wrap-item']}>
                                            <label className={styles['required']} htmlFor="">{language?.email}</label>
                                            <input
                                                readOnly={user.user?.role.name === 'admin' ? false : true}
                                                defaultValue={user.user.email}
                                                name='email'
                                                className={
                                                    [
                                                        'input-d',
                                                        styles['input-item']
                                                    ].join(' ')
                                                } type="text" />
                                        </div>
                                        <div className={styles['wrap-item']}>
                                            <label className={styles['required']} htmlFor="">{language?.firstName}</label>
                                            <input
                                                readOnly={user.user?.role.name === 'admin' ? false : true}
                                                defaultValue={user.user.firstName}
                                                name='first_name'
                                                className={
                                                    [
                                                        'input-d',
                                                        styles['input-item']
                                                    ].join(' ')
                                                } type="text" />
                                        </div>
                                        <div className={styles['wrap-item']}>
                                            <label className={styles['required']} htmlFor="">{language?.lastName}</label>
                                            <input
                                                readOnly={user.user?.role.name === 'admin' ? false : true}
                                                defaultValue={user.user.lastName}
                                                name='last_name'
                                                className={
                                                    [
                                                        'input-d',
                                                        styles['input-item']
                                                    ].join(' ')
                                                } type="text" />
                                        </div>
                                        <div className={styles['wrap-item']}>
                                            <label className={styles['required']} htmlFor="">{language?.shortcode}</label>
                                            <input
                                                readOnly={user.user?.role.name === 'admin' ? false : true}
                                                defaultValue={user.user.shortcode}
                                                name='shortcode'
                                                className={
                                                    [
                                                        'input-d',
                                                        styles['input-item']
                                                    ].join(' ')
                                                } type="text" />
                                        </div>
                                        {user.user?.role.name === 'student' ?
                                            <div className={styles['wrap-item']}>
                                                <label className={styles['required']} htmlFor="">{language?.class}</label>
                                                <input
                                                    readOnly={true}
                                                    defaultValue={user.user.schoolClassId || ''}
                                                    name='school_class_id'
                                                    className={
                                                        [
                                                            'input-d',
                                                            styles['input-item']
                                                        ].join(' ')
                                                    } type="text" />
                                            </div> : null
                                        }
                                        <div className={styles['wrap-item']}>
                                            <label className={styles['required']} htmlFor="">{language?.genders.gender}</label>
                                            <CustomSelect
                                                name='gender'
                                                defaultOption={
                                                    user.user.gender === 'male'
                                                        ? genderOptions[0] : genderOptions[1]
                                                }
                                                options={genderOptions}
                                                className={
                                                    [
                                                        styles['custom-select']
                                                    ].join(' ')
                                                }
                                            />
                                        </div>
                                        <div className={styles['wrap-item']}>
                                            <label className={styles['required']} htmlFor="">{language?.address}</label>
                                            <input
                                                readOnly={user.user?.role.name === 'admin' ? false : true}
                                                defaultValue={user.user.address}
                                                name='address'
                                                className={
                                                    [
                                                        'input-d',
                                                        styles['input-item']
                                                    ].join(' ')
                                                } type="text" />
                                        </div>
                                        <div className={styles['wrap-item']}>
                                            <label className={styles['required']} htmlFor="">{language?.birthDate}</label>
                                            <Datetime
                                                initialValue={new Date(user.user.birthDate)}
                                                inputProps={
                                                    {
                                                        readOnly: user.user?.role.name === 'admin' ? false : true,
                                                        name: 'birth_date',
                                                        className: [
                                                            'input-d',
                                                            styles['input-item']
                                                        ].join(' ')
                                                    }
                                                }
                                                closeOnSelect={true}
                                                timeFormat={false}
                                            />
                                        </div>
                                    </div>
                                    {
                                        user.user?.role.name === 'admin' ?
                                            <div className={styles['action-items']}>
                                                <button name='save' className='action-item-d'>{language?.save}</button>
                                            </div>
                                            : null
                                    }
                                </form>
                            </>
                        ) : null
                    }
                </div>
                <div className={styles['header']}>
                    <h2 className={styles['title']}>{language?.otherSection.other}</h2>
                </div>
                <div className={styles['other-section']}>
                    <button
                        className={
                            [
                                'button-d',
                                styles['button']
                            ].join(' ')
                        }
                        onClick={() => { setChangePasswordMode(true) }}>{language?.otherSection.changePassword}</button>
                </div>
            </div>
        </>
    )
}