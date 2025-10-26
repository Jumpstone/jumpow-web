document.addEventListener("DOMContentLoaded", () => {
  const reposContainer = document.getElementById("github-repos-container");
  if (!reposContainer) return;

  fetch("https://api.github.com/users/Jumpstone/repos?sort=pushed&direction=desc&per_page=2")
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(repos => {
      reposContainer.innerHTML = ""; // Clear loading message
      if (repos.length === 0) {
        reposContainer.innerHTML = "<p>Keine Repositories gefunden.</p>";
        return;
      }

      repos.forEach(repo => {
        const repoCard = document.createElement("div");
        repoCard.className = "project-card"; // Reuse existing style

        const repoName = document.createElement("h3");
        repoName.textContent = repo.name;

        const repoDescription = document.createElement("p");
        repoDescription.textContent = repo.description || "Keine Beschreibung vorhanden.";

        const repoButtonLink = document.createElement("a");
        repoButtonLink.href = repo.html_url;
        repoButtonLink.target = "_blank";
        repoButtonLink.rel = "noopener noreferrer";
        repoButtonLink.className = "cta-button";
        repoButtonLink.textContent = "Zum Repository";
        repoButtonLink.style.marginTop = "1rem";
        repoButtonLink.style.display = "inline-block";

        repoCard.appendChild(repoName);
        repoCard.appendChild(repoDescription);
        repoCard.appendChild(repoButtonLink);
        reposContainer.appendChild(repoCard);
      });
    })
    .catch(error => {
      reposContainer.innerHTML = `<p style="color: var(--error-color);">Fehler beim Laden der Repositories: ${error.message}</p>`;
      console.error("Error fetching GitHub repos:", error);
    });
});