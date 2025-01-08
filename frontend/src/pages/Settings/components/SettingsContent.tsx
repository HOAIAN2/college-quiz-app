import useAppContext from '~hooks/useAppContext';
import ExamContent from './ExamContent';
import SecurityContent from './SecurityContent';
import SystemContent from './SystemContent';
import ThemeContent from './ThemeContent';

export default function SettingsContent({ name }: { name: string; }) {
    const { user } = useAppContext();
    if (!user.user) return null;
    if (name === 'system') return <SystemContent />;
    // if (name === 'notifications') return (
    //     <>
    //     </>
    // );
    if (name === 'security') return <SecurityContent />;
    if (name === 'theme') return <ThemeContent />;
    if (name === 'exam') return <ExamContent />;
    return null;
}
