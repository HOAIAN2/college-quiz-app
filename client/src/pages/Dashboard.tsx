import styles from '../styles/Dashboard.module.css'

export default function Dashboard() {
    return (
        <div
            className={
                [
                    'dashboard-d',
                    styles['dashboard']
                ].join(' ')
            }
        >
            <div className={styles['wrap-dasshboard-item']}>
                <div className={
                    [
                        'dashboard-item-d',
                        styles['dashboard-item'],
                        styles['container-blue']
                    ].join(' ')
                }></div>
                <div className={
                    [
                        'dashboard-item-d',
                        styles['dashboard-item'],
                        styles['container-red']
                    ].join(' ')
                }></div>
                <div className={
                    [
                        'dashboard-item-d',
                        styles['dashboard-item'],
                        styles['container-green']
                    ].join(' ')
                }></div>
                <div className={
                    [
                        'dashboard-item-d',
                        styles['dashboard-item'],
                        styles['container-pink']
                    ].join(' ')
                }></div>
            </div>
        </div>
    )
}