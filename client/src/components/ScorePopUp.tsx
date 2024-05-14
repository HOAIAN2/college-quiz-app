import styles from '../styles/ScorePopUp.module.css'

export default function ScorePopUp() {
	return (
		<div className={styles['score-popup-container']}>
			<div className={styles['score-content']}>
				<div>Kết quả bài thi</div>
				<div>17/20</div>
			</div>
		</div>
	)
}
