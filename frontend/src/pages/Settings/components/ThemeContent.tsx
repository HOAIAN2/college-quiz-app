import settingsStyles from '../styles/SettingsContent.module.css';
import styles from '../styles/ThemeContent.module.css';

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
            <article className={settingsStyles.article}>
                <h3>{language?.primaryColor}</h3>
                <div className={styles.accentColorContainer}>
                    {
                        colors.map(color => {
                            return (
                                <>
                                    <div
                                        key={color}
                                        className={styles.accentColorItem}
                                        style={{
                                            borderColor: color
                                        }}>
                                        <div className={styles.accentColorSidebar}>
                                            {
                                                new Array(5).fill(0).map((_, index) => {
                                                    return (
                                                        <div
                                                            key={index}
                                                            className={styles.accentColorSidebarItem}
                                                            style={{
                                                                background: index === 0 ? color : 'var(--color-background)',
                                                            }}
                                                        ></div>
                                                    );
                                                })
                                            }
                                        </div>
                                        <div className={styles.accentColorMainContent}>
                                            <div className={styles.accentColorHead}>
                                                {
                                                    new Array(3).fill(0).map((_, index) => {
                                                        return (
                                                            <div
                                                                key={index}
                                                                className={styles.accentColorHeadItem}
                                                                style={{
                                                                    backgroundColor: color,
                                                                }}></div>
                                                        );
                                                    })
                                                }
                                            </div>
                                            <div className={styles.accentColorBody}></div>
                                        </div>
                                    </div>
                                </>
                            );
                        })
                    }
                </div>
                <div className={settingsStyles.actionItems}>
                    <button className={settingsStyles.buttonItem}>Save</button>
                    <button className={settingsStyles.buttonItem}>Reset</button>
                </div>
            </article>
        </>
    );
}
