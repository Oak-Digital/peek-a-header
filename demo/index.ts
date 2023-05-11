import PeekAHeader from '../src/peek-a-header';

window.addEventListener('DOMContentLoaded', () => {
    const instances: PeekAHeader[] = [];

    const header = document.getElementById('peek-a-header-sticky')!;
    if (header) {
        const stickyInstance = new PeekAHeader(header);
        instances.push(stickyInstance);
    }

    const fixedHeader = document.getElementById('peek-a-header-fixed');
    if (fixedHeader) {
        const fixedInstance = new PeekAHeader(fixedHeader);
        instances.push(fixedInstance);
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
