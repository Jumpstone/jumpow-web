document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const slug = urlParams.get('slug');

    if (id || slug) {
        loadNewsDetail(id, slug);
    } else {
        window.location.href = '/blog/blog.html';
    }

    async function loadNewsDetail(id, slug) {
        try {
            // Lade News-Metadaten
            const newsResponse = await fetch('/assets/data/blog.json');
            if (!newsResponse.ok) throw new Error('News-Daten nicht gefunden');
            const newsData = await newsResponse.json();

            // Suche nach Slug oder ID
            let newsItem = null;
            if (slug) {
                newsItem = newsData.find(item => item.slug === slug);
            } else if (id) {
                newsItem = newsData.find(item => item.id.toString() === id);
            }

            if (!newsItem) {
                window.location.href = '/blog/blog.html';
                return;
            }

            // Setze Titel, Datum und Bild
            document.getElementById('news-detail-title').textContent = newsItem.title;
            document.getElementById('news-detail-date').textContent = formatDate(newsItem.date);
            if (newsItem.image) {
                document.getElementById('news-detail-image').src = newsItem.image;
                document.getElementById('news-detail-image').alt = newsItem.title;
            }
            document.title = `${newsItem.title} | GrüneEule`;

            // Lade Markdown-Inhalt
            const mdResponse = await fetch(newsItem.fullContentPath);
            if (!mdResponse.ok) throw new Error('Markdown nicht gefunden');
            const markdown = await mdResponse.text();

            // Konvertiere Markdown zu HTML
            const htmlContent = convertMarkdownToHtml(markdown);
            document.getElementById('news-detail-text').innerHTML = htmlContent;

        } catch (error) {
            console.error('Fehler:', error);
            window.location.href = '/blog/blog.html';
        }
    }

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('de-DE', options);
    }

    function convertMarkdownToHtml(markdown) {
        // Überschriften
        let html = markdown
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^### (.*$)/gm, '<h3>$1</h3>');

        // Absätze
        html = html.replace(/^(?!<h[1-6]|<\/?[a-z])(.*$)/gm, '<p>$1</p>');

        // Links
        html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');

        // Listen
        html = html.replace(/^\* (.*$)/gm, '<li>$1</li>');
        html = html.replace(/<li>.*<\/li>/g, function(match) {
            return '<ul>' + match + '</ul>';
        });

        // Fett / Kursiv
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

        return html;
    }
});
