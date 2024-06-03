import style from '../styles/StatusBadge.module.css';
import css from '../utils/css';

type StatusBadgeProps = {
	color: 'red' | 'green' | 'yellow';
	content?: string;
};
export default function StatusBadge({
	color,
	content
}: StatusBadgeProps) {
	return (
		<div
			title={content}
			className={css(style['badge'], style[color])}>
		</div>
	);
}
