import { BiLogOut } from 'react-icons/bi'
import styles from '../styles/Header.module.css'

export default function Header() {
    return (
        <div className={styles['header']}>
            <div id='loader'></div>
            <div>
                <BiLogOut />
            </div>
        </div>
    )
}