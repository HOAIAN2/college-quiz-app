import appStyles from '~styles/App.module.css';
import styles from '../styles/DashboardCard.module.css';

import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import css from '~utils/css';

type DashboardCardProps = {
    to?: string;
    content?: string;
    data: string | number;
    color: 'magenta' | 'blue' | 'red' | 'green';
    icon: ReactNode;
};
export default function DashboardCard({
    to,
    content,
    data,
    color,
    icon
}: DashboardCardProps) {
    const colorStyle = 'container' + color.charAt(0).toUpperCase() + color.slice(1) as keyof typeof styles;
    return (
        <Link
            to={to || '#'}
            className={css(appStyles.dashboardCard, styles.dashboardCard, styles[colorStyle])}>
            <div className={styles.cardTop}>
                {icon}
                {data}
            </div>
            <div className={styles.cardBottom}>{content}</div>
        </Link>
    );
}
