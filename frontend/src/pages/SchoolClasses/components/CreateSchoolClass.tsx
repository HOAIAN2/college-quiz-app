import appStyles from '~styles/App.module.css';
import styles from '~styles/CreateModel.module.css';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SyntheticEvent, useEffect, useState } from 'react';
import { FiSave } from 'react-icons/fi';
import { RxCross2 } from 'react-icons/rx';
import { apiAutoCompleteFaculty } from '~api/faculty';
import { apiCreateSchoolClass } from '~api/school-class';
import CustomDataList from '~components/CustomDataList';
import Loading from '~components/Loading';
import { AUTO_COMPLETE_DEBOUNCE } from '~config/env';
import QUERY_KEYS from '~constants/query-keys';
import useDebounce from '~hooks/useDebounce';
import useLanguage from '~hooks/useLanguage';
import createFormUtils from '~utils/create-form-utils';
import css from '~utils/css';

type CreateSchoolClassProps = {
    onMutateSuccess: () => void;
    setShowPopUp: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function CreateSchoolClass({
    onMutateSuccess,
    setShowPopUp
}: CreateSchoolClassProps) {
    const [resetIndex, setResetIndex] = useState(0);
    const language = useLanguage('component.create_school_class');
    const [queryFaculty, setQueryFaculty] = useState('');
    const debounceQueryFaculty = useDebounce(queryFaculty, AUTO_COMPLETE_DEBOUNCE);
    const queryClient = useQueryClient();
    const handleClosePopUp = () => {
        setShowPopUp(false);
    };
    const formUtils = createFormUtils(styles);
    const facultyQueryData = useQuery({
        queryKey: [QUERY_KEYS.AUTO_COMPLETE_FACULTY, { search: debounceQueryFaculty }],
        queryFn: () => apiAutoCompleteFaculty(debounceQueryFaculty),
        enabled: debounceQueryFaculty ? true : false
    });
    const handleCreateFaculty = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
        e.preventDefault();
        document.querySelector(`.${styles.formData}`)?.querySelectorAll<HTMLInputElement>('input[name]').forEach(node => {
            node.classList.remove('error');
            formUtils.getParentElement(node)?.removeAttribute('data-error');
        });
        const submitter = e.nativeEvent.submitter as HTMLButtonElement;
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        await apiCreateSchoolClass(formData);
        if (submitter.name === 'save') handleClosePopUp();
        else {
            // form.reset() not work because TextEditor not an input element
            setResetIndex(pre => pre + 1);
        }
    };
    const { mutate, isPending } = useMutation({
        mutationFn: handleCreateFaculty,
        onError: (error) => { formUtils.showFormError(error); },
        onSuccess: onMutateSuccess
    });
    useEffect(() => {
        return () => {
            queryClient.removeQueries({ queryKey: [QUERY_KEYS.AUTO_COMPLETE_FACULTY] });
        };
    }, [queryClient]);
    return (
        <div key={resetIndex} className={
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
                            <div className={styles.wrapItem}>
                                <label className={appStyles.required} htmlFor='shortcode'>{language?.shortcode}</label>
                                <input
                                    id='shortcode'
                                    name='shortcode'
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
                            <div className={styles.wrapItem}>
                                <label className={appStyles.required} htmlFor='faculty_id'>{language?.faculty}</label>
                                <CustomDataList
                                    name='faculty_id'
                                    onInput={e => { setQueryFaculty(e.currentTarget.value); }}
                                    options={facultyQueryData.data ? facultyQueryData.data.map(item => {
                                        return {
                                            label: item.name,
                                            value: String(item.id)
                                        };
                                    }) : []}
                                />
                            </div>
                        </div>
                        <div className={styles.actionItems}>
                            <button name='save'
                                className={
                                    css(
                                        appStyles.actionItem,
                                        isPending ? appStyles.buttonSubmitting : ''
                                    )}>
                                <FiSave />{language?.save}
                            </button>
                            <button name='save-more'
                                className={
                                    css(
                                        appStyles.actionItemWhite,
                                        isPending ? appStyles.buttonSubmitting : ''
                                    )
                                }>
                                <FiSave />{language?.saveMore}
                            </button>
                        </div>
                    </form>
                </div>
            </div >
        </div >
    );
}
