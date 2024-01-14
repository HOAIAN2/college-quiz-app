import { useLayoutEffect, useRef, useState } from 'react'
import styles from '../styles/CustomSelect.module.css'

type Option = {
    value: string
    label?: string
}
type CustomSelectProps = {
    name?: string
    defaultOption: Option
    options: Option[]
    className?: string
    disabled?: boolean
    onChange?: (option: Option) => void
}

export default function CustomSelect({
    name,
    defaultOption,
    options,
    className,
    disabled,
    onChange,
}: CustomSelectProps) {
    const customSelectRef = useRef<HTMLDivElement>(null)
    const [current, setCurrent] = useState(defaultOption)
    useLayoutEffect(() => {
        if (current.label == undefined) setCurrent(defaultOption)
    }, [current, defaultOption])
    return (
        <div ref={customSelectRef}
            onClick={() => {
                if (disabled) return
                customSelectRef.current?.classList.toggle(styles['hidden'])
            }}
            className={
                [
                    'input-d',
                    styles['custom-select'],
                    styles['hidden'],
                    className
                ].join(' ')
            }
        >
            <span>{current.label}</span>
            <input type="text"
                name={name}
                value={current.value}
                disabled={disabled}
                hidden
                onChange={(e) => { e.preventDefault() }} />
            <div
                className={
                    [
                        'input-d',
                        styles['select-dropbox'],
                    ].join(' ')
                }
            >
                {options.map(option => {
                    return (
                        <div key={option.value}
                            onClick={() => {
                                onChange && onChange(option)
                                setCurrent(option)
                            }}
                            className={
                                [
                                    styles['select-item']
                                ].join(' ')
                            }>
                            <span>{option.label}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}