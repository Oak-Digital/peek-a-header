import PeekAHeader from '../src/peek-a-header';

window.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('peek-a-header-sticky')!;
    if (header) {
        const stickyInstance = new PeekAHeader(header);
    }

    const fixedHeader = document.getElementById('peek-a-header-fixed');
    if (fixedHeader) {
        const fixedInstance = new PeekAHeader(fixedHeader);
    }
});
