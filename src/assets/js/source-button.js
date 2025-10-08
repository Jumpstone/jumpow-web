// source-button.js

document.addEventListener("DOMContentLoaded", () => {
    // Finde den Button im Header/Footer
    const sourceBtn = document.getElementById("source-btn");
    if (!sourceBtn) return; // Abbrechen, falls Button nicht existiert

    // Aktuellen Pfad holen (ohne Domain)
    let path = window.location.pathname;

    // Letzten Slash entfernen, falls vorhanden
    path = path.replace(/\/$/, "");

    // Link auf /source bauen
    sourceBtn.href = path + "/source";

    // Optional: Tooltip setzen
    sourceBtn.title = "View source for this page on GitHub";

    // Optional: Ziel in neuem Tab öffnen
    sourceBtn.target = "_blank";
});
