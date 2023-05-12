import { EventEmitter } from 'tseep';
import { TransitionStrategy, TransitionStrategyReturn } from './transitions/strategy';
import { Gesture } from '@use-gesture/vanilla';

type EventMap = {
    progress: (progress: {
        /**
         * The percentage of the header that is hidden.
         */
        progress: number;
        /**
         * The amount of pixels that are hidden.
         */
        amount: number;
    }) => void;
    transitionStart: () => void;
    transitionEnd: () => void;
    /**
     * Emitted when the header is completely hidden
     */
    hidden: () => void;
    /**
     * Emitted when the header is no longer completely hidden
     */
    unhidden: () => void;
};

enum ScrollDirection {
    up,
    down,
    none,
}

const fallbackTransition: TransitionStrategyReturn = {
    promise: Promise.resolve(),
};

type PeekAHeaderOptions = {
    /**
     * Whether or not the PeekAHeader should apply the transforms
     * If you want to hande this yourself, set this to false. and listen to the progress event.
     */
    autoUpdateTransform?: boolean;
    /**
     * The transition strategy to use when the header is hidden or shown.
     */
    transitionStrategy?: TransitionStrategy;
    /**
     * Whether or not you want PeekAHeader to automatically handle snapping while scrolling.
     */
    autoSnap?: boolean;
    /**
     * automatically handle setting aria-hidden
     */
    autoAriaHidden?: boolean;
};

class PeekAHeader {
    private element: HTMLElement;
    // The home is where the header is currently "sticking" to.
    private homeY: number;
    private headerHeight: number;
    private hidden = false;
    private locked: null | 'hidden' | 'shown' | number = null;
    private currentTranslateY: number | null = null;
    private resizeObserver: ResizeObserver;
    private previousScrollY;
    private eventEmitter: EventEmitter<EventMap>;
    private sticky: null | boolean = null;
    private autoUpdateTransform: boolean;
    private transitionStrategy: TransitionStrategy | null = null;
    private autoAriaHidden: boolean = true;
    private autoSnap: boolean = false;
    private gesture: Gesture;

    constructor(
        element: HTMLElement,
        {
            autoUpdateTransform = true,
            transitionStrategy,
            autoAriaHidden = true,
            autoSnap = false,
        }:
        PeekAHeaderOptions = {}
    ) {
        this.previousScrollY = window.scrollY;
        this.element = element;
        const rect = element.getBoundingClientRect();
        this.homeY = this.calculateHomeY(rect);
        this.headerHeight = rect.height;
        this.autoUpdateTransform = autoUpdateTransform;
        this.transitionStrategy = transitionStrategy ?? null;
        this.autoAriaHidden = autoAriaHidden;
        this.autoSnap = autoSnap;
        this.gesture = new Gesture(window, {
            onScrollEnd: () => {
                this.onScrollEnd();
            },
            onScroll: () => {
                this.onScroll();
            },
        });

        this.resizeObserver = new ResizeObserver(() => {
            this.updateHomeY();
            this.updateHeaderHeight();
        });

        this.resizeObserver.observe(element);

        this.eventEmitter = new EventEmitter<EventMap>();

        if (this.autoAriaHidden) {
            this.on('hidden', () => {
                this.element.setAttribute('aria-hidden', 'true');
            });
            this.on('unhidden', () => {
                this.element.setAttribute('aria-hidden', 'false');
            });
        }

        //if (this.autoSnap) {
        //    // when scrolling using 'wheel' use partialHide and show
        //}
    }

    on<K extends keyof EventMap>(event: K, listener: EventMap[K]) {
        this.eventEmitter.on(event, listener);
    }

    off<K extends keyof EventMap>(event: K, listener: EventMap[K]) {
        this.eventEmitter.off(event, listener);
    }

    private emit<K extends keyof EventMap>(event: K, ...args: Parameters<EventMap[K]>) {
        this.eventEmitter.emit(event, ...args);
    }

    private onScrollEnd() {
        if (this.autoSnap) {
            this.snap();
        }
    }

    /**
     * Checks if the element is sticky or not
     */
    isSticky(useCachedValue = true) {
        if (useCachedValue && this.sticky !== null) {
            return this.sticky;
        }
        const style = window.getComputedStyle(this.element);
        const isSticky = style.position === 'sticky';
        this.sticky = isSticky;
        return isSticky;
    }

