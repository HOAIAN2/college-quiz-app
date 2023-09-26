import { useLanguage } from '../contexts/hooks'
import styles from '../styles/Footer.module.css'

export default function Footer() {
    const { appLanguage, setAppLanguage } = useLanguage()
    return (
        <div className={styles['footer']}>
            <div>
                <span>
                    {"College Quiz App @" + new Date().getFullYear()}
                </span>
                <a>Terms</a>
                <a>Privacy</a>
                <a>Security</a>
                <a>Status</a>
                <a>Docs</a>
                <a>Contact</a>
                <a>About</a>
                <a>Terms</a>
            </div>
            <select value={appLanguage}
                onChange={(e) => {
                    setAppLanguage(e.currentTarget.value)
                    localStorage.setItem('lang', e.currentTarget.value)
                }}>
                <option value="en">English</option>
                <option value="vi">Tiếng Việt</option>
            </select>
        </div>
    )
}