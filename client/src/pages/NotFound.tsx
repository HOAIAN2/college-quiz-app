import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import useLanguage from '../hooks/useLanguage'
import { PageNotFoundLang } from '../models/lang'
import styles from '../styles/NotFound.module.css'

export default function NotFound() {
    const language = useLanguage<PageNotFoundLang>('page.not_found')
    document.querySelector('.pre-load-container')?.classList.add('hide')
    return (
        <>
            <div className={styles['not-found']}>
                <div className={
                    [
                        styles['title']
                    ].join(' ')
                }>404</div>
                <Link to='/' className={
                    [
                        'action-item-d',
                        styles['go-home']
                    ].join(' ')
                }>{language?.home}</Link>
            </div>
            <Footer />
        </>
    )
}