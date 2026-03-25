/**
 * QR Tab – Built by Uncle Drew (https://github.com/Tremy-t)
 * Licensed under CC BY-NC 4.0
 */

(() => {
  const qrWrapper = document.getElementById("qr-wrapper");
  const urlLabel  = document.getElementById("url-label");
  const dlBtn     = document.getElementById("download-btn");
  const errMsg    = document.getElementById("error-msg");

  let currentColor = localStorage.getItem("qrThemeColor") || "#111111";
  let currentShape = localStorage.getItem("qrShapeType")  || "square";
  let currentUrl   = "";

  // ---- Design presets -------------------------------------------------------
  // Each preset maps to qr-code-styling option types.
  // Keeping designs clean and scannable is the priority.
  const DESIGNS = {
    square: {
      dots:    "square",
      corners: "square",
      dots_c:  "square",
    },
    dots: {
      dots:    "dots",
      corners: "extra-rounded",
      dots_c:  "dot",
    },
    rounded: {
      dots:    "rounded",
      corners: "extra-rounded",
      dots_c:  "dot",
    },
  };

  // ---- Helpers --------------------------------------------------------------

  /** Build a fresh QRCodeStyling options object from current state. */
  function buildOptions(url) {
    const d = DESIGNS[currentShape] || DESIGNS.square;
    return {
      width:  184,
      height: 184,
      data:   url,
      margin: 4,
      qrOptions: {
        errorCorrectionLevel: "M",
      },
      dotsOptions: {
        color: currentColor,
        type:  d.dots,
      },
      backgroundOptions: {
        color: "#ffffff",
      },
      cornersSquareOptions: {
        color: currentColor,
        type:  d.corners,
      },
      cornersDotOptions: {
        color: currentColor,
        type:  d.dots_c,
      },
    };
  }

  /** Always destroy & recreate – the only reliable way to update styling. */
  function renderQR(url) {
    currentUrl = url;
    qrWrapper.innerHTML = "";
    const qr = new QRCodeStyling(buildOptions(url));
    qr.append(qrWrapper);
    // Store the instance on the wrapper so downloadQR can reach it.
    qrWrapper._qr = qr;
  }

  /** Show error state – hides the QR area and buttons. */
  function showError(msg) {
    qrWrapper.style.display = "none";
    dlBtn.style.display     = "none";
    urlLabel.style.display  = "none";
    errMsg.textContent      = msg || "Could not read the current tab URL.";
    errMsg.style.display    = "block";
  }

  // ---- Selectors ------------------------------------------------------------

  function initShapeSelector() {
    document.querySelectorAll(".shape-btn").forEach(btn => {
      if (btn.dataset.shape === currentShape) btn.classList.add("active");

      btn.addEventListener("click", e => {
        document.querySelectorAll(".shape-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentShape = btn.dataset.shape;
        localStorage.setItem("qrShapeType", currentShape);
        renderQR(currentUrl);
      });
    });
  }

  function initColorSelector() {
    document.querySelectorAll(".theme-swatch").forEach(swatch => {
      if (swatch.dataset.color === currentColor) swatch.classList.add("active");

      swatch.addEventListener("click", () => {
        document.querySelectorAll(".theme-swatch").forEach(s => s.classList.remove("active"));
        swatch.classList.add("active");
        currentColor = swatch.dataset.color;
        localStorage.setItem("qrThemeColor", currentColor);
        renderQR(currentUrl);
      });
    });
  }

  // ---- Download -------------------------------------------------------------

  function downloadQR() {
    const qr = qrWrapper._qr;
    if (!qr) return;

    let filename = "qr-code";
    try {
      const { hostname, pathname } = new URL(currentUrl);
      const slug = (hostname + pathname)
        .replace(/[^a-z0-9]/gi, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 60);
      if (slug) filename = `qr-${slug}`;
    } catch (_) { /* keep default */ }

    qr.download({ name: filename, extension: "png" });
  }

  // ---- Main -----------------------------------------------------------------

  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    const tab = tabs && tabs[0];

    if (!tab || !tab.url) {
      showError("Could not read the current tab URL.");
      return;
    }

    const url = tab.url;

    if (url.startsWith("chrome://") || url.startsWith("chrome-extension://")) {
      showError("QR codes cannot be generated for internal Chrome pages.");
      return;
    }

    urlLabel.textContent = url;

    renderQR(url);
    initShapeSelector();
    initColorSelector();

    dlBtn.addEventListener("click", downloadQR);
  });
})();
