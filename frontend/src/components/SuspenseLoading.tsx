import styles from '../styles/SupspenseLoading.module.css';

export default function SuspenseLoading() {
	return (
		<div className={styles['loading-container']}>
			<div className={styles['lds-spinner']}>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</div>
	);
}
