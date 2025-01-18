import appStyles from '~styles/App.module.css';
import styles from '../styles/ExamActionPopUp.module.css';

import { useMutation } from '@tanstack/react-query';
import { RxCross2 } from 'react-icons/rx';
import { apiCacelExamResult, apiRemarkExamResult } from '~api/exam-result';
import Loading from '~components/Loading';
import useLanguage from '~hooks/useLanguage';
import css from '~utils/css';

type ExamActionPopUpProps = {
    action: 'cancel' | 'remark';
    examResultId: number | string;
    onMutateSuccess: () => void;
    setShowPopUp: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function ExamActionPopUp({
    action,
    examResultId,
    onMutateSuccess,
    setShowPopUp,
}: ExamActionPopUpProps) {
    const language = useLanguage('component.exam_action_popup');
    const handleClosePopUp = () => {
        setShowPopUp(false);
    };
    const handleActionCall = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        switch (action) {
            case 'remark':
                await apiRemarkExamResult(examResultId, formData);
                break;
            case 'cancel':
                await apiCacelExamResult(examResultId, formData);
                break;
            default:
                break;
        }
    };
    const mutation = useMutation({
        mutationFn: handleActionCall,
        onSuccess: () => {
            onMutateSuccess();
            handleClosePopUp();
        }
    });
    return (
        <div
            className={
                css(
                    styles.examActionPopUp,
                )
            }>
            {
                mutation.isPending ? <Loading /> : null
            }
            <div
                className={
                    css(
                        styles.examActionPopUpForm,
                    )
                }>
                <div className={styles.header}>
                    <div
                        className={styles.escButton}
                        onClick={handleClosePopUp}
                    >
                        <RxCross2 />
                    </div>
                </div>
                <form className={styles.formData} onSubmit={e => { mutation.mutate(e); }}>
                <p>{language?.warningMessage}</p>
                <br />
                    <div className={styles.groupInputs}>
                        <div className={styles.wrapItem}>
                            <label className={appStyles.required} htmlFor='password'>{language?.password}</label>
                            <input
                                id='password'
                                name='password'
                                className={css(appStyles.input, styles.inputItem)}
                                type='password' />
                        </div>
                        {
                            action === 'cancel' ?
                                <div className={styles.wrapItem}>
                                    <label className={appStyles.required} htmlFor='cancellation_reason'>{language?.cancellationReason}</label>
                                    <input
                                        id='cancellation_reason'
                                        name='cancellation_reason'
                                        className={css(appStyles.input, styles.inputItem)}
                                        type='text' />
                                </div> : null
                        }
                    </div>
                    <div className={styles.actionItems}>
                        <button
                            type='button'
                            onClick={handleClosePopUp}
                            className={
                                css(
                                    appStyles.actionItemWhiteBorderRed,
                                    mutation.isPending ? styles.pending : ''
                                )
                            }>
                            {language?.langNo}
                        </button>
                        <button
                            className={
                                css(
                                    appStyles.actionItemWhite,
                                    mutation.isPending ? styles.pending : ''
                                )
                            }>
                            {language?.langYes}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
