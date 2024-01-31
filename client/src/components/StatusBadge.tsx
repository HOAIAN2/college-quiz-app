import style from '../styles/StatusBadge.module.css'

type StatusBadgeProps = {
    color: 'red' | 'green'
    content?: string
}
export default function StatusBadge({
    color,
    content
}: StatusBadgeProps) {
    return (
        <div
            title={content}
            className={
                [
                    style['badge'],
                    style[color]
                ].join(' ')
            }></div>
    )
}
