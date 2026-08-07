(() => {
  "use strict";

  const MAP = Object.freeze({
    id: "oberkirch-zentrum",
    name: "OBERKIRCH ZENTRUM",
    image: "assets/maps/OBERKIRCH ZENTRUM.webp",
    width: 10000,
    height: 6667
  });

  const PLAYER = Object.freeze({
    standRight: "assets/player/PLAYER STAND.png",
    standLeft: "assets/player/PLAYER STAND LEFT.png",
    width: 420,
    height: 630,
    speed: 520
  });

  const ZOOM_MULTIPLIERS = [1, 1.75, 3, 4.5];
  const ZOOM_DURATION = 300;

  const game = document.getElementById("game");
  const world = document.getElementById("world");
  const mapImage = document.getElementById("map");
  const playerEl = document.getElementById("player");
  const playerIdleSprite = document.getElementById("playerIdleSprite");
  const loading = document.getElementById("loading");
  const zoomLabel = document.getElementById("zoomLabel");
  const coordLabel = document.getElementById("coordLabel");
  const playerLabel = document.getElementById("playerLabel");
  const animLabel = document.getElementById("animLabel");

  let viewportWidth = window.innerWidth;
  let viewportHeight = window.innerHeight;
  let fitScale = 1;
  let zoomLevel = 0;

  let playerX = MAP.width / 2;
  let playerY = MAP.height / 2;
  let cameraX = playerX;
  let cameraY = playerY;

  let displayScale = 1;
  let targetScale = 1;
  let zoomStartScale = 1;
  let zoomStartTime = 0;
  let zoomAnimating = false;

  let facing = "right";
  let moving = false;

  const keys = new Set();
  let lastFrame = performance.now();

  function calculateFitScale() {
    viewportWidth = window.innerWidth;
    viewportHeight = window.innerHeight;
    fitScale = Math.min(viewportWidth / MAP.width, viewportHeight / MAP.height);
  }

  function scaleForLevel(level) {
    return fitScale * ZOOM_MULTIPLIERS[level];
  }

  function clampPlayer() {
    const halfW = PLAYER.width / 2;
    playerX = Math.max(halfW, Math.min(MAP.width - halfW, playerX));
    playerY = Math.max(PLAYER.height, Math.min(MAP.height - 10, playerY));
  }

  function clampCamera(scale = displayScale) {
    if (zoomLevel === 0 && !zoomAnimating) {
      cameraX = MAP.width / 2;
      cameraY = MAP.height / 2;
      return;
    }

    const visibleMapWidth = viewportWidth / scale;
    const visibleMapHeight = viewportHeight / scale;
    cameraX = playerX;
    cameraY = playerY;

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

  function setFacing(nextFacing) {
    if (nextFacing !== "left" && nextFacing !== "right") return;
    facing = nextFacing;
    playerEl.classList.toggle("player--left", facing === "left");
    playerEl.classList.toggle("player--right", facing === "right");
  }

  function updateVisualState(dx, dy) {
    const isMoving = dx !== 0 || dy !== 0;

    if (dx > 0) setFacing("right");
    if (dx < 0) setFacing("left");

    if (moving !== isMoving) {
      moving = isMoving;
      playerEl.classList.toggle("player--moving", moving);
      playerEl.classList.toggle("player--idle", !moving);
    }

    if (!moving) {
      playerIdleSprite.src = encodeURI(
        facing === "left" ? PLAYER.standLeft : PLAYER.standRight
      );
      animLabel.textContent =
        facing === "left" ? "ANIMATION: STAND LINKS" : "ANIMATION: STAND RECHTS";
    } else {
      animLabel.textContent =
        facing === "left" ? "ANIMATION: WALK LINKS" : "ANIMATION: WALK RECHTS";
    }
  }

  function updatePlayer(deltaSeconds) {
    let dx = 0;
    let dy = 0;

    if (keys.has("KeyW") || keys.has("ArrowUp")) dy -= 1;
    if (keys.has("KeyS") || keys.has("ArrowDown")) dy += 1;
    if (keys.has("KeyA") || keys.has("ArrowLeft")) dx -= 1;
    if (keys.has("KeyD") || keys.has("ArrowRight")) dx += 1;

    updateVisualState(dx, dy);

    if (!dx && !dy) return;

    const length = Math.hypot(dx, dy) || 1;
    dx /= length;
    dy /= length;

    playerX += dx * PLAYER.speed * deltaSeconds;
    playerY += dy * PLAYER.speed * deltaSeconds;
    clampPlayer();
  }

  function renderPlayer() {
    playerEl.style.left = `${playerX}px`;
    playerEl.style.top = `${playerY}px`;
  }

  function renderWorld() {
    clampCamera(displayScale);

    const mapScreenWidth = MAP.width * displayScale;
    const mapScreenHeight = MAP.height * displayScale;

    let tx = viewportWidth / 2 - cameraX * displayScale;
    let ty = viewportHeight / 2 - cameraY * displayScale;

    if (zoomLevel === 0 && !zoomAnimating) {
      tx = (viewportWidth - mapScreenWidth) / 2;
      ty = (viewportHeight - mapScreenHeight) / 2;
    }

    world.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${displayScale})`;

    zoomLabel.textContent = `ZOOM ${zoomLevel}`;
    coordLabel.textContent = `KAMERA X: ${Math.round(cameraX)} · Y: ${Math.round(cameraY)}`;
    playerLabel.textContent = `SPIELER X: ${Math.round(playerX)} · Y: ${Math.round(playerY)}`;
  }

  function setZoomLevel(nextLevel) {
    nextLevel = Math.max(0, Math.min(ZOOM_MULTIPLIERS.length - 1, nextLevel));
    if (nextLevel === zoomLevel) return;

    zoomLevel = nextLevel;
    zoomStartScale = displayScale;
    targetScale = scaleForLevel(zoomLevel);
    zoomStartTime = performance.now();
    zoomAnimating = true;
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function updateZoom(now) {
    if (!zoomAnimating) return;
    const t = Math.min(1, (now - zoomStartTime) / ZOOM_DURATION);
    displayScale = zoomStartScale + (targetScale - zoomStartScale) * easeOutCubic(t);

    if (t >= 1) {
      displayScale = targetScale;
      zoomAnimating = false;
    }
  }

  function frame(now) {
    const deltaSeconds = Math.min(0.05, (now - lastFrame) / 1000);
    lastFrame = now;

    updateZoom(now);
    updatePlayer(deltaSeconds);
    renderPlayer();
    renderWorld();

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

  window.addEventListener("keyup", (event) => keys.delete(event.code));

  game.addEventListener("wheel", (event) => {
    event.preventDefault();
    if (event.deltaY < 0) setZoomLevel(zoomLevel + 1);
    else if (event.deltaY > 0) setZoomLevel(zoomLevel - 1);
  }, { passive: false });

  window.addEventListener("resize", () => {
    const oldFitScale = fitScale;
    calculateFitScale();

    if (!oldFitScale) displayScale = scaleForLevel(zoomLevel);
    else displayScale *= fitScale / oldFitScale;

    targetScale = scaleForLevel(zoomLevel);
    if (!zoomAnimating) displayScale = targetScale;
    renderWorld();
  });

  function initialize() {
    calculateFitScale();
    displayScale = scaleForLevel(0);
    targetScale = displayScale;
    setFacing("right");
    playerIdleSprite.src = encodeURI(PLAYER.standRight);
    clampPlayer();
    renderPlayer();
    renderWorld();
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
