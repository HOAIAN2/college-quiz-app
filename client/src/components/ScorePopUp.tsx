import confetti from 'canvas-confetti'
import { TiArrowBack } from 'react-icons/ti'
import { useNavigate } from 'react-router-dom'
import { BASE_SCORE_SCALE } from '../config/env'
import useAppContext from '../hooks/useAppContext'
import useLanguage from '../hooks/useLanguage'
import { ExamResult } from '../models/exam'
import { ComponentScorePopUpLang } from '../models/lang'
import styles from '../styles/ScorePopUp.module.css'

type ScorePopUpProps = {
	data: ExamResult
	backURL?: string
	hideConfetti?: boolean
	setShowPopUp?: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ScorePopUp({
	data,
	backURL,
	hideConfetti,
	setShowPopUp
}: ScorePopUpProps) {
	const { appLanguage } = useAppContext()
	const language = useLanguage<ComponentScorePopUpLang>('component.score_pop_up')
	const navigate = useNavigate()
	const score = Number((data.correctCount / data.questionCount * BASE_SCORE_SCALE)
		.toFixed(2))
		.toLocaleString(appLanguage.language, {
			notation: 'compact'
		}) + `/${BASE_SCORE_SCALE}`
	const handleClosePopUp = () => {
		if (setShowPopUp) return setShowPopUp(true)
		if (backURL) return navigate(backURL)
	}
	const renderScore = () => {
		const percent = data.correctCount / data.questionCount;
		const getColorClass = () => {
			if (percent >= 0.7) return styles['green']
			if (percent >= 0.5) return styles['yellow']
			return styles['red']
		}
		const colorClass = getColorClass()
		return (
			<div className={`${styles['score']} ${colorClass}`}>
				{score}
			</div>
		)
	}
	if (!hideConfetti) {
		confetti({
			particleCount: 100,
			startVelocity: 30,
			spread: 360,
			origin: {
				x: Math.random(),
				y: Math.random() - 0.2
			}
		})
	}
	return (
		<div className={styles['score-popup-container']}>
			<div className={styles['score-content']}>
				<div className={styles['title']}>
					<h2>{language?.examResult}</h2>
				</div>
				<div className={
					[
						styles['content-data']
					].join(' ')
				}>
					<div className={styles['group-data']}>
						<div className={styles['group-items']}>
							<div className={styles['label']}>{language?.score}</div>
							{renderScore()}
						</div>
						<div className={styles['group-items']}>
							<div className={styles['label']}>{language?.numberOfCorrectQuestion}: {data.correctCount}/{data.questionCount}</div>
						</div>
					</div>
					<div className={styles['action-items']}>
						<button
							onClick={handleClosePopUp}
							className={
								[
									'button-d'
								].join(' ')
							}>
							<TiArrowBack />
							{language?.goBack}
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
