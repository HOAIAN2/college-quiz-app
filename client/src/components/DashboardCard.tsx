import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import styles from '../styles/DashboardCard.module.css'

type DashboardCardProps = {
    to?: string
    content?: string
    data: string | number
    color: 'magenta' | 'blue' | 'red' | 'green'
    icon: ReactNode
}
export default function DashboardCard({
    to,
    content,
    data,
    color,
    icon
}: DashboardCardProps) {
    return (
        <Link
            to={to || '#'}
            className={
                [
                    'dashboard-card-d',
                    styles['dashboard-card'],
                    styles[`container-${color}`]
                ].join(' ')
            }>
            <div className={styles['card-top']}>
                {icon}
                {data}
            </div>
            <div className={styles['card-bottom']}>{content}</div>
        </Link>
    )
}