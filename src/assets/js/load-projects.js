document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM vollständig geladen - Starte Projekte-Loading");

  // Container für die Projekte
  const projectsGrid = document.querySelector(".projects-grid");

  if (!projectsGrid) {
    console.error("Projects-Grid Container nicht gefunden!");
    return;
  }

  // Zeige Ladeanimation
  projectsGrid.innerHTML =
    '<div class="loading-spinner">Lade Projekte...</div>';

  // Lade die Projektdaten
  fetch("/assets/api/projects/projects.json")
    .then((response) => {
      console.log(
        "HTTP Response erhalten:",
        response.status,
        response.statusText
      );

      if (!response.ok) {
        throw new Error(
          `HTTP Error: ${response.status} ${response.statusText}`
        );
      }
      return response.json();
    })
    .then((data) => {
      console.log("JSON-Daten erfolgreich geparst:", data);

      // Überprüfe ob Projekte vorhanden sind
      if (!data.projects || !Array.isArray(data.projects)) {
        throw new Error(
          "Ungültiges JSON-Format: projects Array nicht gefunden"
        );
      }

      if (data.projects.length === 0) {
        console.warn("Keine Projekte in der JSON-Datei gefunden");
        projectsGrid.innerHTML =
          '<p class="no-projects">Keine Projekte verfügbar.</p>';
        return;
      }

      // Leere den Container
      projectsGrid.innerHTML = "";

      // Für jedes Projekt eine Karte erstellen
      data.projects.forEach((project, index) => {
        console.log(`Erstelle Projekt ${index + 1}:`, project.title);

        try {
          const projectCard = createProjectCard(project);
          projectsGrid.appendChild(projectCard);

          // Füge Fade-In Animation nach kurzer Verzögerung hinzu
          setTimeout(() => {
            projectCard.style.opacity = "1";
            projectCard.style.transform = "translateY(0)";
          }, index * 100);
        } catch (error) {
          console.error(
            `Fehler beim Erstellen von Projekt "${project.title}":`,
            error
          );
        }
      });

      console.log(`Erfolgreich ${data.projects.length} Projekte geladen`);
    })
    .catch((error) => {
      console.error("Fehler beim Laden der Projekte:", error);
      showErrorFallback(projectsGrid, error);
    });
});

// Funktion zum Erstellen einer Projektkarte
function createProjectCard(project) {
  const article = document.createElement("article");
  article.className = `project-card ${project.cardClass || ""} fade-in`;
  article.style.opacity = "0";
  article.style.transform = "translateY(20px)";
  article.style.transition = "opacity 0.5s ease, transform 0.5s ease";

  // Titel
  const title = document.createElement("h3");
  title.textContent = project.title || "Unbenanntes Projekt";
  article.appendChild(title);

  // Inhaltscontainer
  const contentDiv = document.createElement("div");
  contentDiv.className = "project-card-content";

  // Beschreibung
  if (project.description) {
    const description = document.createElement("p");
    description.textContent = project.description;
    contentDiv.appendChild(description);
  }

  // Features-Liste
  if (project.features && project.features.length > 0) {
    const featureList = document.createElement("ul");

    project.features.forEach((feature) => {
      const listItem = document.createElement("li");
      listItem.textContent = feature;
      featureList.appendChild(listItem);
    });

    contentDiv.appendChild(featureList);
  }

  article.appendChild(contentDiv);

  // Buttons
  const hasPrimaryButton = project.primaryButton && project.primaryButton.text;
  const hasSecondaryButton =
    project.secondaryButton && project.secondaryButton.text;

  if (hasPrimaryButton || hasSecondaryButton) {
    const actionsDiv = document.createElement("div");
    actionsDiv.className = "project-actions";

    // Primärer Button
    if (hasPrimaryButton) {
      try {
        const primaryBtn = createButton(project.primaryButton, "cta-button");
        actionsDiv.appendChild(primaryBtn);
      } catch (error) {
        console.error("Fehler beim Erstellen des Primary Buttons:", error);
      }
    }

    // Sekundärer Button (falls vorhanden)
    if (hasSecondaryButton) {
      try {
        // Für GitHub-Buttons spezielle Behandlung
        if (project.secondaryButton.class === "github-button") {
          const githubBtn = createGitHubButton(project.secondaryButton);
          actionsDiv.appendChild(githubBtn);
        } else {
          const secondaryBtn = createButton(
            project.secondaryButton,
            "secondary-button"
          );
          actionsDiv.appendChild(secondaryBtn);
        }
      } catch (error) {
        console.error("Fehler beim Erstellen des Secondary Buttons:", error);
      }
    }

    article.appendChild(actionsDiv);
  } else if (hasPrimaryButton) {
    // Nur primärer Button ohne actions-div
    try {
      const primaryBtn = createButton(project.primaryButton, "cta-button");
      article.appendChild(primaryBtn);
    } catch (error) {
      console.error("Fehler beim Erstellen des Primary Buttons:", error);
    }
  }

  return article;
}

