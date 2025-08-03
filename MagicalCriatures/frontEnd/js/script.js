window.addEventListener('DOMContentLoaded', () => {
    const progress = document.querySelector('.loading-progress');
    let width = 0;

    const loading = setInterval(() => {
        if (width >= 100) {
            clearInterval(loading);

            setTimeout(() => {
                window.location.href = '../index.html';
            }, 300); 
        } else {
            width++;
            progress.style.width = width + '%';
        }
    }, 50);
});
