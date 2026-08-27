const favicon = document.getElementById("favicon");

function updateFavicon() {
    favicon.href = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "assets/favicon_light.ico"
        : "assets/favicon_dark.ico";
}

updateFavicon();

window.matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", updateFavicon);