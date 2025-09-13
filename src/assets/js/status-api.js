// Funktion zum Laden und Anzeigen des Status
document.addEventListener('DOMContentLoaded', function() {
    const statusContainer = document.getElementById('status-container');

    // Funktion zum Formatieren des Datums
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Funktion zur Bestimmung des Status-Indikators
    function getStatusIndicator(status, impact) {
        if (status === 'UNDERMAINTENANCE') {
            return {
                text: 'Wartungsarbeiten',
                class: 'status-maintenance'
            };
        }

        if (status === 'OPERATIONAL') {
            return {
                text: 'Alle Systeme normal',
                class: 'status-operational'
            };
        }

        if (impact === 'MAJOROUTAGE' || impact === 'CRITICAL') {
            return {
                text: 'Schwerwiegende Störung',
                class: 'status-outage'
            };
        }

        if (impact === 'PARTIALOUTAGE' || impact === 'MINOR') {
            return {
                text: 'Teilweise Störung',
                class: 'status-issues'
            };
        }

        return {
            text: 'Untersuchung läuft',
            class: 'status-issues'
        };
    }

    // Funktion zum Übersetzen des Status
    function translateStatus(status) {
        const statusTranslations = {
            'INVESTIGATING': 'Untersuchung läuft',
            'IDENTIFIED': 'Problem identifiziert',
            'MONITORING': 'Überwachung',
            'RESOLVED': 'Behoben',
            'NOTSTARTEDYET': 'Noch nicht begonnen',
            'INPROGRESS': 'In Bearbeitung',
            'VERIFYING': 'Wird überprüft',
            'COMPLETED': 'Abgeschlossen'
        };

        return statusTranslations[status] || status;
    }

    // Funktion zum Übersetzen der Auswirkung
    function translateImpact(impact) {
        const impactTranslations = {
            'MAJOROUTAGE': 'Schwerwiegende Störung',
            'PARTIALOUTAGE': 'Teilweise Störung',
            'MINOR': 'Geringfügige Beeinträchtigung',
            'CRITICAL': 'Kritisch',
            'MAINTENANCE': 'Wartungsarbeiten'
        };

        return impactTranslations[impact] || impact;
    }

    // API-Daten abrufen
    fetch('https://grueneeule.instatus.com/summary.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Netzwerkantwort war nicht ok');
            }
            return response.json();
        })
        .then(data => {
            // Bestimme den Gesamtstatus
            const statusInfo = getStatusIndicator(data.page.status,
                data.activeIncidents.length > 0 ? data.activeIncidents[0].impact : 'NONE');

            // HTML für den Status erstellen
            let statusHTML = `
                    <div class="status-header">
                        <h3 class="status-title">${data.page.name}</h3>
                        <span class="status-indicator ${statusInfo.class}">${statusInfo.text}</span>
                    </div>
                `;

            // Aktuelle Vorfälle anzeigen
            if (data.activeIncidents && data.activeIncidents.length > 0) {
                statusHTML += `<div class="incidents-list">`;
                statusHTML += `<h4>Aktuelle Vorfälle</h4>`;

                data.activeIncidents.forEach(incident => {
                    statusHTML += `
                            <div class="incident-item">
                                <h5 class="incident-title">${incident.name}</h5>
                                <div class="incident-meta">
                                    <span>Status: ${translateStatus(incident.status)}</span>
                                    <span>Auswirkung: ${translateImpact(incident.impact)}</span>
                                    <span>Begonnen: ${formatDate(incident.started)}</span>
                                </div>
                            </div>
                        `;
                });

                statusHTML += `</div>`;
            }

            // Aktuelle Wartungsarbeiten anzeigen
            if (data.activeMaintenances && data.activeMaintenances.length > 0) {
                statusHTML += `<div class="maintenances-list">`;
                statusHTML += `<h4>Geplante Wartungsarbeiten</h4>`;

                data.activeMaintenances.forEach(maintenance => {
                    statusHTML += `
                            <div class="maintenance-item">
                                <h5 class="maintenance-title">${maintenance.name}</h5>
                                <div class="maintenance-meta">
                                    <span>Status: ${translateStatus(maintenance.status)}</span>
                                    <span>Geplant: ${formatDate(maintenance.start)}</span>
                                    <span>Dauer: ${maintenance.duration} Minuten</span>
                                </div>
                            </div>
                        `;
                });

                statusHTML += `</div>`;
            }

            // Wenn keine Vorfälle oder Wartungsarbeiten vorhanden sind
            if (data.activeIncidents.length === 0 && data.activeMaintenances.length === 0) {
                statusHTML += `<p class="no-issues">Derzeit sind keine Vorfälle oder Wartungsarbeiten gemeldet. Alle Systeme arbeiten normal.</p>`;
            }

            // Link zur vollständigen Statusseite
            statusHTML += `<a href="${data.page.url}" target="_blank" rel="noopener noreferrer" class="view-all-link">Vollständigen Statusbericht anzeigen</a>`;

            // HTML in den Container einfügen
            statusContainer.innerHTML = statusHTML;
        })
        .catch(error => {
            console.error('Fehler beim Laden des Status:', error);
            statusContainer.innerHTML = `
                    <div class="error">
                        <p>Derzeit sind keine Vorfälle oder Wartungsarbeiten gemeldet. Alle Systeme arbeiten normal.</p>
                        <a href="https://status.grueneeule.de" target="_blank" rel="noopener noreferrer" class="view-all-link">Statusseite besuchen</a>
                    </div>
                `;
        });
});
