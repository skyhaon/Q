# Diary Web App with Spotify Integration

This simple project lets you write diary entries with optional photos and an attached Spotify track.
Entries are stored in your browser's `localStorage` so no backend is required.

## Getting Started

1. Place the files on any static web server (or open `index.html` directly).
2. Before searching Spotify, store an access token in `localStorage`:
   - Open developer tools console and run:
     ```javascript
     localStorage.setItem('spotify_token', 'YOUR_ACCESS_TOKEN');
     ```
   - You can generate a token from the [Spotify Web API Console](https://developer.spotify.com/console/post-search-item/).
3. Use the `New Entry` button to create a diary entry. After saving, entries appear on the home page.
4. Use the theme selector to switch between light and dark modes.

This project is a minimal proof of concept and does not include authentication or a database.
