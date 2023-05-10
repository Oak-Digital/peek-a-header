import { EventEmitter } from 'tseep';

type EventMap = {
    updateTranslate: (translateY: number) => void;
};

enum ScrollDirection {
    up,
    down,
    none,
}

class PeekAHeader {
    private element: HTMLElement;
    // The home is where the header is currently "sticking" to.
    private homeY: number;
    private headerHeight: number;
    private hidden = false;
    //private locked = false; // TODO
    private currentTranslateY: number | null = null;
    private resizeObserver: ResizeObserver;
    private previousScrollY;
    private eventEmitter: EventEmitter<EventMap>;
    private onScrollFunction: () => void;

    constructor(element: HTMLElement) {
        this.previousScrollY = window.scrollY;
        this.element = element;
        const rect = element.getBoundingClientRect();
        this.homeY = this.calculateHomeY(rect);
        this.headerHeight = rect.height;

        this.resizeObserver = new ResizeObserver(() => {
            this.updateHomeY();
            this.updateHeaderHeight();
        });

        this.resizeObserver.observe(element);

        this.eventEmitter = new EventEmitter<EventMap>();

        this.onScrollFunction = this.onScroll.bind(this);
        window.addEventListener('scroll', this.onScrollFunction);
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

    /**
     * Apply the transform to the header
     *
     */
    applyTransform() {
        let num;

        if (this.currentTranslateY === null) {
            if (this.hidden) {
                num = `-100%`;
                this.emit('updateTranslate', -this.headerHeight);
            } else {
                num = '0px';
                this.emit('updateTranslate', 0);
            }
        } else {
            num = `${this.currentTranslateY}px`;
            this.emit('updateTranslate', this.currentTranslateY);
        }

        this.element.style.transform = `translateY(${num})`;
    }

    /**
     * Lock the header at the current position or as hidden or shown
     *
     * @param position the position to lock the header at
     */
    lock(position: 'hidden' | 'shown' | 'current' = 'current') {
        throw new Error('lock() is not implemented');
        //this.locked = true;
        //switch (position) {
        //    case 'hidden':
        //        this.hidden = true;
        //        return;
        //    case 'shown':
        //        this.hidden = false;
        //        return;
        //    case 'current':
        //        return;
        //    default:
        //        throw new Error(`Unknown lock position ${position}`);
        //}
    }

    /**
     * Unlock the header
     */
    unlock() {
        throw new Error('unlock() is not implemented');
        //this.locked = false;
    }

    /**
     * Destroy the PeekAHeader instance, removing all event listeners.
     * Calling any methods on PeekAHeader after this method is called will result in undefined behavior.
     */
    destroy() {
        this.resizeObserver.disconnect();
        this.eventEmitter.removeAllListeners();
        window.removeEventListener('scroll', this.onScrollFunction);
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

        this.updateHomeY();
        if (scrollDelta === 0) return;

        const scrollDirection =
            scrollDelta < 0 ? ScrollDirection.up : ScrollDirection.down;

        /* console.log('scrollY', scrollDirection, scrollDelta); */

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

        const currrentTranslateYNumber = this.getTranslateYNumber();
        const newTranslateY = this.capTranslateY(currrentTranslateYNumber - scrollDelta);

        if (newTranslateY === 0) {
            this.currentTranslateY = null;
            this.hidden = false;
        } else if (newTranslateY === -this.headerHeight) {
            this.currentTranslateY = null;
            this.hidden = true;
        } else {
            this.currentTranslateY = newTranslateY;
            this.hidden = false;
        }

        this.applyTransform();
    }
}

export default PeekAHeader;
