import { IconType } from "react-icons"
import { Link } from "react-router-dom"
import styles from '../styles/DashboardCard.module.css'

type DashboardCardProps = {
    to: string
    content?: string
    data: string | number
    color: 'magenta' | 'blue' | 'red' | 'green'
    Icon: IconType
}
export default function DashboardCard({
    to,
    content,
    data,
    color,
    Icon
}: DashboardCardProps) {
    return (
        <Link
            to={to}
            className={
                [
                    'dashboard-card-d',
                    styles['dashboard-card'],
                    styles[`container-${color}`]
                ].join(' ')
            }>
            <div className={styles['card-top']}>
                <Icon />
                {data}
            </div>
            <div className={styles['card-bottom']}>{content}</div>
        </Link>
    )
}