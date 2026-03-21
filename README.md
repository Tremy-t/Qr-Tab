# QR Tab

> Built by **Uncle Drew** ([@Tremy-t](https://github.com/Tremy-t)).

> A lightweight Chrome extension that instantly generates a QR code for the current tab's URL.

![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue?style=flat-square)
![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey?style=flat-square)

---

## Features

-  **Instant QR codes** — one click generates a scannable QR code for any open page
-  **Save as PNG** — download the QR code with a filename derived from the site URL
-  **No tracking, no network requests** — everything runs locally inside the extension
-  **Zero dependencies at runtime** — the QR library is bundled; no CDN calls

---

## Project Structure

```
Qr gen/
├── icons/
│   ├── icon16.png       # Toolbar icon
│   ├── icon48.png       # Extension management page icon
│   └── icon128.png      # Chrome Web Store icon
├── src/
│   ├── popup.html       # Popup UI
│   ├── popup.js         # Tab query, QR render, PNG download logic
│   └── qrcode.min.js    # Bundled qrcodejs v1.0.0 (local copy)
├── manifest.json        # Chrome Manifest V3
├── README.md
└── LICENSE
```

---

## Installation (Developer / Unpacked)

1. Clone or download this repository.
2. Open Chrome and navigate to `chrome://extensions`.
3. Enable **Developer mode** (toggle in the top-right corner).
4. Click **Load unpacked** and select the root `Qr gen/` folder.
5. Pin the extension via the 🧩 puzzle-piece icon in the toolbar.

Navigate to any webpage and click the **QR Tab** icon to generate its QR code.

---

## Usage

| Action | Result |
|--------|--------|
| Click the extension icon | Opens a popup with the QR code for the active tab |
| Click **Save as PNG** | Downloads the QR code as a PNG file |
| Open an internal Chrome page | Shows a friendly "not supported" message |

---

## Customising the Icons

Replace the three files in `icons/` with your own artwork (PNG, same sizes) and reload the extension at `chrome://extensions`.

---

## Technology

- **Manifest V3** — latest Chrome extension platform
- **[qrcodejs](https://github.com/davidshimjs/qrcodejs)** v1.0.0 — QR code rendering (bundled locally)
- Pure HTML / CSS / JavaScript — no build step, no framework

---

## License

This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International** license.  
See [LICENSE](./LICENSE) for full terms.

**In short:** you may use, share, and adapt this software freely for personal and non-commercial purposes. Commercial use is not permitted without written permission from the author.