    /**
     * Apply the transform to the header
     */
    applyTransform() {
        let num;

        if (this.currentTranslateY === null) {
            if (this.hidden) {
                num = `-100%`;
                this.emit('progress', {
                    progress: 1,
                    amount: -this.headerHeight,
                });
            } else {
                num = '0px';
                this.emit('progress', {
                    progress: 0,
                    amount: 0,
                });
            }
        } else {
            num = `${this.currentTranslateY}px`;
            this.emit('progress', {
                progress: this.currentTranslateY,
                amount: this.currentTranslateY,
            });
        }

        if (!this.autoUpdateTransform) {
            return;
        }

        this.element.style.transform = `translateY(${num})`;
    }

    /**
     * @alpha May not always work as intended with sticky headers
     * Lock the header at the current position or as hidden or shown
     *
     * @param position the position to lock the header at
     */
    lock(position: 'hidden' | 'shown' | 'current' = 'hidden') {
        switch (position) {
            case 'hidden':
                this.locked = position;
                this.partialHide();
                break;
            case 'shown':
                this.locked = position;
                this.show();
                break;
            case 'current':
                this.locked = this.getTranslateYNumber();
                break;
            default:
                throw new Error(`Unknown lock position ${position}`);
        }
    }

    /**
     * Unlock the header
     */
    unlock() {
        this.locked = null;
    }

    /**
     * Returns true if the header is locked
     */
    isLocked() {
        return this.locked !== null;
    }

    private transitonShow(forceFallback = false) {
        if (forceFallback) {
            return fallbackTransition;
        }

        const transition = this.transitionStrategy?.show(this.element, {
            from: {
                y: this.getTranslateYNumber(),
            },
            to: {
                y: 0,
            },
        });

        if (transition) {
            this.emit('transitionStart');
            transition.promise.then(() => {
                this.emit('transitionEnd');
            });
        }

        return transition ?? fallbackTransition;
    }

    private transitionHide(forceFallback = false, to: number | string = '-100%') {
        if (forceFallback) {
            return fallbackTransition;
        }

        return (
            this.transitionStrategy?.hide(this.element, {
                from: {
                    y: this.getTranslateYNumber(),
                },
                to: {
                    y: to,
                },
            }) ?? fallbackTransition
        );
    }

    /**
     * Show the full header
     */
    async show(useTransition: boolean = true) {
        if (this.getTranslateYNumber() === 0) {
            return;
        }

        const transition = this.transitonShow(!useTransition);
        const { applyTransform = 'after', promise } = transition;

        this.hidden = false;
        this.currentTranslateY = null;

        if (applyTransform === 'before') {
            this.applyTransform();
            this.emit('unhidden');
        }

        await promise;

        if (applyTransform === 'after') {
            this.applyTransform();
        }

        if (applyTransform !== 'before') {
            this.emit('unhidden');
        }
    }

    /**
     * Hide the header
     */
    async hide(useTransition: boolean = true) {
        if (this.hidden) {
            return;
        }

        const transition = this.transitionHide(!useTransition);
        const { applyTransform = 'after', promise } = transition;

        this.hidden = true;
        this.currentTranslateY = null;

        if (applyTransform === 'before') {
            this.applyTransform();
        }

        await promise;

        if (applyTransform === 'after') {
            this.applyTransform();
        }

        this.emit('hidden');
    }

    /**
     * This function should only be used with sticky headers. It works like hide() for non-sticky headers.
     * It will check if the header has space enough to be hidden, else it will only partially hide.
     * It uses getStaticOffset() which uses the DOM, so it might be a little expensive.
     */
    async partialHide(useTransition: boolean = true) {
        if (!this.isSticky()) {
            this.hide();
            return;
        }
        const translateYNumber = this.getTranslateYNumber();
        const offset = this.element.offsetTop + translateYNumber;
        const staticOffset = this.getStaticOffset();
        const offsetFromStaticPosition = offset - staticOffset;
        const spaceRequired = this.headerHeight + translateYNumber;

        if (offsetFromStaticPosition >= spaceRequired) {
            await this.hide();
            return;
        }

        const newTranslateY = this.capTranslateY(translateYNumber - Math.min(offsetFromStaticPosition, spaceRequired));

        if (translateYNumber === newTranslateY) {
            return;
        }

        this.currentTranslateY = newTranslateY;
        const transition = this.transitionHide(!useTransition, newTranslateY);
        const { applyTransform = 'after', promise } = transition;

        if (applyTransform === 'before') {
            this.applyTransform();
        }

        await promise;

        if (applyTransform === 'after') {
            this.applyTransform();
        }
    }

