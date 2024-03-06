import { useEffect, useRef, useState } from 'react'
import styles from '../styles/CustomDataList.module.css'

type Option = {
	value: string
	label?: string
}

type CustomDataListProps = {
	name?: string
	defaultOption?: Option
	options: Option[]
	className?: string
	disabled?: boolean
	onChange?: (option: Option) => void
	onInput: React.FormEventHandler<HTMLInputElement> | undefined
}

export default function CustomDataList({
	name,
	defaultOption,
	options,
	className,
	disabled,
	onChange,
	onInput
}: CustomDataListProps) {
	const customDataListRef = useRef<HTMLDivElement>(null)
	const customDataListContainerRef = useRef<HTMLDivElement>(null)
	const [value, setValue] = useState<string | number>(defaultOption?.value || '')
	const [currentText, setCurrentText] = useState(defaultOption?.label || '')
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			const element = e.target as HTMLElement
			if (element && !customDataListContainerRef.current?.contains(element)) {
				customDataListRef.current?.classList.add(styles['hidden'])
			}
			// else customDataListRef.current?.classList.remove(styles['hidden'])
		}
		document.addEventListener('click', handleClickOutside)
		return () => {
			document.removeEventListener('click', handleClickOutside)
		}
	}, [])
	return (
		<div
			ref={customDataListContainerRef}
			className={
				[
					styles['custom-datalist'],
					// styles['hidden'],
					disabled ? styles['disabled'] : '',
					className
				].join(' ')
			}
		>
			<input
				onClick={() => {
					customDataListRef.current?.classList.remove(styles['hidden'])
				}}
				data-selector={name}
				// name={name}
				className={
					[
						'input-d',
						styles['input-item']
					].join(' ')
				}
				value={currentText}
				disabled={disabled}
				onInput={e => {
					const currentTarget = e.currentTarget
					customDataListRef.current?.classList.remove(styles['hidden'])
					setCurrentText(currentTarget.value)
					if (!currentTarget.value) setValue('')
					onInput && onInput(e)
				}}
			/>
			<input type="text" hidden value={value} name={name} onInput={() => { }} />
			{
				options.length != 0
					?
					<div
						ref={customDataListRef}
						onClick={() => {
							if (disabled) return
							customDataListRef.current?.classList.add(styles['hidden'])
						}}
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
										setValue(option.value)
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
