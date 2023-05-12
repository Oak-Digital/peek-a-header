import PeekAHeader from '../src/peek-a-header';
import { TransitionClassStrategy } from '../src/transitions/class';

window.addEventListener('DOMContentLoaded', () => {
    const instances: PeekAHeader[] = [];
    const strategy = new TransitionClassStrategy({
        showClass: 'transition-transforms',
        hideClass: 'transition-transforms',
    });

    const header = document.getElementById('peek-a-header-sticky')!;
    if (header) {
        const stickyInstance = new PeekAHeader(header, {
            transitionStrategy: strategy,
        });
        instances.push(stickyInstance);
    }

    const fixedHeader = document.getElementById('peek-a-header-fixed');
    if (fixedHeader) {
        const fixedInstance = new PeekAHeader(fixedHeader, {
            transitionStrategy: strategy,
        });
        instances.push(fixedInstance);
    }

    const stickyAutoSnapHeader = document.getElementById('peek-a-header-sticky-auto-snap');
    if (stickyAutoSnapHeader) {
        const stickyAutoSnapInstance = new PeekAHeader(stickyAutoSnapHeader, {
            transitionStrategy: strategy,
            autoSnap: true,
        });
        instances.push(stickyAutoSnapInstance);
    }

    const hideButton = document.getElementById('hide-button');
    if (hideButton) {
        hideButton.addEventListener('click', () => {
            instances.forEach((instance) => instance.hide());
        });
    }

    const showButton = document.getElementById('show-button');
    if (showButton) {
        showButton.addEventListener('click', () => {
            instances.forEach((instance) => instance.show());
        });
    }

    const snapButton = document.getElementById('snap-button');
    if (snapButton) {
        snapButton.addEventListener('click', () => {
            instances.forEach((instance) => instance.snap());
        });
    }

    const partialHideButton = document.getElementById('partial-hide-button');
    if (partialHideButton) {
        partialHideButton.addEventListener('click', () => {
            instances.forEach((instance) => instance.partialHide());
        });
    }
});
