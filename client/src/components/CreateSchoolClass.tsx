import { useMutation, useQuery } from '@tanstack/react-query'
import { SyntheticEvent, useEffect, useState } from 'react'
import { RxCross2 } from 'react-icons/rx'
import { apiAutoCompleteFaculty } from '../api/faculty'
import { apiCreateSchoolClass } from '../api/school-class'
import useDebounce from '../hooks/useDebounce'
import useLanguage from '../hooks/useLanguage'
import { ComponentCreateSchoolClassLang } from '../models/lang'
import styles from '../styles/global/CreateModel.module.css'
import Loading from './Loading'

type CreateSchoolClassProps = {
    onMutateSuccess: () => void
    setInsertMode: React.Dispatch<React.SetStateAction<boolean>>
}
export default function CreateSchoolClass({
    onMutateSuccess,
    setInsertMode
}: CreateSchoolClassProps) {
    const language = useLanguage<ComponentCreateSchoolClassLang>('component.create_school_class')
    const [hide, setHide] = useState(true)
    const [queryFaculty, setQueryFaculty] = useState('')
    const debounceQueryFaculty = useDebounce(queryFaculty, 200) as string
    const handleTurnOffInsertMode = () => {
        const transitionTiming = getComputedStyle(document.documentElement).getPropertyValue('--transition-timing-fast')
        const timing = Number(transitionTiming.replace('s', '')) * 1000
        setHide(true)
        setTimeout(() => {
            setInsertMode(false)
        }, timing)
    }
    const facultyQueryData = useQuery({
        queryKey: ['faculty-auto-complete', debounceQueryFaculty],
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
    const handleOnInput = (e: React.FormEvent<HTMLFormElement>) => {
        const element = e.target as HTMLInputElement
        if (element) {
            element.classList.remove(styles['error'])
            getParentElement(element).removeAttribute('data-error')
        }
    }
    const handleCreateFaculty = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
        e.preventDefault()
        document.querySelector(styles['form-data'])?.querySelectorAll('input[name]').forEach(node => {
            const element = node as HTMLInputElement
            element.classList.remove(styles['error'])
            getParentElement(element).removeAttribute('data-error')
        })
        const submitter = e.nativeEvent.submitter as HTMLButtonElement
        const form = e.target as HTMLFormElement
        const formData = new FormData(form)
        await apiCreateSchoolClass(formData)
        if (submitter.name === 'save') handleTurnOffInsertMode()
        else form.reset()
    }
    const { mutate, isPending } = useMutation({
        mutationFn: handleCreateFaculty,
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
    useEffect(() => {
        setHide(false)
    }, [])
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
                    <h2 className={styles['title']}>{language?.create}</h2>
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
                            <div className={styles['wrap-item']}>
                                <label className={styles['required']} htmlFor='shortcode'>{language?.name}</label>
                                <input
                                    id='name'
                                    name='name'
                                    className={
                                        [
                                            'input-d',
                                            styles['input-item']
                                        ].join(' ')
                                    } type='text' />
                            </div>
                            <div className={styles['wrap-item']}>
                                <label className={styles['required']} htmlFor='faculty'>{language?.faculty}</label>
                                <input
                                    id='faculty'
                                    name='faculty'
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