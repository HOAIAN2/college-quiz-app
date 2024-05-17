import { FaFaceMeh, FaFaceSmile, FaFaceTired } from 'react-icons/fa6'
import { TiArrowBack } from 'react-icons/ti'
import { useNavigate } from 'react-router-dom'
import useLanguage from '../hooks/useLanguage'
import { ExamResult } from '../models/exam'
import { ComponentScorePopUpLang } from '../models/lang'
import styles from '../styles/ScorePopUp.module.css'

type ScorePopUpProps = {
	data: ExamResult
	backURL: string
	setShowPopUp?: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ScorePopUp({
	data,
	backURL,
	setShowPopUp
}: ScorePopUpProps) {
	const language = useLanguage<ComponentScorePopUpLang>('component.score_pop_up')
	const navigate = useNavigate()
	const renderFace = (correctCount: number, questionCount: number) => {
		const percent = correctCount / questionCount
		if (percent >= 0.7) return <FaFaceSmile />
		if (percent >= 0.5) return <FaFaceMeh />
		return <FaFaceTired />
	}
	const handleClosePopUp = () => {
		if (setShowPopUp) return setShowPopUp(true)
		navigate(backURL)
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
						{renderFace(data.correctCount, data.questionCount)}
						<div>{language?.numberOfCorrectQuestion}</div>
						<div className={styles['score']}>{data.correctCount}/{data.questionCount}</div>
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
