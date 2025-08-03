document.addEventListener("DOMContentLoaded", function () {
    const loader = document.getElementById("loader");
    const progress = document.getElementById("loadingProgress");
    const mainContent = document.getElementById("mainContent");

    let width = 0;
    const interval = setInterval(() => {
        width += 2;
        progress.style.width = width + "%";

        if (width >= 100) {
            clearInterval(interval);
            loader.style.display = "none";
            mainContent.style.display = "flex";
        }
    }, 15); 
});
