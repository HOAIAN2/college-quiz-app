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
            <div className={
                [
                    'dashboard-item-d'
                ].join(' ')
            }></div>
        </div>
    )
}