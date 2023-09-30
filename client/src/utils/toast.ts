type ToastOptions = {
    duration: number
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
    pauseOnHover?: boolean
    appendOnTopBody?: boolean
}
class Toast {
    private duration: number
    private position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
    private pauseOnHover: boolean | undefined
    public readonly container: HTMLDivElement
    private static template =
        `<div class="toast">
            <di class="toast-content"v>message</di>
            <div class="toast-close-icon">&times</div>
        </div>`
    constructor(options = {
        duration: 3000,
        position: 'top-right',
        pauseOnHover: false,
        appendOnTopBody: true
    } as ToastOptions) {
        if (!options.pauseOnHover) options.pauseOnHover = false
        if (!options.appendOnTopBody) options.appendOnTopBody = true
        this.duration = options.duration
        this.position = options.position
        this.pauseOnHover = options.pauseOnHover
        this.container = document.createElement('div')
        this.container.classList.add('toast-container')
        this.container.classList.add(this.position)
        document.querySelectorAll('.toast-container').forEach(node => {
            node.remove()
        })
        if (options.appendOnTopBody) document.body.prepend(this.container)
    }
    private createElement(message: string) {
        const template = Toast.template.replace('message', message)
        const DOM_ELEMENT = new DOMParser().parseFromString(template, 'text/html').body.firstElementChild
        return DOM_ELEMENT as HTMLDivElement
    }
    private handleEvent(DOM_ELEMENT: HTMLDivElement) {
        DOM_ELEMENT.querySelector('.toast-close-icon')?.addEventListener('click', () => {
            this.close(DOM_ELEMENT)
        })
        switch (this.position) {
            case 'top-left':
                this.container.prepend(DOM_ELEMENT)
                break
            case 'top-right':
                this.container.prepend(DOM_ELEMENT)
                break
            case 'bottom-left':
                this.container.append(DOM_ELEMENT)
                break
            case 'bottom-right':
                this.container.append(DOM_ELEMENT)
                break
            default:
                this.container.prepend(DOM_ELEMENT)
                break;
        }
        requestAnimationFrame(() => {
            DOM_ELEMENT.classList.add('show')
        })
        let closeTimeOutId = setTimeout(() => {
            this.close(DOM_ELEMENT)
        }, this.duration)
        if (this.pauseOnHover) {
            DOM_ELEMENT.addEventListener('mouseenter', () => {
                clearTimeout(closeTimeOutId)
                DOM_ELEMENT.addEventListener('mouseleave', () => {
                    closeTimeOutId = setTimeout(() => {
                        this.close(DOM_ELEMENT)
                    }, this.duration)
                }, { once: true })
            })
        }
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
    close(DOM_ELEMENT: HTMLDivElement) {
        DOM_ELEMENT.classList.add('hide')
        setTimeout(() => {
            DOM_ELEMENT.classList.remove('show')
            DOM_ELEMENT.remove()
        }, 400)
    }
}

const toast = new Toast({
    duration: 3000,
    position: 'top-right',
    // pauseOnHover: true,
    // appendOnTopBody: true
})

export default toast