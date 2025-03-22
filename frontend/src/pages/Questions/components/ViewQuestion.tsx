import appStyles from '~styles/App.module.css';
import globalStyles from '~styles/ViewModel.module.css';
import styles from '../styles/CreateQuestion.module.css';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SyntheticEvent, useEffect, useState } from 'react';
import { FaRegCircleCheck } from 'react-icons/fa6';
import { FiSave } from 'react-icons/fi';
import { MdDeleteOutline } from 'react-icons/md';
import { RiAddFill } from 'react-icons/ri';
import { RxCross2 } from 'react-icons/rx';
import { toast } from 'sonner';
import { apiDeleteQuestion, apiGetQuestionById, apiUpdateQuestion } from '~api/question';
import CustomSelect from '~components/CustomSelect';
import Loading from '~components/Loading';
import TextEditor from '~components/TextEditor';
import YesNoPopUp from '~components/YesNoPopUp';
import QUERY_KEYS from '~constants/query-keys';
import useAppContext from '~hooks/useAppContext';
import useLanguage from '~hooks/useLanguage';
import { SubjectDetail } from '~models/subject';
import createFormUtils from '~utils/create-form-utils';
import css from '~utils/css';

type ViewQuestionProps = {
    id: number;
    subjectDetail: SubjectDetail;
    onMutateSuccess: () => void;
    setShowPopUp: React.Dispatch<React.SetStateAction<boolean>>;
};

type Option = {
    key: string,
    content: string;
};

