import styles from '../styles/SettingsContent.module.css';

import useLanguage from '~hooks/useLanguage';
import themeUtils from '~utils/themeUtils';

export default function ThemeContent() {
    const language = useLanguage('component.settings_content');
    const colors = [
        'var(--color-blue)',
        // 'var(--color-red)',
        // 'var(--color-green)',
        // 'var(--color-yellow)',
        // 'var(--color-gray)',
        // 'var(--color-soft-yellow)',
        'var(--color-soft-magenta)',
        // 'var(--color-soft-blue)',
        // 'var(--color-soft-red)',
        'var(--color-soft-green)',
    ];
    return (
        <>
            <article className={styles.article}>
                <h3>{language?.primaryColor}</h3>
                <div style={{
                    display: 'flex',
                    gap: '10px'
                }}>
                    {
                        colors.map(color => {
                            return (
                                <div
                                    key={color}
                                    onClick={() => { themeUtils.setPrimaryColor(color); }}
                                    style={{
                                        cursor: 'pointer',
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '5px',
                                        backgroundColor: color
                                    }}>
                                </div>
                            );
                        })
                    }
                </div>
            </article>
        </>
    );
}
