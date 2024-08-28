import appStyles from '~styles/App.module.css';
import styles from '~styles/ViewModel.module.css';

import { useMutation } from '@tanstack/react-query';
import { SyntheticEvent, useEffect, useState } from 'react';
import { FiSave } from 'react-icons/fi';
import { MdDeleteOutline } from 'react-icons/md';
import { RxCross2 } from 'react-icons/rx';
import { apiDeleteChapter, apiUpdateChapter } from '~api/chapter';
import Loading from '~components/Loading';
import YesNoPopUp from '~components/YesNoPopUp';
import CSS_TIMING from '~constants/css-timing';
import useAppContext from '~hooks/useAppContext';
import useLanguage from '~hooks/useLanguage';
import { Chapter } from '~models/chapter';
import createFormUtils from '~utils/createFormUtils';
import css from '~utils/css';

type ViewChapterProps = {
	data: Chapter;
	onMutateSuccess: () => void;
	setShowPopUp: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ViewChapter({
	data,
	onMutateSuccess,
	setShowPopUp
}: ViewChapterProps) {
	const [hide, setHide] = useState(true);
	const [showDeletePopUp, setShowDeletePopUp] = useState(false);
	const language = useLanguage('component.view_chapter');
	const { permissions } = useAppContext();
	const handleClosePopUp = () => {
		setHide(true);
		setTimeout(() => {
			setShowPopUp(false);
		}, CSS_TIMING.TRANSITION_TIMING_FAST);
	};
	const formUtils = createFormUtils(styles);
	const disabledUpdate = !permissions.has('subject_update');
	const handleUpdateChapter = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
		e.preventDefault();
		document.querySelector(`.${styles.formData}`)?.querySelectorAll<HTMLInputElement>('input[name]').forEach(node => {
			node.classList.remove('error');
			formUtils.getParentElement(node)?.removeAttribute('data-error');
		});
		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		await apiUpdateChapter(formData, data.id);
	};
	const handleDeleteChapter = async () => {
		await apiDeleteChapter(data.id);
	};
	const { mutate, isPending } = useMutation({
		mutationFn: handleUpdateChapter,
		onError: (error) => { formUtils.showFormError(error); },
		onSuccess: onMutateSuccess
	});
	useEffect(() => {
		setHide(false);
	}, []);
	return (
		<>
			{showDeletePopUp === true ?
				<YesNoPopUp
					message={language?.deleteMessage || ''}
					mutateFunction={handleDeleteChapter}
					setShowPopUp={setShowDeletePopUp}
					onMutateSuccess={() => { onMutateSuccess(); handleClosePopUp(); }}
					langYes={language?.langYes}
					langNo={language?.langNo}
				/> : null}
			<div
				className={
					css(
						styles.viewModelContainer,
						hide ? styles.hide : ''
					)
				}>
				{
					isPending ? <Loading /> : null
				}
				<div
					className={
						css(
							styles.viewModelForm,
							hide ? styles.hide : ''
						)
					}>
					<div className={styles.header}>
						<h2 className={styles.title}>{data.name}</h2>
						<div className={styles.escButton}
							onClick={handleClosePopUp}
						>
							<RxCross2 />
						</div>
					</div>
					<>
						<div className={styles.formContent}>
							<form onSubmit={(e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
								mutate(e);
							}}
								onInput={(e) => { formUtils.handleOnInput(e); }}
								className={styles.formData}>
								<div className={styles.groupInputs}>
									<div className={styles.wrapItem}>
										<label className={appStyles.required} htmlFor='chapter_number'>{language?.chapterNumber}</label>
										<input
											id='chapter_number'
											name='chapter_number'
											disabled={disabledUpdate}
											defaultValue={data.chapterNumber}
											className={css(appStyles.input, styles.inputItem)}
											type='text' />
									</div>
									<div className={styles.wrapItem}>
										<label className={appStyles.required} htmlFor='name'>{language?.name}</label>
										<input
											id='name'
											disabled={disabledUpdate}
											defaultValue={data.name}
											name='name'
											className={css(appStyles.input, styles.inputItem)}
											type='text' />
									</div>
								</div>
								{
									permissions.has('subject_update') ?
										<div className={styles.actionItems}>
											<button name='save'
												className={
													css(
														appStyles.actionItem,
														isPending ? 'button-submitting' : ''
													)
												}
											><FiSave />{language?.save}
											</button>
											<button
												type='button'
												onClick={() => {
													setShowDeletePopUp(true);
												}}
												className={appStyles.actionItemWhiteBorderRed}>
												<MdDeleteOutline /> {language?.delete}
											</button>
										</div>
										: null
								}
							</form>
						</div>
					</>
				</div>
			</div>
		</>
	);
}
