import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { SyntheticEvent, useEffect, useState } from 'react'
import Datetime from 'react-datetime'
import {
    RxCross2
} from 'react-icons/rx'
import { apiAutoCompleteClass } from '../api/class'
import { apiAutoCompleteFaculty } from '../api/faculty'
import { apiCreateUser } from '../api/user'
import useDebounce from '../hooks/useDebounce'
import useLanguage from '../hooks/useLanguage'
import { ComponentCreateUserLang } from '../models/lang'
import { RoleName } from '../models/role'
import styles from '../styles/global/CreateModel.module.css'
import CustomSelect from './CustomSelect'
import Loading from './Loading'

type CreateUserProps = {
    role: RoleName
    onMutateSuccess: () => void
    setInsertMode: React.Dispatch<React.SetStateAction<boolean>>
}
export default function CreateUser({
    role,
    onMutateSuccess,
    setInsertMode
}: CreateUserProps) {
    const language = useLanguage<ComponentCreateUserLang>('component.create_user')
    const [hide, setHide] = useState(true)
    const [queryClass, setQueryClass] = useState('')
    const [queryFaculty, setQueryFaculty] = useState('')
    const debounceQueryClass = useDebounce(queryClass, 200) as string
    const debounceQueryFaculty = useDebounce(queryFaculty, 200) as string
    const queryClient = useQueryClient()
    const handleTurnOffInsertMode = () => {
        const transitionTiming = getComputedStyle(document.documentElement).getPropertyValue('--transition-timing-fast')
        const timing = Number(transitionTiming.replace('s', '')) * 1000
        setHide(true)
        setTimeout(() => {
            setInsertMode(false)
        }, timing)
    }
    const classQueryData = useQuery({
        queryKey: ['class-query', debounceQueryClass],
        queryFn: () => {
            return apiAutoCompleteClass(debounceQueryClass)
        },
        enabled: debounceQueryClass ? true : false
    })
    const facultyQueryData = useQuery({
        queryKey: ['faculty-query', debounceQueryFaculty],
        queryFn: () => {
            return apiAutoCompleteFaculty(debounceQueryFaculty)
        },
        enabled: debounceQueryFaculty ? true : false
    })
    const getParentElement = (element: HTMLInputElement) => {
        let parent = element.parentElement as HTMLElement
        while (!parent.classList.contains(styles['wrap-item'])) parent = parent.parentElement as HTMLElement
        return parent
    }
    const handleCreateUser = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
        e.preventDefault()
        document.querySelector(styles['form-data'])?.querySelectorAll('input[name]').forEach(node => {
            const element = node as HTMLInputElement
            element.classList.remove(styles['error'])
            getParentElement(element).removeAttribute('data-error')
        })
        const submitter = e.nativeEvent.submitter as HTMLButtonElement
        const form = e.target as HTMLFormElement
        const formData = new FormData(form)
        formData.append('role', role !== undefined ? role : 'student')
        await apiCreateUser(formData)
        if (submitter.name === 'save') handleTurnOffInsertMode()
        else form.reset()
    }
    const handleOnInput = (e: React.FormEvent<HTMLFormElement>) => {
        const element = e.target as HTMLInputElement
        if (element) {
            element.classList.remove(styles['error'])
            getParentElement(element).removeAttribute('data-error')
        }
    }
    const { mutate, isPending } = useMutation({
        mutationFn: handleCreateUser,
        onError: (error: object) => {
            if (typeof error === 'object') {
                for (const key in error) {
                    const element = document.querySelector(`input[name='${key}']`) as HTMLInputElement
                    if (element) {
                        element.classList.add(styles['error'])
                        getParentElement(element).setAttribute('data-error', error[key as keyof typeof error][0] as string)
                    }
                }
            }
        },
        onSuccess: onMutateSuccess
    })
    const options = [
        { value: 'male', label: language?.genders.male },
        { value: 'female', label: language?.genders.female },
    ]
    useEffect(() => {
        setHide(false)
        return () => {
            queryClient.removeQueries({ queryKey: ['class-query'] })
            queryClient.removeQueries({ queryKey: ['faculty-query'] })
        }
    }, [queryClient])
    return (
        <div className={
            [
                styles['create-model-container'],
                hide ? styles['hide'] : ''
            ].join(' ')
        }>
            {
                isPending ? <Loading /> : null
            }
            <div className={
                [
                    styles['create-model-form'],
                    hide ? styles['hide'] : ''
                ].join(' ')
            }>
                <div className={styles['header']}>
                    <h2 className={styles['title']}>{
                        [
                            language?.create,
                            language && role ? language[role] : ''
                        ].join(' ')
                    }</h2>
                    <div className={styles['esc-button']}
                        onClick={handleTurnOffInsertMode}
                    >
                        <RxCross2 />
                    </div>
                </div>
                <div className={
                    [
                        styles['form-content']
                    ].join(' ')
                }>
                    <form onSubmit={(e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
                        mutate(e)
                    }}
                        onInput={handleOnInput}
                        className={styles['form-data']}>
                        <div className={
                            [
                                styles['group-inputs']
                            ].join(' ')
                        }>
                            <div className={styles['wrap-item']}>
                                <label className={styles['required']} htmlFor='email'>{language?.email}</label>
                                <input
                                    id='email'
                                    name='email'
                                    className={
                                        [
                                            'input-d',
                                            styles['input-item']
                                        ].join(' ')
                                    } type='text' />
                            </div>
                            <div className={styles['wrap-item']}>
                                <label htmlFor='phone_number'>{language?.phoneNumber}</label>
                                <input
                                    id='phone_number'
                                    name='phone_number'
                                    className={
                                        [
                                            'input-d',
                                            styles['input-item']
                                        ].join(' ')
                                    } type='text' />
                            </div>
                            <div className={styles['wrap-item']}>
                                <label className={styles['required']} htmlFor='first_name'>{language?.firstName}</label>
                                <input
                                    id='first_name'
                                    name='first_name'
                                    className={
                                        [
                                            'input-d',
                                            styles['input-item']
                                        ].join(' ')
                                    } type='text' />
                            </div>
                            <div className={styles['wrap-item']}>
                                <label className={styles['required']} htmlFor='last_name'>{language?.lastName}</label>
                                <input
                                    id='last_name'
                                    name='last_name'
                                    className={
                                        [
                                            'input-d',
                                            styles['input-item']
                                        ].join(' ')
                                    } type='text' />
                            </div>
                            <div className={styles['wrap-item']}>
                                <label className={styles['required']} htmlFor='shortcode'>{language?.shortcode}</label>
                                <input
                                    id='shortcode'
                                    name='shortcode'
                                    className={
                                        [
                                            'input-d',
                                            styles['input-item']
                                        ].join(' ')
                                    } type='text' />
                            </div>
                            {role === 'student' ?
                                <div className={styles['wrap-item']}>
                                    <label className={styles['required']} htmlFor='school_class'>{language?.class}</label>
                                    <input
                                        id='school_class'
                                        name='school_class'
                                        value={queryClass}
                                        onInput={(e) => { setQueryClass(e.currentTarget.value) }}
                                        className={
                                            [
                                                'input-d',
                                                styles['input-item']
                                            ].join(' ')
                                        }
                                        list='classList'
                                    />
                                    <datalist id='classList'>
                                        {
                                            classQueryData.data ? classQueryData.data.map(item => {
                                                return <option key={`class-${item.id}`} value={item.shortcode}>{item.name}</option>
                                            }) : null
                                        }
                                    </datalist>
                                </div>
                                : role === 'teacher' ?
                                    <div className={styles['wrap-item']}>
                                        <label className={styles['required']} htmlFor='faculty'>{language?.faculty}</label>
                                        <input
                                            id='faculty'
                                            name='faculty'
                                            value={queryFaculty}
                                            onInput={(e) => { setQueryFaculty(e.currentTarget.value) }}
                                            className={
                                                [
                                                    'input-d',
                                                    styles['input-item']
                                                ].join(' ')
                                            }
                                            list='facultyList'
                                        />
                                        <datalist id='facultyList'>
                                            {
                                                facultyQueryData.data ? facultyQueryData.data.map(item => {
                                                    return <option key={`faculty-${item.id}`} value={item.shortcode}>{item.name}</option>
                                                }) : null
                                            }
                                        </datalist>
                                    </div>
                                    : null
                            }
                            <div className={styles['wrap-item']}>
                                <label className={styles['required']} htmlFor=''>{language?.genders.gender}</label>
                                <CustomSelect
                                    name='gender'
                                    defaultOption={options[0]}
                                    options={options}
                                    className={
                                        [
                                            styles['custom-select']
                                        ].join(' ')
                                    }
                                />
                            </div>
                            <div className={styles['wrap-item']}>
                                <label className={styles['required']} htmlFor='address'>{language?.address}</label>
                                <input
                                    id='address'
                                    name='address'
                                    className={
                                        [
                                            'input-d',
                                            styles['input-item']
                                        ].join(' ')
                                    } type='text' />
                            </div>
                            <div className={styles['wrap-item']}>
                                <label className={styles['required']} htmlFor='birth_date'>{language?.birthDate}</label>
                                <Datetime
                                    initialValue={new Date()}
                                    inputProps={
                                        {
                                            id: 'birth_date',
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
                            <div className={styles['wrap-item']}>
                                <label className={styles['required']} htmlFor='password'>{language?.password}</label>
                                <input
                                    id='password'
                                    name='password'
                                    className={
                                        [
                                            'input-d',
                                            styles['input-item']
                                        ].join(' ')
                                    } type='password' />
                            </div>
                        </div>
                        <div className={styles['action-items']}>
                            <button name='save'
                                className={
                                    [
                                        'action-item-d',
                                        isPending ? 'button-submitting' : ''
                                    ].join(' ')
                                }>{language?.save}</button>
                            <button name='save-more'
                                className={
                                    [
                                        'action-item-d-white',
                                        isPending ? 'button-submitting' : ''
                                    ].join(' ')
                                }
                            >{language?.saveMore}</button>
                        </div>
                    </form>
                </div>
            </div >
        </div >
    )
}