export default function ViewQuestion({
    id,
    subjectDetail,
    onMutateSuccess,
    setShowPopUp
}: ViewQuestionProps) {
    const { permissions } = useAppContext();
    const [options, setOptions] = useState<Option[]>([]);
    const [showDeletePopUp, setShowDeletePopUp] = useState(false);
    const [trueOptionKey, setTrueOptionKey] = useState<string>();
    const language = useLanguage('component.view_question');
    const queryClient = useQueryClient();
    const handleClosePopUp = () => {
        setShowPopUp(false);
    };
    const formUtils = createFormUtils(globalStyles);
    const disabledUpdate = !permissions.has('question_update');
    const queryData = useQuery({
        queryKey: [QUERY_KEYS.QUESTION_DETAIL, { id: id }],
        queryFn: () => apiGetQuestionById(id)
    });
    const handleUpdateQuestion = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
        e.preventDefault();
        document.querySelector(`.${globalStyles.formData}`)?.querySelectorAll<HTMLInputElement>('input[name]').forEach(node => {
            node.classList.remove('error');
            formUtils.getParentElement(node)?.removeAttribute('data-error');
        });
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        await apiUpdateQuestion(formData, id);
    };
    const { mutate, isPending } = useMutation({
        mutationFn: handleUpdateQuestion,
        onError: (error) => { formUtils.showFormError(error); },
        onSuccess: () => {
            queryData.refetch();
            onMutateSuccess();
        }
    });
    const handleDeleteQuestion = async () => {
        await apiDeleteQuestion(id);
    };
    useEffect(() => {
        return () => {
            queryClient.removeQueries({ queryKey: [QUERY_KEYS.QUESTION_DETAIL, { id: id }] });
        };
    }, [id, queryClient]);
    useEffect(() => {
        if (queryData.data) {
            const questionOptions = queryData.data.questionOptions.map(item => {
                return {
                    key: item.id.toString(),
                    content: item.content,
                    isCorrect: item.isCorrect
                };
            });
            setOptions(questionOptions.map(item => {
                return {
                    key: item.key,
                    content: item.content
                };
            }));
            setTrueOptionKey(questionOptions.find(item => item.isCorrect)?.key);
        }
    }, [queryData.data]);
    return (
        <>
            {showDeletePopUp === true ?
                <YesNoPopUp
                    message={language?.deleteMessage || ''}
                    mutateFunction={handleDeleteQuestion}
                    setShowPopUp={setShowDeletePopUp}
                    onMutateSuccess={() => { onMutateSuccess(); handleClosePopUp(); }}
                    langYes={language?.langYes}
                    langNo={language?.langNo}
                /> : null}
            <div
                className={
                    css(
                        globalStyles.viewModelContainer,
                    )
                }>
                {
                    isPending ? <Loading /> : null
                }
                <div
                    className={
                        css(
                            globalStyles.viewModelForm,
                        )
                    }>
                    <div className={globalStyles.header}>
                        <h2 className={globalStyles.title}>{language?.title}</h2>
                        <div className={globalStyles.escButton}
                            onClick={handleClosePopUp}
                        >
                            <RxCross2 />
                        </div>
                    </div>
                    <>
                        {
                            queryData.isLoading ? <Loading /> : null
                        }
                        <div className={globalStyles.formContent}>
                            {
                                queryData.data ? (
                                    <form onSubmit={(e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
                                        mutate(e);
                                    }}
                                        onInput={(e) => { formUtils.handleOnInput(e); }}
                                        className={globalStyles.formData}>
                                        <input name='true_option' readOnly hidden value={options.findIndex(option => option.key === trueOptionKey)} />
                                        <input name='subject_id' readOnly hidden value={subjectDetail.id} />
                                        <div className={globalStyles.groupInputs}>
                                            <div style={{ zIndex: 2 }} className={globalStyles.wrapItem}>
                                                <label htmlFor='chapter_id'>{language?.chapter}</label>
                                                <CustomSelect
                                                    name='chapter_id'
                                                    disabled={disabledUpdate}
                                                    defaultOption={(() => {
                                                        const chapter = subjectDetail.chapters.find(item => item.id == queryData.data.chapterId);
                                                        return {
                                                            label: chapter?.name || language?.unselect,
                                                            value: String(chapter?.id || '')
                                                        };
                                                    })()
                                                    }
                                                    options={
                                                        [
                                                            {
                                                                label: language?.unselect,
                                                                value: ''
                                                            },
                                                            ...subjectDetail.chapters.map(chapter => ({
                                                                value: String(chapter.id),
                                                                label: `${chapter.chapterNumber}. ${chapter.name}`
                                                            }))]
                                                    }
                                                    className={globalStyles.customSelect}
                                                />
                                            </div>
                                            <div className={globalStyles.wrapItem}>
                                                <label className={appStyles.required}>{language?.level}</label>
                                                <CustomSelect
                                                    name='level'
                                                    disabled={disabledUpdate}
                                                    defaultOption={
                                                        {
                                                            label: language?.questionLevel[queryData.data.level],
                                                            value: queryData.data.level
                                                        }
                                                    }
                                                    options={language ?
                                                        Object.keys(language.questionLevel).map(item => {
                                                            return {
                                                                value: item,
                                                                label: language.questionLevel[item as keyof typeof language.questionLevel]
                                                            };
                                                        }) : []
                                                    }
                                                    className={globalStyles.customSelect}
                                                />
                                            </div>
                                            <div className={css(globalStyles.wrapItem, globalStyles.textarea)}>
                                                <label className={appStyles.required} htmlFor='content'>{language?.content}</label>
                                                <TextEditor
                                                    key={queryData.data.content}
                                                    disabled={disabledUpdate}
                                                    name='content'
                                                    defaultContent={queryData.data.content}
                                                />
                                            </div>
                                            {
                                                permissions.has('question_update') ?
                                                    <div
                                                        className={appStyles.actionBar}>
                                                        {
                                                            <div
                                                                style={{ width: 'fit-content' }}
                                                                className={appStyles.actionItem}
                                                                onClick={() => {
                                                                    setOptions([
                                                                        ...options,
                                                                        {
                                                                            key: new Date().getTime().toString(),
                                                                            content: ''
                                                                        }
                                                                    ]);
                                                                }}
                                                            >
                                                                <RiAddFill /> {language?.addOption}
                                                            </div>
                                                        }
                                                    </div> : null
                                            }
                                        </div>
                                        <div className={globalStyles.groupInputs}>
                                            {options.map((option, index) => {
                                                return (
                                                    <div
                                                        key={option.key}
                                                        className={css(styles.textareaGroup, globalStyles.wrapItem, globalStyles.textarea)}>
                                                        <div className={styles.wrapLabel}>
                                                            <label style={{ cursor: 'pointer' }}
                                                                className={appStyles.required}
                                                                onClick={() => {
                                                                    setTrueOptionKey(String(option.key));
                                                                }}
                                                            >{`${language?.answer} ${index + 1}`}</label>
                                                            {
                                                                option.key === trueOptionKey ?
                                                                    <FaRegCircleCheck />
                                                                    : null
                                                            }
                                                        </div>
                                                        <TextEditor
                                                            key={option.content}
                                                            disabled={disabledUpdate}
                                                            name='options[]'
                                                            defaultContent={option.content}
                                                        />
                                                        {
                                                            permissions.has('question_update') ?
                                                                <div
                                                                    onClick={() => {
                                                                        if (options.length == 2) {
                                                                            toast.error(language?.deleteOptionError);
                                                                        }
                                                                        else setOptions(options.filter(item => item.key !== option.key));
                                                                    }}
                                                                    className={appStyles.actionItemWhiteBorderRed}
                                                                >
                                                                    <MdDeleteOutline /> {language?.delete}
                                                                </div> : null
                                                        }
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        {
                                            permissions.hasAnyFormList(['question_update', 'question_delete']) ?
                                                <div className={globalStyles.actionItems}>
                                                    {
                                                        permissions.has('question_update') ?
                                                            <button name='save'
                                                                className={
                                                                    css(
                                                                        appStyles.actionItem,
                                                                        isPending ? 'button-submitting' : ''
                                                                    )
                                                                }><FiSave />{language?.save}</button>
                                                            : null
                                                    }
                                                    {
                                                        permissions.has('question_delete') ?
                                                            <button
                                                                type='button'
                                                                onClick={() => {
                                                                    setShowDeletePopUp(true);
                                                                }}
                                                                className={appStyles.actionItemWhiteBorderRed}
                                                            >
                                                                <MdDeleteOutline /> {language?.delete}
                                                            </button>
                                                            : null
                                                    }
                                                </div> : null
                                        }
                                    </form>
                                ) : null
                            }
                        </div>
                    </>
                </div>
            </div>
        </>
    );
}
