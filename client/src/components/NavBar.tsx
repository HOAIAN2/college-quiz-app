import styles from '../styles/NavBar.module.css'

export default function NavBar({ type }:
    { type: 'admin' | 'teacher' | 'student' }) {
    const features = {
        'admin': [''],
        'teacher': [''],
        'student': ['']
    }
    return (
        <div className={styles['nav-bar']}>
            <ul>{features[type].map(feature => {
                return <li>{feature}</li>
            })}</ul>
        </div>
    )
}