import styles from '../styles/Home.module.css'

export default function Home() {
    return (
        <div className={
            ['.dashboard-d',
                styles['home-page']
            ].join(' ')
        }>Home</div>
    )
}