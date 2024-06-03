export default function createFormUtils(styles: CSSModuleClasses) {
	return {
		getParentElement(element: HTMLInputElement | HTMLTextAreaElement) {
			let parent = element.parentElement as HTMLElement;
			while (!parent.classList.contains(styles['wrap-item']) && parent.nodeName !== 'FORM') {
				parent = parent.parentElement as HTMLElement;
			}
			if (parent.nodeName !== 'FORM') return parent;
			else return null;
		},
		showFormError(error: object) {
			if (typeof error === 'object')
				Object.keys(error).forEach(key => {
					const selector = `input[data-selector='${key}'],textarea[data-selector='${key}'],[name='${key}']`;
					const element = document.querySelector<HTMLInputElement | HTMLTextAreaElement>(selector);
					if (element) {
						element.classList.add('error');
						this.getParentElement(element)?.setAttribute('data-error', error[key as keyof typeof error][0] as string);
					}
				});
		},
		handleOnInput(e: React.FormEvent<HTMLFormElement>) {
			const element = e.target as HTMLInputElement;
			if (element) {
				element.classList.remove('error');
				this.getParentElement(element)?.removeAttribute('data-error');
			}
		}
	};
}
