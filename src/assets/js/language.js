document.addEventListener("DOMContentLoaded", () => {
    const switchBtn = document.getElementById("languageSwitch");
    const dropdown = document.getElementById("languageDropdown");
    const options = dropdown.querySelectorAll(".language-option");

    // Dropdown ein-/ausblenden
    switchBtn.addEventListener("click", () => {
        dropdown.classList.toggle("show");
    });

    // Klick auf eine Sprache
    options.forEach(option => {
        option.addEventListener("click", (e) => {
            e.preventDefault();
            const lang = option.getAttribute("data-lang");

            let path = window.location.pathname;

            // Sprache im Pfad ersetzen
            if (path.startsWith("/de/")) {
                path = path.replace(/^\/de\//, `/${lang}/`);
            } else if (path.startsWith("/en/")) {
                path = path.replace(/^\/en\//, `/${lang}/`);
            } else {
                // Falls keine Sprache drin ist → vorne dranhängen
                path = `/${lang}${path}`;
            }

            window.location.href = path;
        });
    });

    // Schließen, wenn man außerhalb klickt
    document.addEventListener("click", (e) => {
        if (!switchBtn.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.remove("show");
        }
    });
});