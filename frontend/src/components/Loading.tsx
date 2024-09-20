import appStyles from '~styles/App.module.css';

import useLanguage from '~hooks/useLanguage';

export default function Loading() {
    const language = useLanguage('component.loading');
    return (
        <div className={appStyles.dataLoading}
            style={{ zIndex: 10 }}
        > {language?.text}
        </div >
    );
}
