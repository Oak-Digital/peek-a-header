type StyleProps = {
    y: string | number;
};

export type TransitionStrategyFromTo = {
    from: StyleProps;
    to: StyleProps;
};

export type TransitionStrategyReturn = {
    promise: Promise<void>;
    /**
     * This function should stop the animation.
     */
    stop?: () => void;
    /**
     * This describes when the transform should be applied.
     * Before or after the promise.
     */
    applyTransform?: 'before' | 'after' | 'never';
};

export interface TransitionStrategy {
    hide(element: HTMLElement, fromTo: TransitionStrategyFromTo): TransitionStrategyReturn;
    show(element: HTMLElement, fromTo: TransitionStrategyFromTo): TransitionStrategyReturn;
}
