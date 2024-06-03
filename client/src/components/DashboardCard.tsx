import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import appStyles from '../App.module.css';
import styles from '../styles/DashboardCard.module.css';
import css from '../utils/css';

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
	return (
		<Link
			to={to || '#'}
			className={css(appStyles['dashboard-card-d'], styles['dashboard-card'], styles[`container-${color}`])}>
			<div className={styles['card-top']}>
				{icon}
				{data}
			</div>
			<div className={styles['card-bottom']}>{content}</div>
		</Link>
	);
}
