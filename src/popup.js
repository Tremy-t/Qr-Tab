/**
 * QR Tab – Built by Uncle Drew (https://github.com/Tremy-t)
 * Licensed under CC BY-NC 4.0
 */

(() => {
  const qrWrapper = document.getElementById("qr-wrapper");
  const urlLabel  = document.getElementById("url-label");
  const dlBtn     = document.getElementById("download-btn");
  const errMsg    = document.getElementById("error-msg");

  /** Show error state */
  function showError(msg) {
    qrWrapper.style.display = "none";
    dlBtn.style.display     = "none";
    urlLabel.style.display  = "none";
    errMsg.textContent      = msg || "Could not read the current tab URL.";
    errMsg.style.display    = "block";
  }

  /**
   * Render a QR code into #qr-wrapper using qrcodejs (new QRCode()).
   * The library appends a <canvas> (or <img>) to the given element.
   */
  function renderQR(url) {
    // eslint-disable-next-line no-new
    new QRCode(qrWrapper, {
      text:         url,
      width:        184,
      height:       184,
      colorDark:    "#111111",
      colorLight:   "#ffffff",
      correctLevel: QRCode.CorrectLevel.M,
    });
  }

  /**
   * Download the QR code as a PNG.
   * qrcodejs renders a <canvas> element inside the wrapper — we grab it.
   * On some platforms it falls back to an <img> using a data URL.
   */
  function downloadQR(url) {
    let dataURL;

    const canvas = qrWrapper.querySelector("canvas");
    if (canvas) {
      dataURL = canvas.toDataURL("image/png");
    } else {
      const img = qrWrapper.querySelector("img");
      if (img) dataURL = img.src;
    }

    if (!dataURL) {
      alert("Could not export QR code.");
      return;
    }

    // Build a safe filename from the URL hostname + path
    let filename = "qr-code.png";
    try {
      const { hostname, pathname } = new URL(url);
      const slug = (hostname + pathname)
        .replace(/[^a-z0-9]/gi, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 60);
      if (slug) filename = `qr-${slug}.png`;
    } catch (_) { /* keep default */ }

    const link = document.createElement("a");
    link.download = filename;
    link.href     = dataURL;
    link.click();
  }

  // ---------- Main ----------

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs && tabs[0];

    if (!tab || !tab.url) {
      showError("Could not read the current tab URL.");
      return;
    }

    const url = tab.url;

    // Chrome internal pages can't have a meaningful QR code
    if (url.startsWith("chrome://") || url.startsWith("chrome-extension://")) {
      showError("QR codes cannot be generated for internal Chrome pages.");
      return;
    }

    // Display (truncated) URL below the QR box
    urlLabel.textContent = url;

    // Render QR code
    renderQR(url);

    // Wire up download button
    dlBtn.addEventListener("click", () => downloadQR(url));
  });
})();
