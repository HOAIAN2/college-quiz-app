import appStyles from '~styles/App.module.css';
import styles from './styles/Exam.module.css';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { BiExport } from 'react-icons/bi';
import { ImCancelCircle } from 'react-icons/im';
import { LuAlarmClock, LuRefreshCw } from 'react-icons/lu';
import { Link, Navigate, useParams } from 'react-router-dom';
import { apiExportExamResult, apiGetExamById, apiUpdateExamStatus } from '~api/exam';
import Loading from '~components/Loading';
import YesNoPopUp from '~components/YesNoPopUp';
import QUERY_KEYS from '~constants/query-keys';
import useAppContext from '~hooks/useAppContext';
import useLanguage from '~hooks/useLanguage';
import caculateScore from '~utils/caculateScore';
import css from '~utils/css';
import languageUtils from '~utils/languageUtils';
import { saveBlob } from '~utils/saveBlob';

export default function Exam() {
    const { user, appLanguage, permissions } = useAppContext();
    const [isExporting, setIsExporting] = useState(false);
    const [showStartExamPopUp, setShowStartExamPopUp] = useState(false);
    const [showCancelExamPopUp, setShowCancelExamPopUp] = useState(false);
    const language = useLanguage('page.exam');
    const { id } = useParams();
    const handleStartExam = async () => {
        await apiUpdateExamStatus('start', String(id));
    };
    const handleCancelExam = async () => {
        await apiUpdateExamStatus('cancel', String(id));
    };
    const queryData = useQuery({
        queryKey: [QUERY_KEYS.EXAM, { id: id }],
        queryFn: () => apiGetExamById(String(id)),
        refetchOnWindowFocus: false,
        enabled: permissions.has('exam_view')
    });
    const onMutateSuccess = () => { queryData.refetch(); };
    const isSubmitted = queryData.data ?
        queryData.data.result.find(item => item.studentId === user.user!.id)
            ?.correctCount !== null
        : false;
    const handleExportExamResult = () => {
        setIsExporting(true);
        const defaultFileName = `Exam-${id}-${new Date().toISOString().split('T')[0]}.xlsx`;
        apiExportExamResult(String(id), defaultFileName)
            .then(res => {
                saveBlob(res.data, res.fileName);
            })
            .finally(() => {
                setIsExporting(false);
            });
    };
    const isExamOver = (() => {
        if (!queryData.data) return false;
        if (!queryData.data.startedAt) return false;
        const startedAt = new Date(queryData.data.startedAt);
        const endedAt = new Date(startedAt.getTime() + (queryData.data.examTime * 60 * 1000));
        if (endedAt.getTime() < new Date().getTime()) {
            return true;
        }
        else return false;
    })();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const durationFormat = new Intl.DurationFormat(appLanguage.language, {
        style: 'long'
    });
    if (!permissions.has('exam_view')) return <Navigate to='/' />;
    return (
        <>
            {showStartExamPopUp === true ?
                <YesNoPopUp
                    message={language?.startMessage || ''}
                    mutateFunction={handleStartExam}
                    setShowPopUp={setShowStartExamPopUp}
                    onMutateSuccess={onMutateSuccess}
                    langYes={language?.langYes}
                    langNo={language?.langNo}
                /> : null}
            {showCancelExamPopUp === true ?
                <YesNoPopUp
                    message={language?.cancelMessage || ''}
                    mutateFunction={handleCancelExam}
                    setShowPopUp={setShowCancelExamPopUp}
                    onMutateSuccess={onMutateSuccess}
                    langYes={language?.langYes}
                    langNo={language?.langNo}
                /> : null}
            <main className={css(appStyles.dashboard, styles.pageContent)}>
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
                                            <p>{queryData.data.name}</p>
                                        </div>
                                        <div className={styles.wrapItem}>
                                            <label>{language?.examDate}: </label>
                                            <p>{new Date(queryData.data.examDate).toLocaleString(appLanguage.language)}</p>
                                        </div>
                                        <div className={styles.wrapItem}>
                                            <label>{language?.examTime}: </label>
                                            <p>
                                                {durationFormat.format({ minutes: queryData.data.examTime })}
                                            </p>
                                        </div>
                                        <div className={css(styles.wrapItem, styles.supervisorsContainer)}>
                                            <label>{language?.supervisors}</label>
                                            <p>
                                                {queryData.data.examSupervisors.map(supervisor => {
                                                    return (
                                                        languageUtils.getFullName(supervisor.user.firstName, supervisor.user.lastName)
                                                    );
                                                }).join(', ')
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {
                                    permissions.hasAnyFormList(['exam_update', 'exam_submit']) ?
                                        <div className={styles.actionItems}>
                                            {
                                                permissions.has('exam_submit')
                                                    && queryData.data.startedAt !== null
                                                    && !isExamOver
                                                    && !isSubmitted ?
                                                    <>
                                                        <Link
                                                            style={{ width: 'fit-content' }}
                                                            to='take'
                                                            type='button'
                                                            className={appStyles.actionItem}
                                                        >
                                                            <LuAlarmClock />{language?.doExam}
                                                        </Link>
                                                    </> : null
                                            }
                                            {
                                                permissions.has('exam_update') ?
                                                    <>
                                                        {
                                                            queryData.data.startedAt === null && queryData.data.cancelledAt === null ?
                                                                <button
                                                                    onClick={() => {
                                                                        setShowStartExamPopUp(true);
                                                                    }}
                                                                    type='button'
                                                                    className={appStyles.actionItem}
                                                                ><LuAlarmClock /> {language?.startExam}
                                                                </button>
                                                                : null
                                                        }
                                                        {
                                                            !isExamOver && queryData.data.cancelledAt === null ?
                                                                <button
                                                                    type='button'
                                                                    onClick={() => {
                                                                        setShowCancelExamPopUp(true);
                                                                    }}
                                                                    className={appStyles.actionItemWhiteBorderRed}>
                                                                    <ImCancelCircle /> {language?.cancelExam}
                                                                </button>
                                                                : null
                                                        }
                                                    </> : null
                                            }
                                        </div>
                                        : null
                                }
                            </section>
                            <section className={styles.resultContainer}>
                                <div className={styles.header}>
                                    <h2 className={styles.title}>{language?.result}</h2>
                                </div>
                                <div className={appStyles.actionBar}
                                    style={{ marginBottom: '20px' }}
                                >
                                    <button
                                        className={
                                            css(
                                                queryData.isFetching ? appStyles.buttonSubmitting : '',
                                                queryData.isFetching ? styles.refreshing : '',
                                                appStyles.actionItem
                                            )
                                        }
                                        onClick={() => { queryData.refetch(); }}
                                    >
                                        <LuRefreshCw />
                                        {language?.refresh}
                                    </button>
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
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                queryData.data.result.map(item => {
                                                    return (
                                                        <tr key={`exam-result-${item.studentId}`}>
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
                                                                {isExamOver === true && item.questionCount === null ? 0 :
                                                                    item.correctCount === null
                                                                        ? language?.didNotSubmitted :
                                                                        caculateScore(item.correctCount, item.questionCount)}
                                                            </td>
                                                            <td className={css(styles.column, styles.medium)}>
                                                                {item.submittedAt ?
                                                                    new Date(item.submittedAt).toLocaleString(appLanguage.language)
                                                                    : null}
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
            </main>
        </>
    );
}
