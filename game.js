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

    walkRight: "assets/player/PLAYER WALK RIGHT.png",
    walkLeft: "assets/player/PLAYER WALK LEFT.png",

    walkDown: [
      "assets/player/PLAYER WALK DOWN 1.png",
      "assets/player/PLAYER WALK DOWN 2.png"
    ],

    walkUp: "assets/player/PLAYER WALK UP 1.png",

    combatBase: "assets/player/combat/PLAYER COMBAT BASE.webp",
    combatBaseLeft: "assets/player/combat/PLAYER COMBAT BASE LEFT.webp",

    attackRight1: "assets/player/combat/PLAYER ATTACK RIGHT 1.webp",
    attackRight2: "assets/player/combat/PLAYER ATTACK RIGHT 2.webp",
    attackRight3: "assets/player/combat/PLAYER ATTACK RIGHT 3.webp",

    attackLeft1: "assets/player/combat/PLAYER ATTACK LEFT 1.webp",
    attackLeft2: "assets/player/combat/PLAYER ATTACK LEFT 2.webp",
    attackLeft3: "assets/player/combat/PLAYER ATTACK LEFT 3.webp",

    attackDown1: "assets/player/combat/PLAYER ATTACK DOWN 1.webp",
    attackDown2: "assets/player/combat/PLAYER ATTACK DOWN 2.webp",

    attackFinish: "assets/player/combat/PLAYER ATTACK FINISH.webp",
    attackFinishLeft: "assets/player/combat/PLAYER ATTACK FINISH LEFT.webp",
    blockRight: "assets/player/combat/PLAYER BLOCK.webp",
    blockLeft: "assets/player/combat/PLAYER BLOCK LEFT.webp",

    width: 420,
    height: 630,
    speed: 520,
    walkFrameDuration: 120
  });

  const ATTACK_RIGHT = Object.freeze([
    { sprite: PLAYER.attackRight1, duration: 400 },
    { sprite: PLAYER.combatBase, duration: 100 },
    { sprite: PLAYER.attackRight2, duration: 400 },
    { sprite: PLAYER.combatBase, duration: 100 },
    { sprite: PLAYER.attackRight3, duration: 400 },
    { sprite: PLAYER.combatBase, duration: 100 },
    { sprite: PLAYER.attackFinish, duration: 400 },
    { sprite: PLAYER.combatBase, duration: 100 }
  ]);

  const ATTACK_LEFT = Object.freeze([
    { sprite: PLAYER.attackLeft1, duration: 400 },
    { sprite: PLAYER.combatBaseLeft, duration: 100 },
    { sprite: PLAYER.attackLeft2, duration: 400 },
    { sprite: PLAYER.combatBaseLeft, duration: 100 },
    { sprite: PLAYER.attackLeft3, duration: 400 },
    { sprite: PLAYER.combatBaseLeft, duration: 100 },
    { sprite: PLAYER.attackFinishLeft, duration: 400 },
    { sprite: PLAYER.combatBaseLeft, duration: 100 }
  ]);

  const ATTACK_DOWN = Object.freeze([
    { sprite: PLAYER.combatBase, duration: 100 },
    { sprite: PLAYER.attackDown1, duration: 400 },
    { sprite: PLAYER.combatBase, duration: 100 },
    { sprite: PLAYER.attackDown2, duration: 400 },
    { sprite: PLAYER.combatBase, duration: 100 },
    { sprite: PLAYER.attackFinish, duration: 400 },
    { sprite: PLAYER.combatBase, duration: 100 }
  ]);

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
    PLAYER.walkUp,
    PLAYER.combatBase,
    PLAYER.combatBaseLeft,
    PLAYER.attackRight1,
    PLAYER.attackRight2,
    PLAYER.attackRight3,
    PLAYER.attackLeft1,
    PLAYER.attackLeft2,
    PLAYER.attackLeft3,
    PLAYER.attackDown1,
    PLAYER.attackDown2,
    PLAYER.attackFinish,
    PLAYER.attackFinishLeft,
    PLAYER.blockRight,
    PLAYER.blockLeft
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
  let lastHorizontalFacing = "right";
  let activeSprite = "";
  let moving = false;

  let walkFrame = 0;
  let walkFrameTimer = 0;
  let currentAnimation = "idle";

  let attackHeld = false;
  let attacking = false;
  let attackSequence = null;
  let attackStep = 0;
  let attackTimer = 0;
  let blocking = false;

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
    if (facing === "down") {
      setSprite(PLAYER.combatBase);
    } else if (facing === "left") {
      setSprite(PLAYER.standLeft);
    } else {
      setSprite(PLAYER.standRight);
    }
  }

  function setAnimation(name) {
    if (currentAnimation === name) return;
    currentAnimation = name;
    walkFrame = 0;
    walkFrameTimer = 0;
  }

  function getMovementAnimation(dx, dy) {
    // S / down has priority, including S+A and S+D.
    if (dy > 0) {
      facing = "down";
      return "down";
    }

    // W+A / W+D continue to use side-facing artwork.
    if (dx > 0) {
      facing = "right";
      lastHorizontalFacing = "right";
      return "right";
    }

    if (dx < 0) {
      facing = "left";
      lastHorizontalFacing = "left";
      return "left";
    }

    if (dy < 0) {
      facing = "up";
      return "up";
    }

    return "idle";
  }

  function renderMovementFrame(animationName, deltaSeconds) {
    if (animationName === "down") {
      walkFrameTimer += deltaSeconds * 1000;

      while (walkFrameTimer >= PLAYER.walkFrameDuration) {
        walkFrameTimer -= PLAYER.walkFrameDuration;
        walkFrame = (walkFrame + 1) % 2;
      }

      setSprite(PLAYER.walkDown[walkFrame]);
      return;
    }

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

  function chooseAttackSequence() {
    if (facing === "down") return ATTACK_DOWN;
    if (facing === "left") return ATTACK_LEFT;
    if (facing === "right") return ATTACK_RIGHT;

    // No dedicated UP attack exists. Use the last horizontal orientation.
    return lastHorizontalFacing === "left" ? ATTACK_LEFT : ATTACK_RIGHT;
  }

  function startAttackCombo() {
    if (attacking) return;

    attacking = true;
    moving = false;
    playerEl.classList.remove("player--moving");
    playerEl.classList.add("player--idle");

    attackSequence = chooseAttackSequence();
    attackStep = 0;
    attackTimer = 0;

    setSprite(attackSequence[0].sprite);
  }

  function finishAttackState() {
    attacking = false;
    attackSequence = null;
    attackStep = 0;
    attackTimer = 0;
    setIdleSprite();
  }

  function updateAttack(deltaSeconds) {
    if (!attacking || !attackSequence) return;

    attackTimer += deltaSeconds * 1000;

    while (attacking && attackTimer >= attackSequence[attackStep].duration) {
      attackTimer -= attackSequence[attackStep].duration;
      attackStep += 1;

      if (attackStep >= attackSequence.length) {
        // Full combo completed.
        if (attackHeld) {
          // Same orientation starts again immediately.
          attackSequence = chooseAttackSequence();
          attackStep = 0;
          attackTimer = 0;
          setSprite(attackSequence[0].sprite);
        } else {
          finishAttackState();
        }
        return;
      }

      setSprite(attackSequence[attackStep].sprite);
    }
  }


  function getBlockSprite() {
    return facing === "left" ? PLAYER.blockLeft : PLAYER.blockRight;
  }

  function startBlocking() {
    blocking = true;

    // CTRL = absolute freeze.
    // Cancel attack and forget movement keys so nothing resumes automatically.
    attackHeld = false;
    attacking = false;
    attackSequence = null;
    attackStep = 0;
    attackTimer = 0;

    keys.clear();

    moving = false;
    currentAnimation = "idle";
    walkFrame = 0;
    walkFrameTimer = 0;

    playerEl.classList.remove("player--moving");
    playerEl.classList.add("player--idle");

    setSprite(getBlockSprite());
  }

  function stopBlocking() {
    blocking = false;

    // On CTRL release return immediately to the correct resting pose.
    setIdleSprite();
  }

  function updatePlayer(deltaSeconds) {
    if (blocking) {
      setSprite(getBlockSprite());
      return;
    }

    if (attacking) {
      updateAttack(deltaSeconds);
      return;
    }

    let dx = 0;
    let dy = 0;

    if (keys.has("KeyW") || keys.has("ArrowUp")) dy -= 1;
    if (keys.has("KeyS") || keys.has("ArrowDown")) dy += 1;
    if (keys.has("KeyA") || keys.has("ArrowLeft")) dx -= 1;
    if (keys.has("KeyD") || keys.has("ArrowRight")) dx += 1;

    const isMoving = dx !== 0 || dy !== 0;

    if (!isMoving) {
      if (moving) {
        moving = false;
        playerEl.classList.remove("player--moving");
        playerEl.classList.add("player--idle");
      }
      setAnimation("idle");
      setIdleSprite();
      return;
    }

    if (!moving) {
      moving = true;
      playerEl.classList.add("player--moving");
      playerEl.classList.remove("player--idle");
    }

    const nextAnimation = getMovementAnimation(dx, dy);
    setAnimation(nextAnimation);
    renderMovementFrame(currentAnimation, deltaSeconds);

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
      "Equal", "NumpadAdd", "Minus", "NumpadSubtract",
      "Space", "ControlLeft", "ControlRight"
    ];

    if (controlled.includes(event.code)) event.preventDefault();

    if (event.code === "ControlLeft" || event.code === "ControlRight") {
      if (!blocking) startBlocking();
      return;
    }

    // While CTRL is held the block image is frozen.
    // Ignore every gameplay key until CTRL is released.
    if (blocking) {
      return;
    }

    if (event.code === "Space") {
      if (blocking) return;
      attackHeld = true;

      if (!attacking) {
        startAttackCombo();
      }

      return;
    }

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
    if (event.code === "ControlLeft" || event.code === "ControlRight") {
      event.preventDefault();
      if (blocking) stopBlocking();
      return;
    }

    if (event.code === "Space") {
      event.preventDefault();
      attackHeld = false;
      return;
    }

    keys.delete(event.code);
  }, { passive: false });

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
    lastHorizontalFacing = "right";
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
