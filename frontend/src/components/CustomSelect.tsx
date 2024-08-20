import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import appStyles from '../App.module.css';
import useAppContext from '../hooks/useAppContext';
import { Option } from '../models/option';
import styles from '../styles/CustomSelect.module.css';
import css from '../utils/css';

type CustomSelectProps = {
	name?: string;
	defaultOption: Option;
	options: Option[];
	className?: string;
	disabled?: boolean;
	onChange?: (option: Option) => void;
};

export default function CustomSelect({
	name,
	defaultOption,
	options,
	className,
	disabled,
	onChange,
}: CustomSelectProps) {
	const { appLanguage } = useAppContext();
	const customSelectRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [current, setCurrent] = useState(defaultOption);
	useLayoutEffect(() => {
		if (current.label == undefined) setCurrent(defaultOption);
	}, [current, defaultOption]);
	useLayoutEffect(() => {
		setCurrent(defaultOption);
	}, [appLanguage.language, defaultOption]);
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			const element = e.target as HTMLElement;
			if (element && !containerRef.current?.contains(element)) {
				customSelectRef.current?.classList.add(styles['hidden']);
			}
		};
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, []);
	return (
		<div
			ref={containerRef}
			onClick={() => {
				if (disabled) return;
				customSelectRef.current?.classList.toggle(styles['hidden']);
			}}
			className={
				css(
					appStyles['input-d'],
					styles['custom-select'],
					disabled ? styles['disabled'] : '',
					className
				)
			}
		>
			<span>{current.label}</span>
			<input type='text'
				name={name}
				value={current.value}
				disabled={disabled}
				hidden
				onChange={(e) => { e.preventDefault(); }} />
			<div
				ref={customSelectRef}
				className={css(appStyles['input-d'], styles['hidden'], styles['select-dropbox'])}
			>
				{options.map(option => {
					return (
						<div key={option.value}
							onClick={() => {
								onChange && onChange(option);
								setCurrent(option);
							}}
							className={styles['select-item']}>
							<span>{option.label}</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}
