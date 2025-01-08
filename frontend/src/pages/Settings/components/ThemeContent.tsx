import appStyles from '~styles/App.module.css';
import settingsStyles from '../styles/SettingsContent.module.css';
import styles from '../styles/ThemeContent.module.css';

import useLanguage from '~hooks/useLanguage';
import css from '~utils/css';
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
                <h3>{language?.theme.primaryColor}</h3>
                <div className={styles.primaryColorContainer}>
                    {
                        colors.map(color => {
                            return (
                                <>
                                    <div
                                        onClick={() => { themeUtils.setPrimaryColor(color); }}
                                        key={color}
                                        className={styles.primaryColorItem}
                                        style={{
                                            borderColor: color
                                        }}>
                                        <div className={styles.primaryColorSidebar}>
                                            {
                                                new Array(5).fill(0).map((_, index) => {
                                                    return (
                                                        <div
                                                            key={index}
                                                            className={styles.primaryColorSidebarItem}
                                                            style={{
                                                                background: index === 0 ? color : 'var(--color-background)',
                                                            }}
                                                        ></div>
                                                    );
                                                })
                                            }
                                        </div>
                                        <div className={styles.primaryColorMainContent}>
                                            <div className={styles.primaryColorHead}>
                                                {
                                                    new Array(3).fill(0).map((_, index) => {
                                                        return (
                                                            <div
                                                                key={index}
                                                                className={styles.primaryColorHeadItem}
                                                                style={{
                                                                    backgroundColor: color,
                                                                }}></div>
                                                        );
                                                    })
                                                }
                                            </div>
                                            <div className={styles.primaryColorBody}></div>
                                        </div>
                                    </div>
                                </>
                            );
                        })
                    }
                </div>
                <div>
                    <h4>{language?.theme.primaryColorCustom}</h4>
                    <input
                        defaultValue={themeUtils.getPrimaryColor() || themeUtils.getVariable('color-primary')}
                        onChange={e => {
                            const selectedColor = e.currentTarget.value;
                            themeUtils.setPrimaryColor(selectedColor);
                        }}
                        type='color'
                    />
                </div>
                <div className={settingsStyles.actionItems}>
                    <button
                        onClick={() => { themeUtils.setPrimaryColor(colors[0]); }}
                        className={css(appStyles.actionItemWhite, settingsStyles.buttonItem)}>
                        {language?.reset}
                    </button>
                </div>
            </article>
        </>
    );
}
