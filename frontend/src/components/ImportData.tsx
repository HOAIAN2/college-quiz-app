import appStyles from '~styles/App.module.css';
import styles from './styles/ImportData.module.css';

import { useMutation } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import {
    IoMdAddCircleOutline,
} from 'react-icons/io';
import { RxCross2 } from 'react-icons/rx';
import useLanguage from '~hooks/useLanguage';
import css from '~utils/css';
import Loading from './Loading';

type ImportDataProps = {
    title?: string;
    teamplateUrl: string;
    icon: React.ReactNode;
    importFunction: (file: File) => Promise<void>;
    onMutateSuccess: () => void;
    setShowPopUp: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function ImportData({
    title,
    teamplateUrl,
    icon,
    importFunction,
    onMutateSuccess,
    setShowPopUp,
}: ImportDataProps) {
    const language = useLanguage('component.import_data');
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
    const handleUploadFile = async () => {
        if (!file) return;
        await importFunction(file);
    };
    const mutation = useMutation({
        mutationFn: handleUploadFile,
        onSuccess: onMutateSuccess
    });
    return (
        <div
            className={
                css(
                    styles.importDataContainer,
                )
            }>
            {mutation.isPending ?
                <Loading /> : null}
            <div
                className={
                    css(
                        styles.importDataForm,
                    )
                }>
                <div className={styles.header}>
                    <h2 className={styles.title}>{title}</h2>
                    <div className={styles.escButton}
                        onClick={handleClosePopUp}
                    >
                        <RxCross2 />
                    </div>
                </div>
                <div className={styles.formData}>
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
                                            {icon}
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
                                accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                                type='file' name='file'
                                hidden
                            />
                        </label>
                    </div>
                    <div className={styles.actionItems}>
                        <button
                            onClick={() => { mutation.mutate(); }}
                            name='save' className={
                                css(
                                    appStyles.actionItem,
                                    mutation.isPending ? styles.pending : ''
                                )
                            }>{language?.save}
                        </button>
                        <a
                            className={appStyles.actionItemWhite}
                            href={teamplateUrl}
                            download=''>{language?.downloadTemplate}</a>
                    </div>
                </div>
            </div >
        </div >
    );
}