// Funktion zum Erstellen eines normalen Buttons
function createButton(buttonData, cssClass) {
  if (!buttonData.url || !buttonData.text) {
    throw new Error("Ungültige Button-Daten: url oder text fehlt");
  }

  const link = document.createElement("a");
  link.href = buttonData.url;
  link.className = `${cssClass} ${buttonData.class || ""}`.trim();
  link.textContent = buttonData.text;

  if (buttonData.url.startsWith("http")) {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }

  return link;
}

// Funktion zum Erstellen eines GitHub-Buttons
function createGitHubButton(buttonData) {
  if (!buttonData.url || !buttonData.text) {
    throw new Error("Ungültige GitHub-Button-Daten: url oder text fehlt");
  }

  const link = document.createElement("a");
  link.href = buttonData.url;
  link.className = "github-button-link";
  link.target = "_blank";
  link.rel = "noopener noreferrer";

  const button = document.createElement("button");
  button.className = "github-button";

  // Highlight-Span
  const highlight = document.createElement("span");
  highlight.className = "highlight";
  button.appendChild(highlight);

  // Button-Inhalt
  const contentDiv = document.createElement("div");
  contentDiv.className = "github-button-content";

  // GitHub-Icon
  const githubIcon = document.createElement("svg");
  githubIcon.className = "github-icon";
  githubIcon.setAttribute("viewBox", "0 0 438.549 438.549");
  githubIcon.innerHTML =
    '<path d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z"></path>';
  contentDiv.appendChild(githubIcon);

  // Button-Text
  const buttonText = document.createElement("span");
  buttonText.className = "button-text";
  buttonText.textContent = buttonData.text;
  contentDiv.appendChild(buttonText);

  button.appendChild(contentDiv);

  // Stern-Anzahl (falls gewünscht)
  if (buttonData.starCount) {
    const starCountDiv = document.createElement("div");
    starCountDiv.className = "star-count";

    const starIcon = document.createElement("svg");
    starIcon.className = "star-icon";
    starIcon.setAttribute("data-slot", "icon");
    starIcon.setAttribute("aria-hidden", "true");
    starIcon.setAttribute("fill", "currentColor");
    starIcon.setAttribute("viewBox", "0 0 24 24");
    starIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    starIcon.innerHTML =
      '<path clip-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" fill-rule="evenodd"></path>';

    starCountDiv.appendChild(starIcon);
    button.appendChild(starCountDiv);
  }

  link.appendChild(button);
  return link;
}

// Fehler-Fallback Funktion
function showErrorFallback(container, error) {
  console.error("Zeige Fehler-Fallback:", error);

  container.innerHTML = `
        <div class="error-message">
            <h3>⚠️ Fehler beim Laden der Projekte</h3>
            <p>Die Projekte konnten nicht geladen werden. Bitte versuche es später erneut.</p>
            <p class="error-details">Fehler: ${error.message}</p>
            <button onclick="location.reload()" class="cta-button">Erneut versuchen</button>
        </div>
    `;

  // Nach 5 Sekunden automatisch neu laden
  setTimeout(() => {
    location.reload();
  }, 5000);
}

// CSS für Ladeanimation und Fehlermeldungen
const style = document.createElement("style");
style.textContent = `
    .loading-spinner {
        text-align: center;
        padding: 2rem;
        font-size: 1.2rem;
        color: #666;
    }
    
    .no-projects {
        text-align: center;
        padding: 2rem;
        color: #666;
    }
    
    .error-message {
        text-align: center;
        padding: 2rem;
        background: #ffe6e6;
        border: 1px solid #ffcccc;
        border-radius: 8px;
        margin: 1rem 0;
    }
    
    .error-details {
        font-size: 0.9rem;
        color: #666;
        margin-top: 0.5rem;
    }
`;
document.head.appendChild(style);
