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

    // A / D: ONE fixed side image only.
    walkRight: "assets/player/PLAYER WALK RIGHT.png",
    walkLeft: "assets/player/PLAYER WALK LEFT.png",

    // S remains untouched: exact two-frame alternating animation.
    walkDown: [
      "assets/player/PLAYER WALK DOWN 1.png",
      "assets/player/PLAYER WALK DOWN 2.png"
    ],

    // W: ONE fixed image only.
    walkUp: "assets/player/PLAYER WALK UP 1.png",

    width: 420,
    height: 630,
    speed: 520,
    frameDuration: 120
  });

  const ZOOM_MULTIPLIERS = [1, 1.75, 3, 4.5];
  const ZOOM_DURATION = 300;

  const game = document.getElementById("game");
  const world = document.getElementById("world");
  const mapImage = document.getElementById("map");
  const playerEl = document.getElementById("player");
  const playerSprite = document.getElementById("playerSprite");
  const loading = document.getElementById("loading");
  const zoomLabel = document.getElementById("zoomLabel");
  const coordLabel = document.getElementById("coordLabel");
  const playerLabel = document.getElementById("playerLabel");

  if (!game || !world || !mapImage || !playerEl || !playerSprite) {
    throw new Error("Game DOM incomplete: map/player elements missing.");
  }

  const allSprites = [
    PLAYER.standRight,
    PLAYER.standLeft,
    PLAYER.walkRight,
    PLAYER.walkLeft,
    ...PLAYER.walkDown,
    PLAYER.walkUp
  ];

  const preloaded = {};
  allSprites.forEach((src) => {
    const img = new Image();
    img.src = src;
    preloaded[src] = img;
  });

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
  let activeSprite = "";
  let moving = false;

  let walkFrame = 0;
  let walkFrameTimer = 0;
  let currentAnimation = "idle";

  const keys = new Set();
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

  function clampPlayer() {
    const halfW = PLAYER.width / 2;
    const topClearance = PLAYER.height;
    const bottomClearance = 10;

    playerX = Math.max(halfW, Math.min(MAP.width - halfW, playerX));
    playerY = Math.max(topClearance, Math.min(MAP.height - bottomClearance, playerY));
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

  function setSprite(src) {
    if (activeSprite === src) return;
    activeSprite = src;
    playerSprite.src = encodeURI(src);
  }

  function setIdleSprite() {
    setSprite(
      facing === "left"
        ? PLAYER.standLeft
        : PLAYER.standRight
    );
  }

  function setAnimation(name) {
    if (currentAnimation === name) return;
    currentAnimation = name;
    walkFrame = 0;
    walkFrameTimer = 0;
  }

  function getMovementAnimation(dx, dy) {
    // NEW RULE:
    // Any movement containing S/down always uses the S two-frame animation,
    // including S+A and S+D.
    if (dy > 0) {
      if (dx > 0) facing = "right";
      if (dx < 0) facing = "left";
      return "down";
    }

    // Existing W diagonals remain side-facing.
    if (dx > 0) {
      facing = "right";
      return "right";
    }

    if (dx < 0) {
      facing = "left";
      return "left";
    }

    if (dy < 0) {
      return "up";
    }

    return "idle";
  }

  function renderMovementFrame(animationName, deltaSeconds) {
    if (animationName === "down") {
      walkFrameTimer += deltaSeconds * 1000;

      while (walkFrameTimer >= PLAYER.frameDuration) {
        walkFrameTimer -= PLAYER.frameDuration;
        walkFrame = (walkFrame + 1) % 2;
      }

      setSprite(PLAYER.walkDown[walkFrame]);
      return;
    }

    // A, D and W deliberately have no second frame anymore.
    if (animationName === "right") {
      setSprite(PLAYER.walkRight);
    } else if (animationName === "left") {
      setSprite(PLAYER.walkLeft);
    } else if (animationName === "up") {
      setSprite(PLAYER.walkUp);
    } else {
      setIdleSprite();
    }
  }

  function updatePlayerSprite(dx, dy, deltaSeconds) {
    const isMoving = dx !== 0 || dy !== 0;

    if (moving !== isMoving) {
      moving = isMoving;
      playerEl.classList.toggle("player--moving", moving);
      playerEl.classList.toggle("player--idle", !moving);
    }

    if (!moving) {
      setAnimation("idle");
      setIdleSprite();
      return;
    }

    const nextAnimation = getMovementAnimation(dx, dy);
    setAnimation(nextAnimation);
    renderMovementFrame(currentAnimation, deltaSeconds);
  }

  function updatePlayer(deltaSeconds) {
    let dx = 0;
    let dy = 0;

    if (keys.has("KeyW") || keys.has("ArrowUp")) dy -= 1;
    if (keys.has("KeyS") || keys.has("ArrowDown")) dy += 1;
    if (keys.has("KeyA") || keys.has("ArrowLeft")) dx -= 1;
    if (keys.has("KeyD") || keys.has("ArrowRight")) dx += 1;

    updatePlayerSprite(dx, dy, deltaSeconds);

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

    world.style.transform =
      `translate3d(${tx}px, ${ty}px, 0) scale(${displayScale})`;

    zoomLabel.textContent = `ZOOM ${zoomLevel}`;
    coordLabel.textContent =
      `KAMERA X: ${Math.round(cameraX)} · Y: ${Math.round(cameraY)}`;
    playerLabel.textContent =
      `SPIELER X: ${Math.round(playerX)} · Y: ${Math.round(playerY)}`;
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
    const eased = easeOutCubic(t);
    displayScale = zoomStartScale + (targetScale - zoomStartScale) * eased;

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

  window.addEventListener("resize", () => {
    const oldFitScale = fitScale;
    calculateFitScale();

    if (!oldFitScale) {
      displayScale = scaleForLevel(zoomLevel);
    } else {
      displayScale *= fitScale / oldFitScale;
    }

    targetScale = scaleForLevel(zoomLevel);

    if (!zoomAnimating) {
      displayScale = targetScale;
    }

    renderWorld();
  });

  function initialize() {
    calculateFitScale();
    displayScale = scaleForLevel(0);
    targetScale = displayScale;

    facing = "right";
    activeSprite = "";
    currentAnimation = "idle";
    setIdleSprite();

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

  playerSprite.addEventListener("error", () => {
    console.error("PLAYER SPRITE konnte nicht geladen werden:", playerSprite.src);
  });

  initialize();

  if (mapImage.complete && mapImage.naturalWidth > 0) {
    loading.classList.add("hidden");
    window.setTimeout(() => loading.remove(), 300);
  }
})();
