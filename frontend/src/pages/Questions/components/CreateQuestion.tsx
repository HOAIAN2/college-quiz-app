import appStyles from '~styles/App.module.css';
import globalStyles from '~styles/CreateModel.module.css';
import styles from '../styles/CreateQuestion.module.css';

import { useMutation } from '@tanstack/react-query';
import { SyntheticEvent, useEffect, useState } from 'react';
import { FaRegCircleCheck } from 'react-icons/fa6';
import { FiSave } from 'react-icons/fi';
import { MdDeleteOutline } from 'react-icons/md';
import { RiAddFill } from 'react-icons/ri';
import { RxCross2 } from 'react-icons/rx';
import { toast } from 'sonner';
import { apiCreateQuestion } from '~api/question';
import CustomSelect from '~components/CustomSelect';
import Loading from '~components/Loading';
import CSS_TIMING from '~constants/css-timing';
import useLanguage from '~hooks/useLanguage';
import { SubjectDetail } from '~models/subject';
import { autoSizeTextArea } from '~utils/autoSizeTextArea';
import createFormUtils from '~utils/createFormUtils';
import css from '~utils/css';

type CreateQuestionProps = {
	subjectDetail: SubjectDetail;
	onMutateSuccess: () => void;
	setShowPopUp: React.Dispatch<React.SetStateAction<boolean>>;
};

type Option = {
	key: string,
	content: string;
};

export default function CreateQuestion({
	subjectDetail,
	onMutateSuccess,
	setShowPopUp
}: CreateQuestionProps) {
	const [hide, setHide] = useState(true);
	const [options, setOptions] = useState<Option[]>(new Array(2).fill(null).map((_, index) => {
		return { key: index.toString(), content: '' };
	}));
	const [trueOptionKey, setTrueOptionKey] = useState<string>();
	const language = useLanguage('component.create_question');
	const handleClosePopUp = () => {
		setHide(true);
		setTimeout(() => {
			setShowPopUp(false);
		}, CSS_TIMING.TRANSITION_TIMING_FAST);
	};
	const formUtils = createFormUtils(globalStyles);
	const handleCreateQuestion = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
		e.preventDefault();
		document.querySelector(globalStyles.formData)?.querySelectorAll<HTMLInputElement>('input[name]').forEach(node => {
			node.classList.remove('error');
			formUtils.getParentElement(node)?.removeAttribute('data-error');
		});
		const submitter = e.nativeEvent.submitter as HTMLButtonElement;
		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		await apiCreateQuestion(formData);
		if (submitter.name === 'save') handleClosePopUp();
		else form.reset();
	};
	const { mutate, isPending } = useMutation({
		mutationFn: handleCreateQuestion,
		onError: (error) => { formUtils.showFormError(error); },
		onSuccess: onMutateSuccess
	});
	useEffect(() => {
		setHide(false);
	}, []);
	return (
		<div className={
			css(
				globalStyles.createModelContainer,
				hide ? globalStyles.hide : ''
			)
		}>
			{
				isPending ? <Loading /> : null
			}
			<div className={
				css(
					globalStyles.createModelForm,
					hide ? globalStyles.hide : ''
				)
			}>
				<div className={globalStyles.header}>
					<h2 className={globalStyles.title}>{language?.create}</h2>
					<div className={globalStyles.escButton}
						onClick={handleClosePopUp}
					>
						<RxCross2 />
					</div>
				</div>
				<div className={globalStyles.formContent}>
					<form onSubmit={(e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
						mutate(e);
					}}
						onInput={(e) => { formUtils.handleOnInput(e); }}
						className={globalStyles.formData}>
						<input name='true_option' readOnly hidden value={options.findIndex(option => option.key === trueOptionKey)} />
						<input name='subject_id' readOnly hidden value={subjectDetail.id} />
						<div className={globalStyles.groupInputs}>
							<div style={{ zIndex: 2 }} className={globalStyles.wrapItem}>
								<label>{language?.chapter}</label>
								<CustomSelect
									name='chapter_id'
									defaultOption={
										{
											label: language?.unselect,
											value: ''
										}
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
									defaultOption={
										{
											label: language?.questionLevel.easy,
											value: 'easy'
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
								<textarea
									onChange={autoSizeTextArea}
									name='content' id='content'
									className={css(appStyles.input, globalStyles.inputItem)}
								>
								</textarea>
							</div>
							<div
								style={{ paddingLeft: '20px' }}
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
							</div>
							{options.map((option, index) => {
								return (
									<div
										key={option.key}
										className={css(styles.textareaGroup, globalStyles.wrapItem, globalStyles.textarea)}>
										<div className={styles.wrapLabel}>
											<label
												style={{ cursor: 'pointer' }}
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
										<textarea
											data-selector={`options.${index}`}
											onInput={autoSizeTextArea}
											name='options[]'
											className={css(appStyles.input, globalStyles.inputItem, styles.textarea)}
										>
										</textarea>
										<div
											onClick={() => {
												if (options.length == 2) {
													toast.error(language?.deleteOptionError);
												}
												else setOptions(options.filter(item => item.key !== option.key));
											}}
											className={appStyles.actionItemWhiteBorderRed}>
											<MdDeleteOutline /> {language?.delete}
										</div>
									</div>
								);
							})}
						</div>
						<div className={globalStyles.actionItems}>
							<button name='save'
								className={
									css(
										appStyles.actionItem,
										isPending ? appStyles.buttonSubmitting : ''
									)
								}><FiSave />
								{language?.save}
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
