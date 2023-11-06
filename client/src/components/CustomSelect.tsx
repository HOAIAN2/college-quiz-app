import { useLayoutEffect, useRef, useState } from 'react'
import styles from '../styles/CustomSelect.module.css'

type Option = {
    value: string
    label?: string
}
type CustomSelectProps = {
    options: Option[]
    onChange: (option: Option) => void
    className?: string
}

export default function CustomSelect({
    options,
    onChange,
    className
}: CustomSelectProps) {
    const customSelectRef = useRef<HTMLDivElement>(null)
    const [current, setCurrent] = useState(options[0])
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useLayoutEffect(() => {
        if (current.label == undefined) setCurrent(options[0])
    })
    return (
        <div ref={customSelectRef}
            onClick={() => {
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
                                onChange(option)
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