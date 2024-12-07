import appStyles from '~styles/App.module.css';
import styles from '~styles/CreateModel.module.css';

import { useMutation } from '@tanstack/react-query';
import { SyntheticEvent } from 'react';
import { FiSave } from 'react-icons/fi';
import { RxCross2 } from 'react-icons/rx';
import { apiCreateChapter } from '~api/chapter';
import Loading from '~components/Loading';
import useLanguage from '~hooks/useLanguage';
import createFormUtils from '~utils/createFormUtils';
import css from '~utils/css';

type CreateChapterProps = {
    defaultChapterNumber?: number;
    subjectId: number | string;
    onMutateSuccess: () => void;
    setShowPopUp: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function CreateChapter({
    defaultChapterNumber,
    subjectId,
    onMutateSuccess,
    setShowPopUp
}: CreateChapterProps) {
    const language = useLanguage('component.create_chapter');
    const handleClosePopUp = () => {
        setShowPopUp(false);
    };
    const formUtils = createFormUtils(styles);
    const handleCreateChapter = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
        e.preventDefault();
        document.querySelector(`.${styles.formData}`)?.querySelectorAll<HTMLInputElement>('input[name]').forEach(node => {
            node.classList.remove('error');
            formUtils.getParentElement(node)?.removeAttribute('data-error');
        });
        const submitter = e.nativeEvent.submitter as HTMLButtonElement;
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        await apiCreateChapter(formData);
        if (submitter.name === 'save') handleClosePopUp();
        else form.reset();
    };
    const { mutate, isPending } = useMutation({
        mutationFn: handleCreateChapter,
        onError: (error) => { formUtils.showFormError(error); },
        onSuccess: onMutateSuccess
    });
    return (
        <div className={
            css(
                styles.createModelContainer,
            )
        }>
            {
                isPending ? <Loading /> : null
            }
            <div className={
                css(
                    styles.createModelForm,
                )
            }>
                <div className={styles.header}>
                    <h2 className={styles.title}>{language?.create}</h2>
                    <div className={styles.escButton}
                        onClick={handleClosePopUp}
                    >
                        <RxCross2 />
                    </div>
                </div>
                <div className={styles.formContent}>
                    <form onSubmit={(e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
                        mutate(e);
                    }}
                        onInput={(e) => { formUtils.handleOnInput(e); }}
                        className={styles.formData}>
                        <div className={styles.groupInputs}>
                            <input readOnly hidden name='subject_id' value={subjectId} />
                            <div className={styles.wrapItem}>
                                <label className={appStyles.required} htmlFor='chapter_number'>{language?.chapterNumber}</label>
                                <input
                                    id='chapter_number'
                                    name='chapter_number'
                                    defaultValue={defaultChapterNumber}
                                    className={css(appStyles.input, styles.inputItem)}
                                    type='text' />
                            </div>
                            <div className={styles.wrapItem}>
                                <label className={appStyles.required} htmlFor='name'>{language?.name}</label>
                                <input
                                    id='name'
                                    name='name'
                                    className={css(appStyles.input, styles.inputItem)}
                                    type='text' />
                            </div>
                        </div>
                        <div className={styles.actionItems}>
                            <button name='save'
                                className={
                                    css(
                                        appStyles.actionItem,
                                        isPending ? appStyles.buttonSubmitting : ''
                                    )
                                }><FiSave />{language?.save}</button>
                            <button name='save-more'
                                className={
                                    css(
                                        appStyles.actionItemWhite,
                                        isPending ? appStyles.buttonSubmitting : ''
                                    )
                                }
                            ><FiSave />{language?.saveMore}</button>
                        </div>
                    </form>
                </div>
            </div >
        </div >
    );
}
