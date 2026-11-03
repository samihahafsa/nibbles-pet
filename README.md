# Nibbles PWA — installable virtual pet

## Preview
Open `index.html` in a browser to test the game. Install prompts and offline caching require the app to be served over HTTPS or localhost.

## Publish free with GitHub Pages
1. Create a free GitHub account if you don't already have one.
2. Create a **Public** repository named `nibbles-pet`.
3. Upload the *contents* of this folder (index.html, app.js, style.css, manifest.json, service-worker.js, and icons folder).
4. Go to **Settings → Pages**.
5. Under **Build and deployment**, select **Deploy from a branch**.
6. Choose branch `main` and folder `/(root)`, then Save.
7. Wait for GitHub Pages to publish and open the URL it provides.

## Install on Android
1. Open the published HTTPS link in Chrome.
2. Tap the **Install app** button if it appears, or open Chrome's ⋮ menu and choose **Install app** / **Add to Home screen**.
3. Confirm. Nibbles will appear with its own icon and launch in an app-like window.

## Install on iPhone
1. Open the link in Safari.
2. Tap Share → Add to Home Screen → Add.

## Install on Windows
1. Open the HTTPS link in Chrome or Edge.
2. Use the install icon in the address bar, or browser menu → Apps → Install this site as an app (wording varies).

## Important
- No Play Store registration or payment is needed for this route.
- It is a home-screen/browser-installed PWA, not a Play Store listing or a standalone APK.
- Pet progress is saved locally in each browser/device and does not sync between devices yet.
- The service worker and install features require HTTPS; GitHub Pages provides HTTPS.
- Edit the secret note in `index.html` before gifting.
