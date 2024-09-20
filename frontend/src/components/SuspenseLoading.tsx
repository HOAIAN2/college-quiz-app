import styles from './styles/SupspenseLoading.module.css';

export default function SuspenseLoading() {
    return (
        <div className={styles.loadingContainer}>
            <div className={styles.ldsSpinner}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    );
}
