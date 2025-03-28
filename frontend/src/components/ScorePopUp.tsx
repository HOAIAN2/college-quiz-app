import appStyles from '~styles/App.module.css';
import styles from './styles/ScorePopUp.module.css';

import confetti from 'canvas-confetti';
import { TiArrowBack } from 'react-icons/ti';
import { useNavigate } from 'react-router';
import useLanguage from '~hooks/useLanguage';
import { ExamResult } from '~models/exam';
import caculateScore from '~utils/caculate-score';

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
            if (percent >= 0.7) return styles.green;
            if (percent >= 0.5) return styles.yellow;
            return styles.red;
        };
        const colorClass = getColorClass();
        return (
            <div className={`${styles.score} ${colorClass}`}>
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
        <div className={styles.scorePopupContainer}>
            <div className={styles.scoreContent}>
                <div className={styles.title}>
                    <h2>{language?.examResult}</h2>
                </div>
                <div className={styles.contentData}>
                    <div className={styles.groupData}>
                        <div className={styles.groupItems}>
                            <div className={styles.label}>{language?.score}</div>
                            {renderScore()}
                        </div>
                        <div className={styles.groupItems}>
                            <div className={styles.label}>{language?.numberOfCorrectQuestion}: {data.correctCount}/{data.questionCount}</div>
                        </div>
                        <p>{`${language?.ipAddress}: ${data.ip}`}</p>
                    </div>
                    <div className={styles.actionItems}>
                        <button
                            onClick={handleClosePopUp}
                            className={appStyles.button}>
                            <TiArrowBack />
                            {language?.goBack}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
