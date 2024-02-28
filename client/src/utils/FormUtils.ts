export default class FormUtils {
	styles: CSSModuleClasses
	constructor(styles: CSSModuleClasses) {
		this.styles = styles
	}
	getParentElement(element: HTMLInputElement) {
		let parent = element.parentElement as HTMLElement
		while (!parent.classList.contains(this.styles['wrap-item'])) parent = parent.parentElement as HTMLElement
		return parent
	}
	showFormError(error: object) {
		if (typeof error === 'object') {
			for (const key in error) {
				const element = document.querySelector<HTMLInputElement>(`input[data-selector='${key}'],[name='${key}']`)
				if (element) {
					element.classList.add('error')
					this.getParentElement(element).setAttribute('data-error', error[key as keyof typeof error][0] as string)
				}
			}
		}
	}
	handleOnInput(e: React.FormEvent<HTMLFormElement>) {
		const element = e.target as HTMLInputElement
		if (element) {
			element.classList.remove('error')
			this.getParentElement(element).removeAttribute('data-error')
		}
	}
}
