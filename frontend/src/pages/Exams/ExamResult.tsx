import appStyles from '~styles/App.module.css';
import styles from './styles/ExamResult.module.css';

import { useQuery } from '@tanstack/react-query';
import { Navigate, useParams } from 'react-router-dom';
import { apiGetExamResult } from '~api/exam-result';
import Loading from '~components/Loading';
import QUERY_KEYS from '~constants/query-keys';
import useAppContext from '~hooks/useAppContext';
import caculateScore from '~utils/caculateScore';
import css from '~utils/css';
import languageUtils from '~utils/languageUtils';

function ExamResult() {
    const { permissions } = useAppContext();
    const { resultId } = useParams();
    const queryData = useQuery({
        queryKey: [QUERY_KEYS.EXAM_RESULT, { id: resultId }],
        queryFn: () => apiGetExamResult(String(resultId)),
        refetchOnWindowFocus: false,
        staleTime: Infinity,
    });
    if (!permissions.has('exam_result_view')) return <Navigate to='/' />;
    return (
        <>
            <main className={css(appStyles.dashboard, styles.examResultContainer)}>
                {
                    queryData.isLoading ? <Loading /> : null
                }
                {
                    queryData.data ?
                        <>
                            <section>
                                <h2>Kết quả</h2>
                                <div>Số câu đúng: {queryData.data.examResult.correctCount}</div>
                                <div>Số câu hỏi: {queryData.data.examResult.questionCount}</div>
                                <div>Điểm số: {caculateScore(queryData.data.examResult.correctCount, queryData.data.examResult.questionCount)}</div>
                            </section>
                            <section>
                                <h2>Chi tiết</h2>
                                <div className={styles.questionsContainer}>
                                    {
                                        queryData.data.examQuestionsAnswers.map(answer => {
                                            return (
                                                <div key={answer.id}
                                                    className={styles.examQuestionContainer}
                                                >
                                                    <div
                                                        dangerouslySetInnerHTML={{
                                                            __html: answer.examQuestion.question.content
                                                        }}>
                                                    </div>
                                                    {
                                                        answer.examQuestion.question.questionOptions.map((option, i) => {
                                                            return (
                                                                <div key={option.id}
                                                                    className={styles.questionOptionContainer}>
                                                                    <div>{languageUtils.getLetterFromIndex(i)}.</div>
                                                                    <p dangerouslySetInnerHTML={{ __html: option.content }}></p>
                                                                </div>
                                                            );
                                                        })
                                                    }
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            </section>
                        </> : null
                }
            </main>
        </>
    );
}

export default ExamResult;