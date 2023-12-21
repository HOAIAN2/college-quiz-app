import { useId } from 'react'
import useAppContext from '../hooks/useAppContext'
import styles from '../styles/FormInput.module.css'

type FormInputProps = {
    label?: string,
    name?: string
    type: React.HTMLInputTypeAttribute
    defaultValue?: string | number | readonly string[] | null
    placeHolder?: string
    preventInput?: boolean
    required: boolean
    wrapClassName?: string
    inputClassName?: string
}
export default function FormInput({
    label,
    name,
    type,
    defaultValue,
    placeHolder,
    preventInput,
    required,
    wrapClassName,
    inputClassName
}: FormInputProps) {
    const { user } = useAppContext()
    const id = useId()
    return (
        <div className={wrapClassName}>
            {
                <label className={
                    [
                        styles['label'],
                        required ? styles['required'] : ''
                    ].join(' ')
                } htmlFor={id}>{label}</label>
            }
            <input
                defaultValue={defaultValue ? defaultValue : undefined}
                readOnly={
                    !preventInput && user.user?.role.name === 'admin' ? false : true
                }
                id={id}
                name={name}
                placeholder={placeHolder}
                className={inputClassName} type={type} />
        </div>
    )
}