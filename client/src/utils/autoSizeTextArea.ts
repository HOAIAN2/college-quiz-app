export function autoSizeTextArea(e: React.FormEvent<HTMLTextAreaElement>) {
	const textarea = e.currentTarget;
	const calcHeight = (value: string) => {
		const numberOfLineBreaks = (value.match(/\n/g) || []).length;
		// min-height + lines x line-height + padding + border
		const newHeight = 20 + numberOfLineBreaks * 20 + 40 + 1;
		return newHeight;
	};
	textarea.style.height = calcHeight(textarea.value) + 'px';
}
