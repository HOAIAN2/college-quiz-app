import { FaFaceMeh, FaFaceSmile, FaFaceTired } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'
import useLanguage from '../hooks/useLanguage'
import { ExamResult } from '../models/exam'
import { ComponentScorePopUpLang } from '../models/lang'
import styles from '../styles/ScorePopUp.module.css'

type ScorePopUpProps = {
	data: ExamResult
	backURL: string
}
export default function ScorePopUp({
	data,
	backURL
}: ScorePopUpProps) {
	const language = useLanguage<ComponentScorePopUpLang>('component.score_pop_up')
	const navigate = useNavigate()
	const renderFace = (correctCount: number, questionCount: number) => {
		const percent = correctCount / questionCount
		if (percent >= 0.7) return <FaFaceSmile />
		if (percent >= 0.5) return <FaFaceMeh />
		return <FaFaceTired />
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
							onClick={() => { navigate(backURL) }}
							className={
								[
									'button-d'
								].join(' ')
							}>
							{/* <TiArrowBack /> */}
							{language?.goBack}
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
