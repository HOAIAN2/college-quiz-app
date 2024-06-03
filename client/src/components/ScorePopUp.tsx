import confetti from 'canvas-confetti';
import { TiArrowBack } from 'react-icons/ti';
import { useNavigate } from 'react-router-dom';
import appStyles from '../App.module.css';
import useLanguage from '../hooks/useLanguage';
import { ExamResult } from '../models/exam';
import styles from '../styles/ScorePopUp.module.css';
import caculateScore from '../utils/caculateScore';

type ScorePopUpProps = {
	data: ExamResult;
	backURL?: string;
	hideConfetti?: boolean;
	setShowPopUp?: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ScorePopUp({
	data,
	backURL,
	hideConfetti,
	setShowPopUp
}: ScorePopUpProps) {
	const language = useLanguage('component.score_pop_up');
	const navigate = useNavigate();
	const score = caculateScore(data.correctCount, data.questionCount);
	const handleClosePopUp = () => {
		if (setShowPopUp) return setShowPopUp(true);
		if (backURL) return navigate(backURL);
	};
	const renderScore = () => {
		const percent = data.correctCount / data.questionCount;
		const getColorClass = () => {
			if (percent >= 0.7) return styles['green'];
			if (percent >= 0.5) return styles['yellow'];
			return styles['red'];
		};
		const colorClass = getColorClass();
		return (
			<div className={`${styles['score']} ${colorClass}`}>
				{score}
			</div>
		);
	};
	if (!hideConfetti) {
		confetti({
			particleCount: 100,
			startVelocity: 30,
			spread: 360,
			origin: {
				x: Math.random(),
				y: Math.random() - 0.2
			}
		});
	}
	return (
		<div className={styles['score-popup-container']}>
			<div className={styles['score-content']}>
				<div className={styles['title']}>
					<h2>{language?.examResult}</h2>
				</div>
				<div className={styles['content-data']}>
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
							className={appStyles['button-d']}>
							<TiArrowBack />
							{language?.goBack}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
