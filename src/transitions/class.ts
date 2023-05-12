import { TransitionStrategy, TransitionStrategyReturn } from './strategy';

type TransitionClassStrategyOptions = {
    showClass: string | string[];
    hideClass: string | string[];
};

const isClassValid = (className: string) => !className.includes(' ') && className !== '';
const isClassInvalid = (className: string) => !isClassValid(className);

/**
 * This strategy works by adding and removing a class to the element, when it should transition.
 */
export class TransitionClassStrategy implements TransitionStrategy {
    public showClass: string[];
    public hideClass: string[];

    constructor(options: TransitionClassStrategyOptions) {
        const { showClass, hideClass } = options;
        this.showClass = Array.isArray(showClass) ? showClass : [showClass];
        this.hideClass = Array.isArray(hideClass) ? hideClass : [hideClass];

        if (this.showClass.some(isClassInvalid) || this.hideClass.some(isClassInvalid)) {
            throw new Error('Classes cannot contain whitespace or be empty. Split them up in an array first');
        }
    }

    hide(element: HTMLElement) {
        return this.transition(element, false);
    }

    show(element: HTMLElement) {
        return this.transition(element, true);
    }

    private transition(element: HTMLElement, show: boolean): TransitionStrategyReturn {
        const className = show ? this.showClass : this.hideClass;

        const promise = new Promise<void>((resolve) => {
            const func = () => {
                element.classList.remove(...className);
                resolve();
            };
            element.addEventListener('transitionend', func, { once: true });

            // We add the class after, so the transition does not end before we can listen to it.
            element.classList.add(...className);
        });

        return {
            promise,
            applyTransform: 'before',
        };
    }
}
