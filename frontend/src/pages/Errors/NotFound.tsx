import styles from './styles/NotFound.module.css';

import useLanguage from '~hooks/useLanguage';

export default function NotFound() {
    const language = useLanguage('page.not_found');
    document.querySelector('.pre-load-container')?.classList.add('hide');
    return (
        <>
            <div className={styles.notFound}>
                <div className={styles.title}>404</div>
                <p style={{ fontSize: '16px', textAlign: 'center' }}>
                    {language?.pageNotFound} <br />
                    <a href="/" className={styles.goHome}>
                        {language?.goBackHome}
                    </a>
                </p>
            </div>
        </>
    );
}
