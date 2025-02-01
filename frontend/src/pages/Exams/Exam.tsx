import appStyles from '~styles/App.module.css';
import styles from './styles/Exam.module.css';

import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { BiExport } from 'react-icons/bi';
import { ImCancelCircle } from 'react-icons/im';
import { LuAlarmClock, LuRefreshCw } from 'react-icons/lu';
import { Link, Navigate, useParams } from 'react-router-dom';
import { apiExportExamResult, apiGetExamById, apiGetExamResults, apiUpdateExamStatus } from '~api/exam';
import Loading from '~components/Loading';
import YesNoPopUp from '~components/YesNoPopUp';
import QUERY_KEYS from '~constants/query-keys';
import useAppContext from '~hooks/useAppContext';
import useLanguage from '~hooks/useLanguage';
import NotFound from '~pages/Errors/NotFound';
import caculateScore from '~utils/caculateScore';
import css from '~utils/css';
import languageUtils from '~utils/languageUtils';
import { saveBlob } from '~utils/saveBlob';

export default function Exam() {
    const { user, appLanguage, permissions, appTitle } = useAppContext();
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
        enabled: permissions.has('exam_view'),
        retry: false,
    });
    const resultsQueryData = useQuery({
        queryKey: [QUERY_KEYS.EXAM_RESULTS, { examId: id }],
        queryFn: () => apiGetExamResults(String(id)),
        refetchOnWindowFocus: false,
        enabled: permissions.has('exam_view'),
        retry: false,
    });
    const onMutateSuccess = () => { queryData.refetch(); };
    const isSubmitted = resultsQueryData.data ?
        resultsQueryData.data.find(item => item.user.id === user.user!.id)
            ?.result !== null
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
    const durationFormat = languageUtils.createDurationFormatter(appLanguage.language);
    useEffect(() => {
        if (language) appTitle.setAppTitle(language.exam);
    }, [appTitle, language]);
    if (!permissions.has('exam_view')) return <Navigate to='/' />;
    if (queryData.error) return (
        <main className={css(appStyles.dashboard, styles.pageContent)}>
            <NotFound />
        </main>
    );
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
                                                {durationFormat(queryData.data.examTime)}
                                            </p>
                                        </div>
                                        <div className={css(styles.wrapItem, styles.supervisorsContainer)}>
                                            <label>{language?.supervisors}:</label>
                                            <p>
                                                {queryData.data.supervisors.map(supervisor => {
                                                    return (
                                                        languageUtils.getFullName(supervisor.firstName, supervisor.lastName)
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
                                <div className={appStyles.actionBar}>
                                    <button
                                        className={
                                            css(
                                                queryData.isFetching && resultsQueryData.isFetching ? appStyles.buttonSubmitting : '',
                                                queryData.isFetching && resultsQueryData.isFetching ? styles.refreshing : '',
                                                appStyles.actionItem
                                            )
                                        }
                                        onClick={() => {
                                            queryData.refetch();
                                            resultsQueryData.refetch();
                                        }}>
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
                                                resultsQueryData.data?.map(item => {
                                                    return (
                                                        <tr key={`exam-result-${item.user.id}`}>
                                                            <td className={css(styles.column, styles.superLarge)}>
                                                                {languageUtils.getFullName(item.user.firstName, item.user.lastName)}
                                                            </td>
                                                            <td className={css(styles.column, styles.medium)}>
                                                                {item.user.schoolClass?.shortcode}
                                                            </td>
                                                            <td className={css(styles.column, styles.medium)}>
                                                                {language?.genders[item.user.gender]}
                                                            </td>
                                                            <td className={css(styles.column, styles.medium)}>
                                                                {
                                                                    isExamOver === true && item.result === null ? 0 :
                                                                        item.result !== null ?
                                                                            caculateScore(item.result.correctCount, item.result.questionCount)
                                                                            : language?.didNotSubmitted
                                                                }
                                                            </td>
                                                            <td className={css(styles.column, styles.medium)}>
                                                                {item.result?.createdAt ?
                                                                    new Date(item.result.createdAt).toLocaleString(appLanguage.language)
                                                                    : null}
                                                            </td>
                                                            <td className={css(styles.column, styles.medium)}>
                                                                {
                                                                    item.result?.remarkByUserId ? language?.yes : language?.no
                                                                }
                                                            </td>
                                                            <td className={css(styles.column, styles.medium)}>
                                                                {
                                                                    item.result?.cancelledByUserId ? language?.yes : language?.no
                                                                }
                                                            </td>
                                                            <td className={css(styles.column, styles.medium)}>
                                                                {
                                                                    permissions.has('exam_result_view') &&
                                                                        item.result ? <Link to={`results/${item.result.id}`}>{language?.detail}</Link> : null
                                                                }
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