    /**
     * This function will get the original offset of the header element.
     * It writes and reads from the DOM, so it might be a little expensive.
     */
    getStaticOffset() {
        this.element.style.position = 'relative';
        const offset = this.element.offsetTop;
        this.element.style.position = '';
        return offset;
    }

    /**
     * Snap the header to the closest position (shown or hidden)
     */
    async snap() {
        if (this.currentTranslateY === null) return; // already snapped

        if (this.currentTranslateY > -this.headerHeight / 2) {
            await this.show();
        } else {
            await this.partialHide();
        }
    }

    /**
     * Destroy the PeekAHeader instance, removing all event listeners.
     * Calling any methods on PeekAHeader after this method is called will result in undefined behavior.
     */
    destroy() {
        this.resizeObserver.disconnect();
        this.eventEmitter.removeAllListeners();
        this.gesture.destroy();
    }

    private calculateHomeY(rect?: DOMRect) {
        const newRect = rect ?? this.element.getBoundingClientRect();
        // TODO: check if window exists in case of SSR, if not use 0
        return newRect.top + window.scrollY;
    }

    private updateHomeY() {
        this.homeY = this.calculateHomeY();
    }

    private updateHeaderHeight() {
        this.headerHeight = this.element.getBoundingClientRect().height;
    }

    private capTranslateY(translateY: number) {
        const minCapped = Math.max(translateY, -this.headerHeight);
        return Math.min(minCapped, 0);
    }

    /**
     * Returns the number of pixels the header is currently translated by
     * currentTranslateY is null if the header is not currently translated or hidden
     */
    private getTranslateYNumber() {
        const currrentTranslateYNumber = this.currentTranslateY
            ? this.currentTranslateY
            : this.hidden
            ? -this.headerHeight
            : 0;
        return currrentTranslateYNumber;
    }

    private onScroll() {
        const scrollY = window.scrollY;
        const realScrollDelta = scrollY - this.previousScrollY;
        // find the scroll delta from the homeY
        // if start scroll is before home, subtact the difference between home and start scroll from the delta
        // if start scroll is after home use the real delta.
        const scrollDelta = scrollY < this.homeY ? realScrollDelta - (this.homeY - scrollY) : realScrollDelta;
        this.previousScrollY = scrollY;

        if (scrollDelta === 0) return;

        const scrollDirection = scrollDelta < 0 ? ScrollDirection.up : ScrollDirection.down;

        /* console.log('scrollY', scrollDirection, scrollDelta); */

        this.updateHomeY();
        switch (scrollDirection) {
            case ScrollDirection.up:
                if (!this.hidden && this.currentTranslateY === null) {
                    return;
                }
                break;

            case ScrollDirection.down:
                if (this.hidden) {
                    return;
                }
                break;

            /* case ScrollDirection.none: */
            /*     return; */
        }

        if (this.isLocked()) {
            if (!this.isSticky()) {
                return;
            }

            // TODO:

            return;
        }

        const currrentTranslateYNumber = this.getTranslateYNumber();
        const newTranslateY = this.capTranslateY(currrentTranslateYNumber - scrollDelta);

        if (newTranslateY === 0) {
            this.currentTranslateY = null;
            this.hidden = false;
            this.emit('unhidden');
        } else if (newTranslateY === -this.headerHeight) {
            this.currentTranslateY = null;
            this.hidden = true;
            this.emit('hidden');
        } else {
            this.currentTranslateY = newTranslateY;

            if (this.hidden) {
                this.hidden = false;
                this.emit('unhidden');
            }
        }

        this.applyTransform();
    }
}

export default PeekAHeader;
