import { useRef, useState } from 'react'
import styles from '../styles/CustomDataList.module.css'

type Option = {
    value: string
    label?: string
}

type CustomDataListProps = {
    defaultOption?: Option
    options: Option[]
    className?: string
    disabled?: boolean
    onChange?: (option: Option) => void
    onInput: React.FormEventHandler<HTMLInputElement> | undefined
}

export default function CustomDataList({
    defaultOption,
    options,
    className,
    disabled,
    onChange,
    onInput
}: CustomDataListProps) {
    const customDataListRef = useRef<HTMLDivElement>(null)
    const [currentText, setCurrentText] = useState(defaultOption?.label || '')
    return (
        <div ref={customDataListRef}
            onClick={() => {
                if (disabled) return
                customDataListRef.current?.classList.toggle(styles['hidden'])
            }}
            className={
                [
                    styles['custom-datalist'],
                    // styles['hidden'],
                    disabled ? styles['disabled'] : '',
                    className
                ].join(' ')
            }
        >
            <input type="text"
                className={
                    [
                        'input-d',
                        styles['input-item']
                    ].join(' ')
                }
                value={currentText}
                disabled={disabled}
                onInput={e => {
                    customDataListRef.current?.classList.remove(styles['hidden'])
                    setCurrentText(e.currentTarget.value)
                    onInput && onInput(e)
                }}
            />
            {
                options.length != 0
                    ?
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
                                        setCurrentText(option.label || '')
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
                    : null
            }
        </div>
    )
}