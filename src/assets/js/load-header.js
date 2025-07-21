window.addEventListener("DOMContentLoaded", () => {
    fetch("/assets/templates/header.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("header-container").innerHTML = data;
        });
});
