import { useMutation } from '@tanstack/react-query';
import { SyntheticEvent, useEffect, useState } from 'react';
import { FaRegCircleCheck } from 'react-icons/fa6';
import { FiSave } from 'react-icons/fi';
import { MdDeleteOutline } from 'react-icons/md';
import { RiAddFill } from 'react-icons/ri';
import { RxCross2 } from 'react-icons/rx';
import { toast } from 'sonner';
import appStyles from '../App.module.css';
import { apiCreateQuestion } from '../api/question';
import { TRANSITION_TIMING_FAST } from '../constants/css-timing';
import useLanguage from '../hooks/useLanguage';
import { SubjectDetail } from '../models/subject';
import styles from '../styles/CreateQuestion.module.css';
import globalStyles from '../styles/global/CreateModel.module.css';
import { autoSizeTextArea } from '../utils/autoSizeTextArea';
import createFormUtils from '../utils/createFormUtils';
import css from '../utils/css';
import CustomSelect from './CustomSelect';
import Loading from './Loading';

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
		}, TRANSITION_TIMING_FAST);
	};
	const formUtils = createFormUtils(globalStyles);
	const handleCreateQuestion = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
		e.preventDefault();
		document.querySelector(globalStyles['form-data'])?.querySelectorAll<HTMLInputElement>('input[name]').forEach(node => {
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
		onError: (error: object) => { formUtils.showFormError(error); },
		onSuccess: onMutateSuccess
	});
	useEffect(() => {
		setHide(false);
	}, []);
	return (
		<div className={
			css(
				globalStyles['create-model-container'],
				hide ? globalStyles['hide'] : ''
			)
		}>
			{
				isPending ? <Loading /> : null
			}
			<div className={
				css(
					globalStyles['create-model-form'],
					hide ? globalStyles['hide'] : ''
				)
			}>
				<div className={globalStyles['header']}>
					<h2 className={globalStyles['title']}>{language?.create}</h2>
					<div className={globalStyles['esc-button']}
						onClick={handleClosePopUp}
					>
						<RxCross2 />
					</div>
				</div>
				<div className={globalStyles['form-content']}>
					<form onSubmit={(e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
						mutate(e);
					}}
						onInput={(e) => { formUtils.handleOnInput(e); }}
						className={globalStyles['form-data']}>
						<input name='true_option' readOnly hidden value={options.findIndex(option => option.key === trueOptionKey)} />
						<input name='subject_id' readOnly hidden value={subjectDetail.id} />
						<div className={globalStyles['group-inputs']}>
							<div style={{ zIndex: 2 }} className={globalStyles['wrap-item']}>
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
									className={globalStyles['custom-select']}
								/>
							</div>
							<div className={globalStyles['wrap-item']}>
								<label className={globalStyles['required']}>{language?.level}</label>
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
									className={globalStyles['custom-select']}
								/>
							</div>
							<div className={css(globalStyles['wrap-item'], globalStyles['textarea'])}>
								<label className={globalStyles['required']} htmlFor='content'>{language?.content}</label>
								<textarea
									onInput={autoSizeTextArea}
									name='content' id='content'
									className={css(appStyles['input-d'], globalStyles['input-item'])}
									cols={30} rows={50}>
								</textarea>
							</div>
							<div
								style={{ paddingLeft: '20px' }}
								className={appStyles['action-bar-d']}>
								{
									<div
										style={{ width: 'fit-content' }}
										className={appStyles['action-item-d']}
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
										className={css(styles['textarea-group'], globalStyles['wrap-item'], globalStyles['textarea'])}>
										<div className={styles['wrap-label']}>
											<label
												style={{ cursor: 'pointer' }}
												className={globalStyles['required']}
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
											className={css(appStyles['input-d'], globalStyles['input-item'], styles['textarea'])}
											cols={30} rows={50}>
										</textarea>
										<div
											onClick={() => {
												if (options.length == 2) {
													toast.error(language?.deleteOptionError);
												}
												else setOptions(options.filter(item => item.key !== option.key));
											}}
											className={appStyles['action-item-white-border-red-d']}>
											<MdDeleteOutline /> {language?.delete}
										</div>
									</div>
								);
							})}
						</div>
						<div className={globalStyles['action-items']}>
							<button name='save'
								className={
									css(
										appStyles['action-item-d'],
										isPending ? appStyles['button-submitting'] : ''
									)
								}><FiSave />
								{language?.save}
							</button>
							<button name='save-more'
								className={
									css(
										appStyles['action-item-white-d'],
										isPending ? appStyles['button-submitting'] : ''
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
