import appStyles from '~styles/App.module.css';
import styles from '../styles/ImportQuestions.module.css';

import { useMutation } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { FaRegFileWord } from 'react-icons/fa';
import {
    IoMdAddCircleOutline,
} from 'react-icons/io';
import { RxCross2 } from 'react-icons/rx';
import { apiImportQuestions } from '~api/question';
import CustomSelect from '~components/CustomSelect';
import Loading from '~components/Loading';
import useLanguage from '~hooks/useLanguage';
import { Option } from '~models/option';
import css from '~utils/css';
import { importTemplateFileUrl } from '~utils/template';

type ImportQuestionsProps = {
    onMutateSuccess: () => void;
    setShowPopUp: React.Dispatch<React.SetStateAction<boolean>>;
    subjectId: string | number;
    chapterOptions: Option[];
};
function ImportQuestions({
    onMutateSuccess,
    setShowPopUp,
    subjectId,
    chapterOptions,
}: ImportQuestionsProps) {
    const language = useLanguage('component.import_questions');
    const [file, setFile] = useState<File>();
    const inputFileRef = useRef<HTMLInputElement>(null);
    const handleClosePopUp = () => {
        setShowPopUp(false);
    };
    const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.currentTarget.files;
        if (!files) return setFile(undefined);
        const file = files[0];
        if (file) setFile(file);
        else setFile(undefined);
    };
    const handleOnDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        const currentTarget = e.currentTarget;
        currentTarget.classList.remove(styles.drag);
        const files = e.dataTransfer.files;
        if (inputFileRef.current) inputFileRef.current.files = files;
        const file = files[0];
        if (file) setFile(file);
        else setFile(undefined);
    };
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) return;
        const formData = new FormData(e.target as HTMLFormElement);
        await apiImportQuestions(formData);
        handleClosePopUp();
    };
    const mutation = useMutation({
        mutationFn: handleSubmit,
        onSuccess: onMutateSuccess
    });
    return (
        <div
            className={
                css(
                    styles.importQuestionsContainer,
                )
            }>
            {mutation.isPending ?
                <Loading /> : null}
            <div
                className={
                    css(
                        styles.importQuestionsForm,
                    )
                }>
                <div className={styles.header}>
                    <h2 className={styles.title}>{language?.title}</h2>
                    <div className={styles.escButton}
                        onClick={handleClosePopUp}
                    >
                        <RxCross2 />
                    </div>
                </div>
                <form onSubmit={e => { mutation.mutate(e); }} className={styles.formData}>
                    <input name='subject_id' value={subjectId} hidden readOnly />
                    <div className={styles.groupInputs}>
                        <div style={{ zIndex: 1 }} className={styles.wrapItem}>
                            <label className={appStyles.required} htmlFor=''>{language?.chapter}</label>
                            <CustomSelect
                                name='chapter_id'
                                defaultOption={chapterOptions[0]}
                                options={chapterOptions}
                            />
                        </div>
                    </div>
                    <div className={styles.dragArea}>
                        <label htmlFor='file'
                            onDragOver={(e) => {
                                e.preventDefault();
                                e.currentTarget.classList.add(styles.drag);
                            }}
                            onDragLeave={(e) => {
                                e.preventDefault();
                                e.currentTarget.classList.remove(styles.drag);
                            }}
                            onDrop={handleOnDrop}
                            className={styles.dragAreaDashed}>
                            <div className={styles.dragAreaContent}>
                                {
                                    file ?
                                        <div
                                            className={
                                                css(
                                                    styles.fileName,
                                                    styles.haveFile
                                                )
                                            }
                                            title={file.name}>
                                            <FaRegFileWord />
                                            <p>
                                                {file.name}
                                            </p>
                                        </div>
                                        :
                                        <div className={styles.fileName}>
                                            <IoMdAddCircleOutline />
                                        </div>
                                }
                            </div>
                            <input
                                ref={inputFileRef}
                                id='file'
                                onChange={handleChangeFile}
                                accept='application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                                type='file' name='file'
                                hidden
                            />
                        </label>
                    </div>
                    <div className={styles.actionItems}>
                        <button
                            name='save'
                            className={
                                css(
                                    appStyles.actionItem,
                                    mutation.isPending ? styles.pending : ''
                                )
                            }>{language?.save}
                        </button>
                        <a
                            className={appStyles.actionItemWhite}
                            href={importTemplateFileUrl.questions}
                            download=''>{language?.downloadTemplate}</a>
                    </div>
                </form>
            </div >
        </div >
    );
}

export default ImportQuestions;