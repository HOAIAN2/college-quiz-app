import { useMutation } from '@tanstack/react-query';
import { SyntheticEvent, useEffect, useState } from 'react';
import { FiSave } from 'react-icons/fi';
import { RxCross2 } from 'react-icons/rx';
import appStyles from '../App.module.css';
import { apiCreateChapter } from '../api/chapter';
import { TRANSITION_TIMING_FAST } from '../constants/css-timing';
import useLanguage from '../hooks/useLanguage';
import styles from '../styles/global/CreateModel.module.css';
import createFormUtils from '../utils/createFormUtils';
import css from '../utils/css';
import Loading from './Loading';

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
	const [hide, setHide] = useState(true);
	const handleClosePopUp = () => {
		setHide(true);
		setTimeout(() => {
			setShowPopUp(false);
		}, TRANSITION_TIMING_FAST);
	};
	const formUtils = createFormUtils(styles);
	const handleCreateChapter = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
		e.preventDefault();
		document.querySelector(`.${styles['form-data']}`)?.querySelectorAll<HTMLInputElement>('input[name]').forEach(node => {
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
		onError: (error: object) => { formUtils.showFormError(error); },
		onSuccess: onMutateSuccess
	});
	useEffect(() => {
		setHide(false);
	}, []);
	return (
		<div className={
			css(
				styles['create-model-container'],
				hide ? styles['hide'] : ''
			)
		}>
			{
				isPending ? <Loading /> : null
			}
			<div className={
				css(
					styles['create-model-form'],
					hide ? styles['hide'] : ''
				)
			}>
				<div className={styles['header']}>
					<h2 className={styles['title']}>{language?.create}</h2>
					<div className={styles['esc-button']}
						onClick={handleClosePopUp}
					>
						<RxCross2 />
					</div>
				</div>
				<div className={styles['form-content']}>
					<form onSubmit={(e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
						mutate(e);
					}}
						onInput={(e) => { formUtils.handleOnInput(e); }}
						className={styles['form-data']}>
						<div className={styles['group-inputs']}>
							<input readOnly hidden name='subject_id' value={subjectId} />
							<div className={styles['wrap-item']}>
								<label className={styles['required']} htmlFor='chapter_number'>{language?.chapterNumber}</label>
								<input
									id='chapter_number'
									name='chapter_number'
									defaultValue={defaultChapterNumber}
									className={css(appStyles['input-d'], styles['input-item'])}
									type='text' />
							</div>
							<div className={styles['wrap-item']}>
								<label className={styles['required']} htmlFor='name'>{language?.name}</label>
								<input
									id='name'
									name='name'
									className={css(appStyles['input-d'], styles['input-item'])}
									type='text' />
							</div>
						</div>
						<div className={styles['action-items']}>
							<button name='save'
								className={
									css(
										appStyles['action-item-d'],
										isPending ? appStyles['button-submitting'] : ''
									)
								}><FiSave />{language?.save}</button>
							<button name='save-more'
								className={
									css(
										appStyles['action-item-white-d'],
										isPending ? appStyles['button-submitting'] : ''
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
