window.addEventListener("DOMContentLoaded", () => {
    fetch("/assets/templates/footer.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("footer-container").innerHTML = data;
        });
});
