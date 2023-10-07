import { Link } from 'react-router-dom'
import styles from '../styles/NotFound.module.css'
export default function NotFound() {
    document.querySelector('.pre-load-container')?.classList.add('hide')
    return (
        <div className={styles['not-found']}>
            <div className={
                [
                    styles['title']
                ].join(' ')
            }>404</div>
            <Link to='/' className={
                [
                    'button-d',
                    styles['go-to-home']
                ].join(' ')
            }>Home</Link>
        </div>
    )
}