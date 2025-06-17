const QUESTIONS = [
    "How was your day?",
    "What made you smile today?",
    "Did you learn anything new?"
];

function applyTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
    const select = document.getElementById('themeSelect');
    if (select) select.value = theme;
}

function setupThemeToggle() {
    const select = document.getElementById('themeSelect');
    if (!select) return;
    select.addEventListener('change', () => {
        localStorage.setItem('theme', select.value);
        applyTheme();
    });
}

function randomQuestion() {
    return QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
}

function saveEntry(entry) {
    const entries = JSON.parse(localStorage.getItem('entries') || '[]');
    entries.push(entry);
    localStorage.setItem('entries', JSON.stringify(entries));
}

function loadEntries() {
    const container = document.getElementById('entries');
    if (!container) return;
    const entries = JSON.parse(localStorage.getItem('entries') || '[]');
    entries.forEach(e => {
        const div = document.createElement('div');
        div.innerHTML = `<strong>${e.date}</strong><p>${e.text}</p>`;
        if (e.photo) {
            const img = document.createElement('img');
            img.src = e.photo;
            img.width = 200;
            div.appendChild(img);
        }
        if (e.track) {
            const trackDiv = document.createElement('div');
            trackDiv.innerHTML = `<p>${e.track.name} - ${e.track.artist}</p>`;
            if (e.track.preview_url) {
                const audio = document.createElement('audio');
                audio.controls = true;
                audio.src = e.track.preview_url;
                trackDiv.appendChild(audio);
            }
            div.appendChild(trackDiv);
        }
        container.appendChild(div);
    });
}

function onIndexLoad() {
    const btn = document.getElementById('newEntry');
    if (btn) {
        btn.addEventListener('click', () => {
            window.location.href = 'diary.html';
        });
    }
    loadEntries();
}

function onDiaryLoad() {
    const questionDiv = document.getElementById('question');
    if (questionDiv) questionDiv.textContent = randomQuestion();

    const form = document.getElementById('diaryForm');
    const photoInput = document.getElementById('entryPhoto');
    let selectedTrack = null;

    const searchBtn = document.getElementById('searchBtn');
    const resultsDiv = document.getElementById('results');
    const selectedDiv = document.getElementById('selectedTrack');
    const searchInput = document.getElementById('spotifySearch');

    const token = localStorage.getItem('spotify_token'); // user must set this

    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const q = searchInput.value.trim();
            if (!q || !token) return;
            fetch(`https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(q)}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(r => r.json())
            .then(data => {
                resultsDiv.innerHTML = '';
                (data.tracks.items || []).forEach(track => {
                    const div = document.createElement('div');
                    div.innerHTML = `<img src="${track.album.images[2]?.url}" alt="">
                        ${track.name} - ${track.artists[0].name}`;
                    const btn = document.createElement('button');
                    btn.textContent = 'Select';
                    btn.addEventListener('click', () => {
                        selectedTrack = {
                            id: track.id,
                            name: track.name,
                            artist: track.artists[0].name,
                            preview_url: track.preview_url
                        };
                        selectedDiv.textContent = `${track.name} - ${track.artists[0].name}`;
                        if (track.preview_url) {
                            const audio = document.createElement('audio');
                            audio.controls = true;
                            audio.src = track.preview_url;
                            selectedDiv.appendChild(audio);
                        }
                    });
                    div.appendChild(btn);
                    resultsDiv.appendChild(div);
                });
            });
        });
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const reader = new FileReader();
            const entry = {
                date: document.getElementById('entryDate').value,
                text: document.getElementById('entryText').value,
                photo: null,
                track: selectedTrack
            };
            if (photoInput.files[0]) {
                reader.onload = () => {
                    entry.photo = reader.result;
                    saveEntry(entry);
                    window.location.href = 'index.html';
                };
                reader.readAsDataURL(photoInput.files[0]);
            } else {
                saveEntry(entry);
                window.location.href = 'index.html';
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    applyTheme();
    setupThemeToggle();
    if (document.body.id === 'index') {
        onIndexLoad();
    } else {
        onDiaryLoad();
    }
});
