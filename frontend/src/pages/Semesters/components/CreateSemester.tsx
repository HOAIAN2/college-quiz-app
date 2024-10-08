import appStyles from '~styles/App.module.css';
import styles from '~styles/CreateModel.module.css';

import { useMutation } from '@tanstack/react-query';
import { SyntheticEvent, useEffect, useState } from 'react';
import { FiSave } from 'react-icons/fi';
import { RxCross2 } from 'react-icons/rx';
import { apiCreateSemester } from '~api/semester';
import DatePicker from '~components/DatePicker';
import Loading from '~components/Loading';
import CSS_TIMING from '~constants/css-timing';
import useLanguage from '~hooks/useLanguage';
import createFormUtils from '~utils/createFormUtils';
import css from '~utils/css';

type CreateSemesterProps = {
    onMutateSuccess: () => void;
    setShowPopUp: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function CreateSemester({
    onMutateSuccess,
    setShowPopUp
}: CreateSemesterProps) {
    const [hide, setHide] = useState(true);
    const language = useLanguage('component.create_semester');
    const handleClosePopUp = () => {
        setHide(true);
        setTimeout(() => {
            setShowPopUp(false);
        }, CSS_TIMING.TRANSITION_TIMING_FAST);
    };
    const formUtils = createFormUtils(styles);
    const handleCreateFaculty = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
        e.preventDefault();
        document.querySelector(`.${styles.formData}`)?.querySelectorAll<HTMLInputElement>('input[name]').forEach(node => {
            node.classList.remove('error');
            formUtils.getParentElement(node)?.removeAttribute('data-error');
        });
        const submitter = e.nativeEvent.submitter as HTMLButtonElement;
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        await apiCreateSemester(formData);
        if (submitter.name === 'save') handleClosePopUp();
        else form.reset();
    };
    const { mutate, isPending } = useMutation({
        mutationFn: handleCreateFaculty,
        onError: (error) => { formUtils.showFormError(error); },
        onSuccess: onMutateSuccess
    });
    useEffect(() => {
        setHide(false);
    }, []);
    return (
        <div className={
            css(
                styles.createModelContainer,
                hide ? styles.hide : ''
            )
        }>
            {
                isPending ? <Loading /> : null
            }
            <div className={
                css(
                    styles.createModelForm,
                    hide ? styles.hide : ''
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
                            <div className={styles.wrapItem}>
                                <label className={appStyles.required} htmlFor='name'>{language?.name}</label>
                                <input
                                    id='name'
                                    name='name'
                                    className={css(appStyles.input, styles.inputItem)}
                                    type='text' />
                            </div>
                            <div className={styles.wrapItem}>
                                <label className={appStyles.required} htmlFor='start_date'>{language?.startDate}</label>
                                <DatePicker
                                    initialValue={new Date()}
                                    inputProps={
                                        {
                                            id: 'start_date',
                                            name: 'start_date',
                                            className: css(appStyles.input, styles.inputItem)
                                        }
                                    }
                                    closeOnSelect={true}
                                    timeFormat={false}
                                />
                            </div>
                            <div className={styles.wrapItem}>
                                <label className={appStyles.required} htmlFor='end_date'>{language?.endDate}</label>
                                <DatePicker
                                    initialValue={new Date()}
                                    inputProps={
                                        {
                                            id: 'end_date',
                                            name: 'end_date',
                                            className: css(appStyles.input, styles.inputItem)
                                        }
                                    }
                                    closeOnSelect={true}
                                    timeFormat={false}
                                />
                            </div>
                        </div>
                        <div className={styles.actionItems}>
                            <button name='save'
                                className={
                                    css(
                                        appStyles.actionItem,
                                        isPending ? 'button-submitting' : ''
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
