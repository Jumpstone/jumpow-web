document.addEventListener('DOMContentLoaded', function() {
    console.log('News-Skript geladen'); // Debug-Ausgabe

    async function loadNews(limit = null, containerId = 'all-news-container') {
        try {
            console.log('Lade News-Daten...'); // Debug-Ausgabe
            const response = await fetch('/assets/data/blog.json');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const newsData = await response.json();
            console.log('News-Daten erhalten:', newsData); // Debug-Ausgabe

            // Sortiere nach Datum (neueste zuerst)
            newsData.sort((a, b) => new Date(b.date) - new Date(a.date));

            // Begrenze die Anzahl der News
            const newsToDisplay = limit ? newsData.slice(0, limit) : newsData;

            const container = document.getElementById(containerId);
            if (!container) {
                console.error('Container nicht gefunden:', containerId);
                return;
            }

            container.innerHTML = newsToDisplay.map(news => `
                <div class="news-card fade-in">
                    <div class="news-card-content">
                        <h3 class="news-card-title">${news.title}</h3>
                        <p class="news-card-date">${formatDate(news.date)}</p>
                        <p class="news-card-excerpt">${news.content}</p>
                        <a href="/de/blog/blog-detail.html?slug=${news.slug}" class="news-card-link">Mehr lesen →</a>
                    </div>
                </div>
            `).join('');

            // Initialisiere Observer für Animationen
            initObservers();

            // Wenn auf blog.html, Suchfunktion einrichten
            if (window.location.pathname.includes('blog.html')) {
                setupNewsFilter(newsData);
            }

        } catch (error) {
            console.error('Fehler beim Laden der News:', error);
            const container = document.getElementById(containerId) || document.getElementById('news-container');
            if (container) {
                container.innerHTML = `
                    <div class="error-message">
                        <p>Die News konnten nicht geladen werden. Bitte versuche es später erneut.</p>
                        <button onclick="window.location.reload()">Neu laden</button>
                    </div>
                `;
            }
        }
    }

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('de-DE', options);
    }

    function setupNewsFilter(newsData) {
        const newsSearch = document.getElementById('news-search');
        const newsSort = document.getElementById('news-sort');

        if (!newsSearch || !newsSort) return;

        function updateNewsDisplay() {
            const searchTerm = newsSearch.value.toLowerCase();
            const sortOption = newsSort.value;

            let filteredNews = [...newsData];

            // Filterung
            if (searchTerm) {
                filteredNews = filteredNews.filter(news =>
                    news.title.toLowerCase().includes(searchTerm) ||
                    news.content.toLowerCase().includes(searchTerm)
                );
            }

            // Sortierung
            filteredNews.sort((a, b) =>
                sortOption === 'newest'
                    ? new Date(b.date) - new Date(a.date)
                    : new Date(a.date) - new Date(b.date)
            );

            const container = document.getElementById('all-news-container');
            if (container) {
                container.innerHTML = filteredNews.map(news => `
                    <div class="news-card fade-in">
                        <div class="news-card-content">
                            <h3 class="news-card-title">${news.title}</h3>
                            <p class="news-card-date">${formatDate(news.date)}</p>
                            <p class="news-card-excerpt">${news.content}</p>
                            <a href="/de/blog/blog-detail.html?slug=${news.slug}" class="news-card-link">Mehr lesen →</a>
                        </div>
                    </div>
                `).join('');

                initObservers();
            }
        }

        newsSearch.addEventListener('input', updateNewsDisplay);
        newsSort.addEventListener('change', updateNewsDisplay);
    }

    function initObservers() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });
    }

    // Entscheide welche News geladen werden sollen
    if (window.location.pathname.includes('blog.html')) {
        loadNews(); // Alle News laden
    } else if (document.getElementById('news-container')) {
        loadNews(2, 'news-container'); // Nur 2 News auf der Startseite
    }
});