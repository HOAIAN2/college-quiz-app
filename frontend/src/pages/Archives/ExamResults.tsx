import appStyles from '~styles/App.module.css';
import styles from './styles/ExamResults.module.css';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { BiExport } from 'react-icons/bi';
import { useNavigate, useParams } from 'react-router-dom';
import { apiExportExamResult } from '~api/exam';
import { apiGetExamResults } from '~api/exam-result';
import Loading from '~components/Loading';
import QUERY_KEYS from '~constants/query-keys';
import useAppContext from '~hooks/useAppContext';
import useLanguage from '~hooks/useLanguage';
import caculateScore from '~utils/caculateScore';
import css from '~utils/css';
import languageUtils from '~utils/languageUtils';
import { saveBlob } from '~utils/saveBlob';

function ExamResults() {
    // Show exam detail, exam result
    const [isExporting, setIsExporting] = useState(false);
    const { appLanguage, permissions } = useAppContext();
    const language = useLanguage('page.exam_results');
    const { examId } = useParams();
    const navigate = useNavigate();
    const queryData = useQuery({
        queryKey: [QUERY_KEYS.EXAM_RESULTS, { id: examId }],
        queryFn: () => apiGetExamResults(String(examId)),
        refetchOnWindowFocus: false,
        enabled: permissions.has('exam_view'),
        retry: false,
    });
    const handleExportExamResult = () => {
        setIsExporting(true);
        const defaultFileName = `Exam-${examId}-${new Date().toISOString().split('T')[0]}.xlsx`;
        apiExportExamResult(String(examId), defaultFileName)
            .then(res => {
                saveBlob(res.data, res.fileName);
            })
            .finally(() => {
                setIsExporting(false);
            });
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const durationFormat = new Intl.DurationFormat(appLanguage.language, {
        style: 'long'
    });
    return (
        <main className={appStyles.dashboard}>
            <section className={styles.pageContent}>
                {
                    queryData.isLoading ? <Loading /> : null
                }
                {
                    queryData.data ?
                        <>
                            <section className={styles.examInfoContainer}>
                                <div className={styles.header}>
                                    <h2 className={styles.title}>{language?.exam}</h2>
                                </div>
                                <div className={styles.examInfo}>
                                    <div className={styles.groupInfos}>
                                        <div className={styles.wrapItem}>
                                            <label>{language?.name}: </label>
                                            <p>{queryData.data.exam.name}</p>
                                        </div>
                                        <div className={styles.wrapItem}>
                                            <label>{language?.examDate}: </label>
                                            <p>{new Date(queryData.data.exam.examDate).toLocaleString(appLanguage.language)}</p>
                                        </div>
                                        <div className={styles.wrapItem}>
                                            <label>{language?.examTime}: </label>
                                            <p>
                                                {durationFormat.format({ minutes: queryData.data.exam.examTime })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <section className={styles.resultContainer}>
                                <div className={styles.header}>
                                    <h2 className={styles.title}>{language?.result}</h2>
                                </div>
                                <div className={appStyles.actionBar}>
                                    <button
                                        className={
                                            css(
                                                isExporting ? appStyles.buttonSubmitting : '',
                                                appStyles.actionItemWhite
                                            )
                                        }
                                        onClick={handleExportExamResult}
                                    >
                                        <BiExport />
                                        {language?.export}
                                    </button>
                                </div>
                                <div className={styles.tableContainer}>
                                    <table className={styles.table}>
                                        <thead>
                                            <tr>
                                                <th className={css(styles.column, styles.superLarge)}>
                                                    {language?.name}
                                                </th>
                                                <th className={css(styles.column, styles.medium)}>
                                                    {language?.schoolClass}
                                                </th>
                                                <th className={css(styles.column, styles.medium)}>
                                                    {language?.genders.gender}
                                                </th>
                                                <th className={css(styles.column, styles.medium)}>
                                                    {language?.score}
                                                </th>
                                                <th className={css(styles.column, styles.medium)}>
                                                    {language?.submittedAt}
                                                </th>
                                                <th className={css(styles.column, styles.medium)}>
                                                    {language?.remarked}
                                                </th>
                                                <th className={css(styles.column, styles.medium)}>
                                                    {language?.cancelled}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                queryData.data.result.map(item => {
                                                    return (
                                                        <tr
                                                            key={`exam-result-${item.studentId}`}
                                                            onClick={() => { if (item.id) navigate(item.id); }}
                                                        >
                                                            <td className={css(styles.column, styles.superLarge)}>
                                                                {languageUtils.getFullName(item.firstName, item.lastName)}
                                                            </td>
                                                            <td className={css(styles.column, styles.medium)}>
                                                                {item.schoolClassShortcode}
                                                            </td>
                                                            <td className={css(styles.column, styles.medium)}>
                                                                {language?.genders[item.gender]}
                                                            </td>
                                                            <td className={css(styles.column, styles.medium)}>
                                                                {item.questionCount === null ? 0 :
                                                                    item.correctCount === null
                                                                        ? language?.didNotSubmitted :
                                                                        caculateScore(item.correctCount, item.questionCount)}
                                                            </td>
                                                            <td className={css(styles.column, styles.medium)}>
                                                                {item.submittedAt ?
                                                                    new Date(item.submittedAt).toLocaleString(appLanguage.language)
                                                                    : null}
                                                            </td>
                                                            <td className={css(styles.column, styles.medium)}>
                                                                {item.remarked ? language?.yes : language?.no}
                                                            </td>
                                                            <td className={css(styles.column, styles.medium)}>
                                                                {item.cancelled ? language?.yes : language?.no}
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        </> : null
                }
            </section>
        </main>
    );
}

export default ExamResults;