class Toast {
    private duration: number
    public readonly container: HTMLDivElement
    private static template =
        `<div class="toast">
            <di class="toast-content"v>message</di>
            <div class="toast-close-icon">&times</div>
        </div>`
    constructor(duration = 3000) {
        this.duration = duration
        this.container = document.createElement('div')
        this.container.classList.add('toast-container')
    }
    private createElement(message: string) {
        const template = Toast.template.replace('message', message)
        const DOM_ELEMENT = new DOMParser().parseFromString(template, 'text/html').body.firstElementChild
        return DOM_ELEMENT as Element
    }
    private handleEvent(DOM_ELEMENT: Element) {
        DOM_ELEMENT.querySelector('.toast-close-icon')?.addEventListener('click', () => {
            this.close(DOM_ELEMENT)
        })
        this.container.prepend(DOM_ELEMENT)
        requestAnimationFrame(() => {
            DOM_ELEMENT.classList.add('show')
        })
        setTimeout(() => {
            this.close(DOM_ELEMENT)
        }, this.duration)
    }
    success(message: string) {
        const DOM_ELEMENT = this.createElement(message)
        DOM_ELEMENT.classList.add('success')
        this.handleEvent(DOM_ELEMENT)
    }
    error(message: string) {
        const DOM_ELEMENT = this.createElement(message)
        DOM_ELEMENT.classList.add('error')
        this.handleEvent(DOM_ELEMENT)
    }
    alert(message: string) {
        const DOM_ELEMENT = this.createElement(message)
        DOM_ELEMENT.classList.add('alert')
        this.handleEvent(DOM_ELEMENT)
    }
    close(DOM_ELEMENT: Element) {
        DOM_ELEMENT.classList.add('hide')
        setTimeout(() => {
            DOM_ELEMENT.classList.remove('show')
            DOM_ELEMENT.remove()
        }, 400)
    }
}

const toast = new Toast()

export default toast