import { useEffect } from 'react';
import useAppContext from '~hooks/useAppContext';
import appStyles from '~styles/App.module.css';
import styles from '~styles/CardPage.module.css';

import css from '~utils/css';

function ExamResults() {
    const { appTitle } = useAppContext();
    useEffect(() => {
        appTitle.setAppTitle('Lưu trữ bài thi');
    });
    // Display filter to search exam result: semester, subject,....
    return (
        <>
            <main className={appStyles.dashboard}>
                <section className={styles.pageContent}>
                    {/* {
                        queryData.isLoading ? <Loading /> : null
                    } */}
                    <div className={styles.filterForm}>
                        <div className={styles.wrapInputItem}>
                            <label>Khóa học</label>
                            <input className={css(appStyles.input, styles.inputItem)} />
                        </div>
                    </div>
                    <div className={styles.wrapCardContainer}>
                        <div className={styles.cardContainer}>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}

export default ExamResults;