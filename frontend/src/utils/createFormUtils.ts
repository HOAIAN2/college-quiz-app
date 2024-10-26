export default function createFormUtils(styles: CSSModuleClasses) {
    return {
        getParentElement(element: HTMLInputElement | HTMLTextAreaElement) {
            let parent = element.parentElement as HTMLElement;
            while (!parent.classList.contains(styles.wrapItem) && parent.nodeName !== 'FORM') {
                parent = parent.parentElement as HTMLElement;
            }
            if (parent.nodeName !== 'FORM') return parent;
            else return null;
        },
        showFormError(error: object) {
            if (typeof error !== 'object') return;
            Object.entries(error).forEach(([key, messages]) => {
                const message = messages[0];
                const [baseKey, indexStr] = key.split('.');

                const selector = indexStr ? `[name='${baseKey}[]']` : `[name='${baseKey}']`;
                const element = indexStr
                    ? document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(selector)[Number(indexStr)]
                    : document.querySelector<HTMLInputElement | HTMLTextAreaElement>(selector);

                if (element) {
                    element.classList.add('error');
                    this.getParentElement(element)?.setAttribute('data-error', message);
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
