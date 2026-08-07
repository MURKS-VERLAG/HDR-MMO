(() => {
  "use strict";

  const MAP = Object.freeze({
    id: "oberkirch-zentrum",
    name: "OBERKIRCH ZENTRUM",
    image: "assets/maps/OBERKIRCH ZENTRUM.webp",
    width: 10000,
    height: 6667
  });

  const ZOOM_MULTIPLIERS = [1, 1.75, 3, 4.5];
  const CAMERA_SPEED = 700;
  const ZOOM_DURATION = 300;

  const game = document.getElementById("game");
  const world = document.getElementById("world");
  const mapImage = document.getElementById("map");
  const loading = document.getElementById("loading");
  const zoomLabel = document.getElementById("zoomLabel");
  const coordLabel = document.getElementById("coordLabel");

  let viewportWidth = window.innerWidth;
  let viewportHeight = window.innerHeight;
  let fitScale = 1;
  let zoomLevel = 0;

  // Camera coordinates are always stored in original 10K map pixels.
  let cameraX = MAP.width / 2;
  let cameraY = MAP.height / 2;

  let displayScale = 1;
  let targetScale = 1;
  let zoomStartScale = 1;
  let zoomStartTime = 0;
  let zoomAnimating = false;

  const keys = new Set();
  let dragging = false;
  let dragLastX = 0;
  let dragLastY = 0;
  let lastFrame = performance.now();

  function calculateFitScale() {
    viewportWidth = window.innerWidth;
    viewportHeight = window.innerHeight;
    fitScale = Math.min(
      viewportWidth / MAP.width,
      viewportHeight / MAP.height
    );
  }

  function scaleForLevel(level) {
    return fitScale * ZOOM_MULTIPLIERS[level];
  }

  function clampCamera(scale = displayScale) {
    const visibleMapWidth = viewportWidth / scale;
    const visibleMapHeight = viewportHeight / scale;

    if (visibleMapWidth >= MAP.width) {
      cameraX = MAP.width / 2;
    } else {
      const halfW = visibleMapWidth / 2;
      cameraX = Math.max(halfW, Math.min(MAP.width - halfW, cameraX));
    }

    if (visibleMapHeight >= MAP.height) {
      cameraY = MAP.height / 2;
    } else {
      const halfH = visibleMapHeight / 2;
      cameraY = Math.max(halfH, Math.min(MAP.height - halfH, cameraY));
    }
  }

  function render() {
    clampCamera(displayScale);

    const mapScreenWidth = MAP.width * displayScale;
    const mapScreenHeight = MAP.height * displayScale;

    let tx = viewportWidth / 2 - cameraX * displayScale;
    let ty = viewportHeight / 2 - cameraY * displayScale;

    // At the fit-to-screen level, center the complete map with no panning.
    if (zoomLevel === 0 && !zoomAnimating) {
      tx = (viewportWidth - mapScreenWidth) / 2;
      ty = (viewportHeight - mapScreenHeight) / 2;
    }

    world.style.transform =
      `translate3d(${tx}px, ${ty}px, 0) scale(${displayScale})`;

    zoomLabel.textContent = `ZOOM ${zoomLevel}`;
    coordLabel.textContent =
      `X: ${Math.round(cameraX)} · Y: ${Math.round(cameraY)}`;
  }

  function setZoomLevel(nextLevel) {
    nextLevel = Math.max(0, Math.min(ZOOM_MULTIPLIERS.length - 1, nextLevel));
    if (nextLevel === zoomLevel) return;

    zoomLevel = nextLevel;
    zoomStartScale = displayScale;
    targetScale = scaleForLevel(zoomLevel);
    zoomStartTime = performance.now();
    zoomAnimating = true;

    if (zoomLevel === 0) {
      cameraX = MAP.width / 2;
      cameraY = MAP.height / 2;
    }
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function updateZoom(now) {
    if (!zoomAnimating) return;

    const t = Math.min(1, (now - zoomStartTime) / ZOOM_DURATION);
    const eased = easeOutCubic(t);
    displayScale = zoomStartScale + (targetScale - zoomStartScale) * eased;

    if (t >= 1) {
      displayScale = targetScale;
      zoomAnimating = false;
      clampCamera(displayScale);
    }
  }

  function updateKeyboard(deltaSeconds) {
    if (zoomLevel === 0) return;

    let dx = 0;
    let dy = 0;

    if (keys.has("KeyW") || keys.has("ArrowUp")) dy -= 1;
    if (keys.has("KeyS") || keys.has("ArrowDown")) dy += 1;
    if (keys.has("KeyA") || keys.has("ArrowLeft")) dx -= 1;
    if (keys.has("KeyD") || keys.has("ArrowRight")) dx += 1;

    if (!dx && !dy) return;

    const length = Math.hypot(dx, dy) || 1;
    dx /= length;
    dy /= length;

    // Keep camera travel visually useful at all zoom levels.
    const zoomRatio = targetScale / fitScale;
    const speed = CAMERA_SPEED * Math.max(1, 2.15 / zoomRatio);

    cameraX += dx * speed * deltaSeconds;
    cameraY += dy * speed * deltaSeconds;
    clampCamera(displayScale);
  }

  function frame(now) {
    const deltaSeconds = Math.min(0.05, (now - lastFrame) / 1000);
    lastFrame = now;

    updateZoom(now);
    updateKeyboard(deltaSeconds);
    render();

    requestAnimationFrame(frame);
  }

  window.addEventListener("keydown", (event) => {
    const controlled = [
      "KeyW", "KeyA", "KeyS", "KeyD",
      "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
      "Equal", "NumpadAdd", "Minus", "NumpadSubtract"
    ];

    if (controlled.includes(event.code)) event.preventDefault();

    if (event.code === "Equal" || event.code === "NumpadAdd") {
      setZoomLevel(zoomLevel + 1);
      return;
    }

    if (event.code === "Minus" || event.code === "NumpadSubtract") {
      setZoomLevel(zoomLevel - 1);
      return;
    }

    keys.add(event.code);
  }, { passive: false });

  window.addEventListener("keyup", (event) => {
    keys.delete(event.code);
  });

  game.addEventListener("wheel", (event) => {
    event.preventDefault();
    if (event.deltaY < 0) {
      setZoomLevel(zoomLevel + 1);
    } else if (event.deltaY > 0) {
      setZoomLevel(zoomLevel - 1);
    }
  }, { passive: false });

  game.addEventListener("pointerdown", (event) => {
    if (zoomLevel === 0) return;
    dragging = true;
    dragLastX = event.clientX;
    dragLastY = event.clientY;
    game.classList.add("dragging");
    game.setPointerCapture(event.pointerId);
  });

  game.addEventListener("pointermove", (event) => {
    if (!dragging || zoomLevel === 0) return;

    const dx = event.clientX - dragLastX;
    const dy = event.clientY - dragLastY;
    dragLastX = event.clientX;
    dragLastY = event.clientY;

    cameraX -= dx / displayScale;
    cameraY -= dy / displayScale;
    clampCamera(displayScale);
  });

  function endDrag(event) {
    if (!dragging) return;
    dragging = false;
    game.classList.remove("dragging");
    if (event.pointerId !== undefined && game.hasPointerCapture(event.pointerId)) {
      game.releasePointerCapture(event.pointerId);
    }
  }

  game.addEventListener("pointerup", endDrag);
  game.addEventListener("pointercancel", endDrag);

  window.addEventListener("resize", () => {
    const oldFitScale = fitScale;
    calculateFitScale();

    // Preserve the selected logical zoom level across window resizing.
    if (!oldFitScale) {
      displayScale = scaleForLevel(zoomLevel);
    } else {
      displayScale *= fitScale / oldFitScale;
    }

    targetScale = scaleForLevel(zoomLevel);
    if (!zoomAnimating) displayScale = targetScale;

    if (zoomLevel === 0) {
      cameraX = MAP.width / 2;
      cameraY = MAP.height / 2;
    }

    clampCamera(displayScale);
    render();
  });

  function initialize() {
    calculateFitScale();
    zoomLevel = 0;
    displayScale = scaleForLevel(0);
    targetScale = displayScale;
    cameraX = MAP.width / 2;
    cameraY = MAP.height / 2;
    render();
    requestAnimationFrame(frame);
  }

  mapImage.addEventListener("load", () => {
    loading.classList.add("hidden");
    window.setTimeout(() => loading.remove(), 300);
  });

  mapImage.addEventListener("error", () => {
    loading.textContent = "Karte konnte nicht geladen werden.";
  });

  initialize();

  if (mapImage.complete && mapImage.naturalWidth > 0) {
    loading.classList.add("hidden");
    window.setTimeout(() => loading.remove(), 300);
  }
})();
