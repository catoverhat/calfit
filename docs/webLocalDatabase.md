# Web Local Database

Calfit uses Expo SQLite on web. Expo SDK 56 marks this support as alpha and requires
`SharedArrayBuffer` isolation.

Production hosting must:

- serve the single-page app entry for unknown application routes such as `/routines/:id`;
- send `Cross-Origin-Embedder-Policy: credentialless`;
- send `Cross-Origin-Opener-Policy: same-origin`.

The EAS Hosting headers are declared through the `expo-router` plugin in `app.json`.
Other hosting providers must configure equivalent response headers and SPA rewrites.
