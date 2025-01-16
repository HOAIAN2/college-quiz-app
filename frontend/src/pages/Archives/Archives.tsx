import appStyles from '~styles/App.module.css';
import styles from '~styles/CardPage.module.css';

import { Link } from 'react-router-dom';
import css from '~utils/css';

function Archives() {
    return (
        <>
            <main className={appStyles.dashboard}>
                <section className={styles.pageContent}>
                    <div className={styles.wrapCardContainer}>
                        <div className={styles.cardContainer}>
                            <Link
                                to='exams'
                                className={css(appStyles.dashboardCard, styles.card)}
                            >
                                <div className={styles.cardSection}>
                                    <p className={styles.content}>
                                        Exam results
                                    </p>
                                </div>
                                <div className={styles.cardSection}>
                                </div>
                                <div className={styles.cardSection}>
                                </div>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}

export default Archives;